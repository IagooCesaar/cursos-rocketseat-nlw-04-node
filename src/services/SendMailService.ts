import path from 'path'
import fs from 'fs'
import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'

interface MailToSend {
  to: string;
  subject: string;
  body: string;
}

class SendMailService {
  private cliente: Transporter;

  constructor() {
    nodemailer.createTestAccount()
      .then(account => {
        const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        this.cliente = transporter;
      })

  }

  async execute (mail:MailToSend){
    const { body, subject, to } = mail;

    const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
    const templateFileContent = fs.readFileSync(npsPath).toString('utf-8')
    const mailTemplateParse = handlebars.compile(templateFileContent)
    const html = mailTemplateParse({
      name: to,
      title: subject,
      description: body
    })
    
    const message = await this.cliente.sendMail({
      to,
      subject,
      html,
      from: 'NPS <noreplay@nps.com.br'
    })

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();