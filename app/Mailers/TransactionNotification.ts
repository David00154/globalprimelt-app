import { BaseMailer, MessageContract } from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";
import env from "@ioc:Adonis/Core/Env";

export default class TransactionNotification extends BaseMailer {
  constructor(private user: User, private topUp: boolean) {
    super();
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  /**
   * The prepare method is invoked automatically when you run
   * "TransactionNotification.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    let grammer = this.topUp ? "topped up" : "topped down";
    let body = `
    <p>Dear ${this.user.fullName},</p>
    
    <p>Your account has been ${grammer}, bellow is the transaction summary information.</p>
    
      <ul>
                <li>
                    <p>Profit: $${new Intl.NumberFormat("en-us").format(
                      this.user.profit
                    )}</p>
                </li>
                <li>
                    <p>Balance: $${new Intl.NumberFormat("en-us").format(
                      this.user.balance
                    )}</p>
                </li>
                <li>
                    <p>Deposit: $${new Intl.NumberFormat("en-us").format(
                      this.user.totalDeposit
                    )}</p>
                </li>
            </ul>
    `;
    message
      .subject("Transaction Notification for " + this.user.userName)
      .from(`GlobalPrimeLtBot <${env.get("SMTP_USERNAME")}>`)
      .to(this.user.email)
      .htmlView("emails/transaction_notification", {
        body,
        subject: "Transaction Notification",
      });
  }
}
