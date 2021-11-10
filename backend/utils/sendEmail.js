const nodeMailer = require('nodemailer');

const sendEmail = async (options)=>{


    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        service: process.env.SMTP_SERVICE,
        secure: true,
        auth:{
            // SMTP means simple mail transfer protocol
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // console.log(transporter.options);

    transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
    });

    const mailOptions = {
        from: "code.nikhil21@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);

    // console.log("done");
};

module.exports = sendEmail;