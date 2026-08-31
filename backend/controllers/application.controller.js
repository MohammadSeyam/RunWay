import { Application } from "../models/application.model.js"
import { Job } from "../models/job.model.js"


export const applyJob = async(req,res)=>{
    try{
        const userId = req.id 
        const jobId = req.params.id
        
        if(!jobId){
            return res.stutus(400).json({
                message:"Job id is required",
                success:false
            })
        }

        //check if the user has already applied for the job
        const existingAplication = await Application.findOne({job:jobId,applicant:userId})

        if(existingAplication){
            return res.status(400).json({
                message:"you have already applied for this job",
                success:false
            })
        }

        //check if the job exist
        const job = await Job.findById(jobId)
        if(!job){
            return res.status(404).json({
                message:"job not found",
                success:false
            })
        }

        //create a new application

        const newApplication = await Application.create({
            job:jobId,
            applicant:userId
        })

        job.applications.push(newApplication._id)
        await job.save()

        return res.status(201).json({
            message:"job applied successfully",
            success:true
        })
    }
    catch(err){
        console.log(err)
    }
}


export const getAppliedJobs = async(req , res)=>{
    try{
        const userId = req.id
        const appliedJobs = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}}
            }
        })

        if(!appliedJobs){
            return res.status(404).json({
                message:"you have not applied",
                success:false
            })
        }

        return res.status(200).json({
            appliedJobs,
            success:true
        })
    }
    catch(err){
        console.log(err)
    }
}

// how much student applied in a particular jobs, admin feature
export const getApplicants =async (req,res)=>{
    try{
        const jobId = req.params.jid

        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAd:-1}},
            populate:{
                path:'applicant'
            }
        })


        if(!job){
            return res.status(404).json({
                message:"no job found",
                success:false
            })
        }

        return res.status(200).json({
            job,
            success:true
        })

    }
    catch(err){
        console.log(err)
    }
}

export const updaateStatus = async (req ,res)=>{
    try{
        const status = req.body.status
        const applicationId = req.params.Aid 
        if(!status){
            return res.status(400).json({
                message:"status is required",
                success: false
            })
        }

        //find the application by applicant id 
        const application = await Application.findById(applicationId)
        if(!application){
            return res.status(404).json({
                message:"application not found",
                success: false
            })
        }

        //update status
        application.status = status.toLowerCase()
        await application.save()

        return res.status(200).json({
            message:"status updated successfully",
            success: true
        })

    }
    catch(err){
        console.log(err)
    }
}