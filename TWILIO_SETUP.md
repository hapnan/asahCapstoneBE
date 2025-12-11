# Twilio VoIP Integration - Setup Guide

## Overview

This guide will help you set up Twilio VoIP calling functionality in your Hapi.js backend.

## Prerequisites

- Twilio account (sign up at https://www.twilio.com/)
- A Twilio phone number with Voice capability
- Twilio API credentials

## Setup Steps

### 1. Create Twilio Account and Get Credentials

1. **Sign up for Twilio**
   - Go to https://www.twilio.com/try-twilio
   - Create a free trial account
   - Verify your email and phone number

2. **Get Account SID**
   - Go to Twilio Console Dashboard
   - Copy your `Account SID`
   - Add to `.env` as `TWILIO_ACCOUNT_SID`

3. **Create API Key**
   - Go to Account > API Keys & Tokens > Create API key
   - Choose "Standard" key type
   - Give it a friendly name (e.g., "VoIP Backend")
   - Copy the `SID` and `Secret` (Secret shown only once!)
   - Add to `.env` as `TWILIO_API_KEY` and `TWILIO_API_SECRET`

4. **Get a Twilio Phone Number**
   - Go to Phone Numbers > Manage > Buy a number
   - Filter by "Voice" capability
   - Choose and buy a number
   - Add to `.env` as `TWILIO_CALLER_NUMBER` (E.164 format: +1234567890)

5. **Create TwiML Application**
   - Go to Voice > TwiML > TwiML Apps
   - Click "Create new TwiML App"
   - Set friendly name (e.g., "Asah VoIP")
   - Configure Voice URLs:
     - **Voice Request URL**: `https://your-domain.com/voice/response` (HTTP POST)
     - **Status Callback URL**: `https://your-domain.com/voice/status` (HTTP POST)
   - Save and copy the `TwiML App SID`
   - Add to `.env` as `TWILIO_TWIML_APP_SID`

### 2. Environment Variables

Add these to your `.env` file:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_CALLER_NUMBER=+1234567890
```

### 3. API Endpoints

#### **GET /voice/token**

Generate Twilio access token for VoIP calls

**Authentication**: Required (session-based)

**Response**:

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "identity": "user123"
  }
}
```

**Usage**:

```javascript
// Frontend - Get token
const response = await fetch("http://localhost:3000/voice/token", {
  credentials: "include",
});
const { data } = await response.json();
const { token } = data;

// Use token with Twilio Client SDK
const device = new Twilio.Device(token);
```

#### **POST /voice/response**

Webhook endpoint for Twilio to get TwiML instructions

**Authentication**: None (Twilio webhook)

**Request Body**:

```json
{
  "phoneNumber": "+1234567890",
  "enableRecording": false
}
```

**Response**: TwiML XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="+1234567890">
    <Number>+1234567890</Number>
  </Dial>
</Response>
```

#### **POST /voice/status**

Webhook endpoint for call status updates

**Authentication**: None (Twilio webhook)

**Request Body** (from Twilio):

```json
{
  "CallSid": "CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "CallStatus": "completed",
  "From": "+1234567890",
  "To": "+0987654321",
  "Duration": "125",
  "RecordingUrl": "https://...",
  "RecordingSid": "RExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### 4. Frontend Integration Example

```javascript
// 1. Load Twilio Client SDK
<script src="https://sdk.twilio.com/js/client/v1.14/twilio.min.js"></script>;

// 2. Get token from your backend
async function initializeTwilio() {
  const response = await fetch("http://localhost:3000/voice/token", {
    credentials: "include",
  });
  const { data } = await response.json();

  // 3. Initialize Twilio Device
  const device = new Twilio.Device(data.token, {
    codecPreferences: ["opus", "pcmu"],
    fakeLocalDTMF: true,
    enableRingingState: true,
  });

  // 4. Setup event listeners
  device.on("ready", () => {
    console.log("Twilio Device Ready");
  });

  device.on("error", (error) => {
    console.error("Twilio Device Error:", error);
  });

  device.on("connect", (connection) => {
    console.log("Call connected");
  });

  device.on("disconnect", (connection) => {
    console.log("Call ended");
  });

  return device;
}

// 5. Make a call
async function makeCall(phoneNumber) {
  const device = await initializeTwilio();

  const connection = await device.connect({
    params: {
      To: phoneNumber,
    },
  });
}

// 6. Hang up
function hangUp(device) {
  device.disconnectAll();
}
```

### 5. Testing with Development Environment

For local development, you'll need to expose your localhost to the internet so Twilio can reach your webhooks:

#### Option 1: ngrok

```bash
# Install ngrok
npm install -g ngrok

# Run your server
npm run start:dev

# In another terminal, expose port 3000
ngrok http 3000

# Use the ngrok URL in your TwiML App configuration
# Example: https://abc123.ngrok.io/voice/response
```

#### Option 2: Railway/Heroku Deployment

Deploy your backend to a public URL and use that in your TwiML App configuration.

### 6. Phone Number Format

Always use **E.164 format** for phone numbers:

- ✅ Correct: `+1234567890` (country code + number)
- ❌ Wrong: `1234567890`, `(123) 456-7890`, `+1 (123) 456-7890`

### 7. Security Considerations

1. **Webhook Validation** (Optional but Recommended):
   Add Twilio request validation to ensure webhooks are from Twilio:

```javascript
import twilio from "twilio";

const validateTwilioRequest = (request, h) => {
  const twilioSignature = request.headers["x-twilio-signature"];
  const url = `https://your-domain.com${request.path}`;

  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    twilioSignature,
    url,
    request.payload,
  );

  if (!isValid) {
    return h.response({ error: "Invalid signature" }).code(403).takeover();
  }

  return h.continue;
};
```

2. **Rate Limiting**: Implement rate limiting on `/voice/token` endpoint
3. **CORS**: Ensure CORS is properly configured for your frontend domain

### 8. Trial Account Limitations

Twilio trial accounts have restrictions:

- Can only call verified phone numbers
- Calls have a trial message at the beginning
- Limited credits ($15 typically)

To remove limitations, upgrade to a paid account.

### 9. Troubleshooting

**Error: "Missing required Twilio environment variables"**

- Ensure all 5 Twilio env variables are set in `.env`

**Error: "Invalid phone number format"**

- Use E.164 format: `+[country code][number]`

**Webhook not working**

- Verify your TwiML App URLs are correct
- Ensure your server is publicly accessible (use ngrok for local dev)
- Check Twilio debugger: https://www.twilio.com/console/debugger

**Token expired**

- Tokens expire after 1 hour, regenerate by calling `/voice/token` again

## Resources

- [Twilio Voice SDK Documentation](https://www.twilio.com/docs/voice/sdks)
- [TwiML Reference](https://www.twilio.com/docs/voice/twiml)
- [Twilio Client JavaScript SDK](https://www.twilio.com/docs/voice/client/javascript)
- [Twilio Console](https://www.twilio.com/console)
