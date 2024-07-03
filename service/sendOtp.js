const axios = require('axios');

const sendOtp = async (phone, OTP) => {
    //setting state
    let isSent = false;

    //URL to send OTP
    const url = 'https://api.managepoint.co/api/sms/send';

    //payload to send
    const payLoad = {
        'apiKey': '7cdf45cf-4159-4bdf-9a6c-2da372ab6f09',
        'to': phone,
        'message': `Your verification code is ${OTP}`
    }

    try {
        const res = await axios.post(url, payLoad)
        if(res.status === 200){
            isSent = true;
        }
    } catch (error) {
        console.log('Error sending OTP', error.message)
    }

    return isSent;
}

module.exports = sendOtp;
