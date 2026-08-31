import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { applyJob, getApplicants, getAppliedJobs, updaateStatus } from '../controllers/aplication.controller.js'

const applicationRouter = express.Router()


applicationRouter.route('/apply/:id').post(isAuthenticated,applyJob)
applicationRouter.route('/getappliedjobs').get(isAuthenticated,getAppliedJobs)
applicationRouter.route('/getapplicants/:jid').get(isAuthenticated,getApplicants)
applicationRouter.route('/updateStatus/:Aid').put(isAuthenticated,updaateStatus)


export default applicationRouter