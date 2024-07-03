const userModel = require('../models/userModel.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOtp = require('../service/sendOtp.js');

const createUser = async (req, res) => {
    //1. Check incoming data
    console.log(req.body);

    //2. Destructure the incoming data
    const { firstName, lastName, email, password, phone } = req.body;

    //3.Validate the data (if empty, stop the process and send res)
    if (!firstName || !lastName || !email || !password || !phone) {
        // res.send("Please enter all fields!")
        res.json({
            "success": false,
            "message": "Please enter all fields!"
        })
    }
    //4. Error Handling (Try Catch)
    try {
        //5. Check if the user is already registered
        const existingUser = await userModel.findOne({ email: email })
        //5.1 If the user is found: Send response
        if (existingUser) {
            return res.json({
                "success": false,
                "message": "User Already Exists!"
            })
        }

        //5.1.1 Stop the process
        //5.2 if user is new: 


        //5.2.1 Hash the password
        // Hashing/Encryption of the password
        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, randomSalt)
        const newUser = new userModel({
            //Database Fields: Client's Value
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            phone: phone
        })

        //5.2.2 Save to the database
        await newUser.save()

        //5.2.3 Send successfull response
        res.json({
            "success": true,
            "message": "User Created Successfuly!"
        })

    } catch (error) {
        console.log(error)
        res.json({
            "success": false,
            "message": "Internal server error"
        })
    }


    // res.send("Created user API is working!")
}

//Login function
const loginUser = async (req, res) => {
    // res.send("Login API is working!")

    //Check incoming data
    console.log(req.body)

    //Desctructing
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
        return res.json({
            "success": false,
            "message": "Please enter all fields!"
        })
    }

    //try catch
    try {
        //find user (email)
        const user = await userModel.findOne({ email: email })
        //Found data: firstName, lastName, email, password

        //not found (error message)
        if (!user) {
            return res.json({
                "success": false,
                "message": "User doesn't exist!!"
            })
        }

        //Compare password (bcrypt)
        const isValidPassword = await bcrypt.compare(password, user.password)

        //not valid (error)
        if (!isValidPassword){
            return res.json({
                "success": false,
                "message": "Password not matched!"
            })
        } 

        //token (Generate - user Data + KEY)
        const token = await jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            'SECRETKEY'
        )

        //response (token, user data)
        res.json({
            "success": true,
            "message": "User Logged in Successfully",
            "token": token,
            "userData": user
        })

    } catch (error) {
        console.log(error)
        return res.json({
            "success": false,
            "message": "Internal Server Error!"
        })
    }
}

//Forgot password by using phone number
const forgotPassword = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({
            "success": false,
            "message": "Please enter phone number!"
        })
    }
    try {
        //finding user
        const user = await userModel.findOne({ phone: phone })
        if (!user) {
            return res.status(400).json({
                "success": false,
                "message": "User not found!"
            })
        }

        //Generate random 6 digit OTP
        const OTP = Math.floor(100000 + Math.random() * 900000)

        //generate expiry date
        const expiryDate = Date.now() + 360000

        //save to database for verification
        user.resetPasswordOTP = OTP
        user.resetPasswordExpires = expiryDate
        await user.save()

        //send OTP to registered phone number
        const isSent = await sendOtp(phone, OTP)
        if (!isSent) {
            return res.status(400).json({
                "success": false,
                "message": "Error sending OTP code!"
            })
        }

        //if success
        return res.status(200).json({
            "success": true,
            "message": "OTP sent successfully!"
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error!"
        })
    }
}

//Verify otp and set new password
const verifyOtpAndSetPassword = async (req, res) => {
    //get data
    const {phone, otp, newPassword} = req.body;
    if(!phone || !otp || !newPassword){
        return res.status(400).json({
            "success": false,
            "message": "Please enter all fields!"
        })
    }

    try {
        const user = await userModel.findOne({phone: phone})
        
        //Verify OTP
        if(user.resetPasswordOTP != otp){
            return res.status(400).json({
                "success": false,
                "message": "Invalid OTP!"
            })
        }

        if(user.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                "success": false,
                "message": "OTP Expired!"
            })
        }

        //password hashing
        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, randomSalt)

        //update to database
        user.password = hashedPassword
        await user.save()

        //response
        return res.status(200).json({
            "success": true,
            "message": "OTP verified and password updated successfully!"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error!"
        })
    }
}
//exporting
module.exports = {
    createUser,
    loginUser,
    forgotPassword,
    verifyOtpAndSetPassword
}