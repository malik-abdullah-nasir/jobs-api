const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userID })
    res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
}

const getJob = async (req, res) => {
    const { user: { userID }, params: { id: jobID } } = req
    const job = await Job.findOne({ _id: jobID, createdBy: userID });

    if (!job) {
        throw new NotFoundError(`Couldn't find the job with the ID: (${userID})`);
    }

    res.status(StatusCodes.OK).json(job);
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userID;
    const job = await Job.create({ ...req.body });
    res.status(StatusCodes.CREATED).json(job);
}

const updateJob = async (req, res) => {
    const { body: { company, position }, user: { userID }, params: { id: jobID } } = req

    if (company === '' || position === '') {
        throw new BadRequestError("Company and Position fields cannot be empty.");
    }

    const job = await Job.findOneAndUpdate({ _id: jobID, createdBy: userID }, { ...req.body }, { new: true })

    if (!job) {
        throw new NotFoundError(`Couldn't find the job with the ID: (${jobID})`);
    }

    res.status(StatusCodes.OK).json(job);
}

const deleteJob = async (req, res) => {
    const { user: { userID }, params: { id: jobID } } = req

    const job = await Job.findOneAndDelete({ _id: jobID, createdBy: userID });

    if (!job) {
        throw new NotFoundError(`Couldn't find the job with the ID: (${jobID})`);
    }

    res.status(StatusCodes.OK).json(job);
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}
