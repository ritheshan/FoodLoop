import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_API_KEY_SECRET;
const fromNumber = process.env.TWILIO_NUMBER;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: `+91${to}`
    });
    return true;
  } catch (err) {
    console.error('❌ SMS failed:', err.message);
    return false;
  }
};