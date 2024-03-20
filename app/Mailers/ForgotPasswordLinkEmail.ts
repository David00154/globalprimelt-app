import { BaseMailer, MessageContract } from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";
import env from "@ioc:Adonis/Core/Env";

export default class ForgotPasswordLinkEmail extends BaseMailer {
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()
  constructor(private user: User) {
    super();
  }

  /**
   * The prepare method is invoked automatically when you run
   * "ForgotPasswordLinkEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare(message: MessageContract) {
    const resetCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    await this.user
      .merge({
        forgotPasswordToken: resetCode,
      })
      .save();
    message
      .subject("Password Reset Request")
      .from("Admin " + "<" + env.get("SMTP_USERNAME") + ">")
      .to(this.user.email)
      .htmlView("emails/clientmail", {
        subject: "Password Reset Request",
        body: `Dear ${this.user.fullName},

We received a request to reset the password for your account. To proceed with the password reset process, please click on the following link:

<a href="https://app.quadrafx.space/auth/forgot-password/reset-link/verify-with-code/?code=${resetCode}">Reset Link</a>

If you did not request a password reset or are unsure why you received this email, please disregard it. Your account security is important to us, and we recommend contacting our support team if you have any concerns.`
          .split("\n")
          .map((text) => {
            if (text == "") {
              return ``;
            } else {
              return `<p>${text}</p>`;
            }
          })
          .join(""),
      });
  }
}
