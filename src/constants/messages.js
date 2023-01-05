export const generateOtpSendMess = (firstName, email, otp) => {
  const message = `
  <html>
    <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    </head>
    <body>
      <div class='container lead'>
        <p>Hello ${firstName},</p>
        <p>Your OTP for email ${email} is <b class='danger'>${otp}</b>.
          <br/>Use this OTP to complete your verification. This OTP is valid for next 10 minutes.
          <br/>Thank You<br/>Secured by @BKART
        </p>
      </div>
    </body>
  </html>
  `;
  return message;
};

export const resetPassword = () => {

};

export const generateOrderMail = (firstName, trackingStatus, orderId) => {
  const message = `
  <html>
    <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    </head>
    <body>
      <div class='container lead'>
        <p>Hello <b>${firstName}</b>,</p>
        <p>Your Order status is: <b>${trackingStatus}</b></p></br>
        <p>Your Order Id is: <b>${orderId}</b></p></br>
          <br/>Thank You<br/>Secured by @BKART
        </p>
      </div>
    </body>
  </html>
 `;
  return message;
};
