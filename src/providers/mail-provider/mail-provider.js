// This is the contract/interface for our mail service
// If we change from Nodemailer to SendGrid later, we just create a new provider
class MailProvider {
  async sendMail({ to, subject, body }) {
    throw new Error("Method 'sendMail' must be implemented.");
  }
}

module.exports = MailProvider;
