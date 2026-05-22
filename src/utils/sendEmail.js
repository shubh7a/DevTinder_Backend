const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {

    const transporter = nodemailer.createTransport({

        service: "gmail",

        auth: {
            user: "yourgmail@gmail.com",
            pass: "your_app_password",
        },

    });

    await transporter.sendMail({
        from: "yourgmail@gmail.com",
        to,
        subject,
        html,
    });

};

module.exports = sendEmail;