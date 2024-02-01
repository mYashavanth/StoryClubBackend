// otpService.js

const twilio = require('twilio');
const accountSid = "AC63fad65b60b7774075a90c0bdad41691";
const authToken = "67f3a286d18520f35d19c40ebd8a67a7";
const client = twilio(accountSid, authToken);

// Function to generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Function to send OTP
function sendOTP(phoneNumber, otp) {
    client.messages
      .create({
        body: `Your OTP for verification is: ${otp}`,
        from: +19382232916,
        // from: "+12546153953",
        // messagingServiceSid: "MG3fed39135045fc6c1f3ba41711443cd2",
        to: phoneNumber,
      })
      .then((message) => console.log(message.sid, otp))
      .catch((err) => console.log(err));
}

module.exports = { generateOTP, sendOTP };
