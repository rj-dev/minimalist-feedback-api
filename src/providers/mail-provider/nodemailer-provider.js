const nodemailer = require("nodemailer");
const MailProvider = require("./mail-provider");
const { env } = require("../../env");

class NodemailerProvider extends MailProvider {
  #transporter; // Private property

  constructor() {
    super();
    this.#transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    });
  }

  async sendMail({ to, subject, body }) {
    await this.#transporter.sendMail({
      from: "Feedback Tool <no-reply@feedback.com>",
      to,
      subject,
      html: body,
    });
  }
}

module.exports = NodemailerProvider;
