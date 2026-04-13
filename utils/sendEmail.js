import nodemailer from 'nodemailer'
export const sendEmail = async options => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD
        }

    });
    const message = {
        from: `${process.env.NODEMAILER_FROM} <${process.NODEMAILER_FROM_EMAIL}`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transport.sendMail(message)
}