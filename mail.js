const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');


const auth = {
    auth: {
        api_key: '41b926816dad1eaf874f9f3de58e7d62-e566273b-999cb3f6',
        domain: 'sandboxa39746e8d63045239df2cec6667b17da.mailgun.org'
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));


const sendMail = (email, subject, text,first_name, cb) => {
    const mailOptions = {
     
        from: email,
        to: 'mirkoklepic97@gmail.com',  
        subject:subject,
        text:"Nova poruka od: " + first_name + " \n \n "+text,
        
        
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, data);
        }
    });
}


module.exports = sendMail;
