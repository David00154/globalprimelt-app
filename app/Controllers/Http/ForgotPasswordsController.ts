import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import ForgotPasswordLinkEmail from "App/Mailers/ForgotPasswordLinkEmail";
import User from "App/Models/User";

export default class ForgotPasswordsController {
  public async forgotPasswordShow({ view }: HttpContextContract) {
    return view.render("auth/forgot_password");
  }
  public async forgotPassword({
    request,
    response,
    session,
  }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          email: schema.string([rules.trim(), rules.email()]),
        }),
      });
      const user = await User.query()
        .from("users")
        .where("email", payload.email)
        .first();
      if (!user) {
        session.flashAll();
        session.flash("form.error", "The email provided does not exist!");
        return response.redirect().back();
      } else {
        try {
          await new ForgotPasswordLinkEmail(user).send();
          session.flash("form.success", "Reset link sent.");
          return response.redirect().toRoute("forgot-password.show");
        } catch (err) {
          session.flashAll();
          session.flash(
            "form.error",
            "Unable to send reset link at this time."
          );
          console.log(err);
          response.redirect().back();
        }
      }
    } catch (error) {
      session.flashAll();
      if (error.messages) {
        session.flash(
          "form.error",
          (Object.values(error.messages)[0] as Array<String>)[0]
        );
      } else {
        session.flash("form.error", "Internal Server Error");
      }
      console.log(error);
      response.redirect().back();
    }
  }
  public async confirmLink({
    request,
    response,
    session,
    auth,
  }: HttpContextContract) {
    try {
      const code = request.qs();
      if ((code as Object).hasOwnProperty("code") && code.code != null) {
        const user = await User.query()
          .from("users")
          .where("forgot_password_token", code.code)
          .first();
        if (user) {
          session.flashAll();
          await auth.use("web").login(user, true);
          await user
            .merge({
              forgotPasswordToken: null,
            })
            .save();
          if (user.password === "supersuperadmin") {
            return response.redirect("/admin/");
          } else {
            return response.redirect("/" + user.userName + "/change-password");
          }
        } else {
          session.flashAll();
          session.flash("form.error", "Invalid reset password link.");
          return response.redirect().toRoute("forgot-password.show");
        }
      } else {
        session.flashAll();
        session.flash("form.error", "Invalid reset password link.");
        return response.redirect().toRoute("forgot-password.show");
      }
    } catch (error) {
      session.flashAll();
      session.flash("form.error", "Internal Server Error");
      console.log(error);
      return response.redirect().toRoute("forgot-password.show");
    }
  }
}
