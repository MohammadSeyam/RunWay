import {User} from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const register = async (req,res)=>{
    try{
        const {fullname,email,phoneNumber,password,role} = req.body
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message:"something is missing",
                success:false
            })
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                message:"User already exist with this email",
                success:false
            })
        }
        const hashedPassword = await bcrypt.hash(password,10)

        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role
        })
        res.status(201).json({
            message:"Account created sucessfully",
            success:true
        })
    }
    catch(err){
        console.log(err)
    }
}


export const login = async (req,res)=>{
    try{
        const {email,password,role} = req.body

        if(!email || !password || !role){
            return res.status(400).json({
                message:"something is missing",
                success:false
            })
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"Incorrect email",
                success:false,
            })
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Incorrect Password",
                success: false
            })
        }

        //check role is correct or not
        if(role !== user.role){
            return res.status(400).json({
                message:"Account does not exit with current role",
                success:false
            })
        }

        const tokenData = {
            userId: user._id
        }
        const token =await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'})

        user = {
            _id:user.id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            Profile:user.profile
        }

        return res.status(200)
        .cookie("token",token,{
            maxAge:1*24*60*60*1000,
            httpsOnly:true,
            sameSite:'strict'
        })
        .json({
            message:`Welcome back ${user.fullname}`,
            user,
            success:true
        })

    }
    catch(err){
        console.log(err)
    }
}

export const logout = async (req,res)=>{
    try{
        return res.status(200)
        .cookie('token',"",{maxAge:0})
        .json({
            message:"logged out successfully",
            success:true
        })
    }
    catch(err){
        console.log(err)
    }
}

export const updateProfile = async (req,res)=>{
    try{
        const {fullname,email,phoneNumber,bio,skills} = req.body
        
        if(!fullname && !email && !phoneNumber && !bio && !skills){
            return res.status(400).json({
                message:"nothing to update",
                success: false
            })
        }

        const file = req.file
        //cloudinary comes here

        

        const userId = req.id;
        const user = await User.findById(userId)
        

        if(!user){
            return res.status(400).json({
                message:"user not found",
                success:false
            })
        }


        //updating data
        if(fullname){ user.fullname=fullname } 
        if(email){ user.email=email } 
        if(phoneNumber){ user.phoneNumber=phoneNumber}
        if(bio) {user.profile.bio = bio}
        if(skills) {const skillsArray = skills.split(',');user.profile.skills=skillsArray}

        //resume comes here

        await user.save()

        const safeUser = {
            _id:user.id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            Profile:user.profile
        }

        return res.status(200).json({
            message:"profile updated sucessfully",
            safeUser,
            success: true
        })
    }
    catch(err){

    }
}