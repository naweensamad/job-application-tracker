const express  = require('express');
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
require('./jobs/reminderJob')

const app = express();

app.use(express.json());

app.use(cors())

app.use('/auth', authRoutes)

app.use('/applications', applicationRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'API is running'})
})

app.listen(5000, () => {
    console.log('Server running on port 5000')
})


