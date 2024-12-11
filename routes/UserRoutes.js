import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import dotenv from 'dotenv'
const router = express.Router();
import Stripe from 'stripe';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_PASSWORD);//middleware to verify user
const verifyUser=async(req,res,next)=>{
    try{
    const token=req.headers.authorization.split(' ')[1];
    if(!token){
        return res.json({status:false,message:"no token"})
    }

    const decoded=await jwt.verify(token,process.env.KEY);
    req.user = decoded;
    next();
}
catch(error){
    return res.json(error);
}
}

// Sign up
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.json({ message: 'User already existed' });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashpassword,
    });

    await newUser.save();
    return res.json({ status: true, message: 'record registered' });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({status: false, message: 'user is not registered' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.json({ status: false,message: "password is incorrect" });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.KEY, { expiresIn: '1h' });
    console.log('Generated Token:', token);
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    return res.json({ status: true, message: 'login successfully' ,token});
});

// Forgot password
router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'user not registered' });
        }
        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '1h' });

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dcruise0253@gmail.com',
                pass: 'oroe njgn szac jksx'
            }
        });

        var mailOptions = {
            from: 'dcruise0253@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:3005/resetpassword/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.json({ status: true, message: 'Email sent' });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: 'An error occurred' });
    }
});

// Reset password
router.post('/resetpassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const id = decoded.id;
        const hashpassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate({ _id: id }, { password: hashpassword });
        return res.json({ status: true, message: 'password updated successfully' });
    } catch (err) {
        console.log(err);
        return res.json({ status: false, message: 'invalid token' });
    }
});

router.get("/verify",verifyUser,(req,res)=>{
     return res.json({status:true,message:"authorized"})
})

//payment router
router.post("/payment",(req,res)=>{

    stripe.charges.create({
      source : req.body.tokenId ,
      amount : req.body.amount,
      currency : "usd",
  
    },(stripeErr,stripeRes)=>{
      if(stripeErr){
        res.json({stripeErr})
      }
      else{
        res.json({stripeRes})
      }
    })
  }) 


export { router as UserRouter };
