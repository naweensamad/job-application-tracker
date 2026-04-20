const { getApplicationByUser, createApplication: createApplicationModel, updateApplication: updateApplicationModel, deleteApplication: deleteApplicationModel } = require('../models/Application')

const getApplications = async (req, res) => {
    try {
        const userId = req.user.id
        const applications = await getApplicationByUser(userId)
        return res.json(applications)
    } catch (err) {
        console.error('Get applications error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}

const createApplication = async (req, res) => {
    try {
        const userId = req.user.id
        const { company, role, status, date_applied, notes, reminder_date } = req.body
        const application = await createApplicationModel(userId, company, role, status, date_applied, notes, reminder_date)
        return res.status(201).json(application)
    } catch (err) {
        console.error('Create application error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}

const updateApplication = async (req, res) => {
    try {
        const userId = req.user.id
        const { id } = req.params;
        const { company, role, status, date_applied, notes, reminder_date } = req.body;
        const application = await updateApplicationModel(id, userId, company, role, status, date_applied, notes, reminder_date)

        if (!application) {
            return res.status(404).json({ message: 'Application not found' })
        }

        return res.json(application)
    } catch (err) {
        console.error('Update application error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}

const deleteApplication = async (req, res) => {
    try {
        const userId = req.user.id
        const { id } = req.params;
        const deleteApplication = await deleteApplicationModel(id, userId)

        if (!deleteApplication) {
            return res.status(404).json({ message: 'Application not found' })
        }

        return res.json(deleteApplication)
    } catch (err) {
        console.error('Delete application error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { getApplications, createApplication, updateApplication, deleteApplication };