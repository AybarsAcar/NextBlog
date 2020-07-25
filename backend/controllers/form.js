//import the sendgrid and pass the API key
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//email the admin
exports.contactForm = (req, res) => {

  const {email, name, message} = req.body;
  // console.log(data);

  const emailData = {
    to: process.env.EMAIL_TO,
    from: email,
    subject: `Contact form - ${process.env.APP_NAME}`,
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
      <h2>Email received from contact form:</h2>
      <h4>Sender Name: ${name}</h4>
      <h4>Sender Email: ${email}</h4>
      <p>Sender Message: ${message}</p>
      <hr />
      <p>This email may contain sensitive information</p>
      <p>https://seoblog.com</p>
    `
  };

  //so we can handle it further in the client side
  sgMail.send(emailData).then(sent => {
    return res.json({
      success: true
    })
  }).catch(err => console.log(err))
  
}


//contact the author
exports.contactBlogAuthorForm = (req, res) => {

  const {authorEmail, email, name, message} = req.body;
  // console.log(data);

  // let mailList = [authorEmail, process.env.EMAIL_TO]

  const emailData = {
    to: authorEmail,
    from: email,
    subject: `Someone messaged you from - ${process.env.APP_NAME}`,
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
      <h2>Message received from:</h2>
      <h4>Sender Name: ${name}</h4>
      <h4>Sender Email: ${email}</h4>
      <p>Sender Message: ${message}</p>
      <hr />
      <p>This email may contain sensitive information</p>
      <p>https://seoblog.com</p>
    `
  };

  //so we can handle it further in the client side
  sgMail.send(emailData).then(sent => {
    return res.json({
      success: true
    })
  }).catch(err => {
    console.log(err);
  })
  
}


