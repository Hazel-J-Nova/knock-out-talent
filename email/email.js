if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const sgMail = require("@sendgrid/mail");

module.exports.buildParams = (recipient, emailSubject, bodyText, bodyHtml) => {
  const params = {
    to: recipient,
    from: "knockout.talent.models@gmail.com",
    subject: emailSubject,
    text: bodyText,
    html: bodyHtml,
  };
  return params;
};
module.exports.sendEmail = (msg) => {
  send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
