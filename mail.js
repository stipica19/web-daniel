const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');


const auth = {
    auth: {
        api_key: '',
        domain: ''
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
