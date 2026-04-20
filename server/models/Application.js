const pool = require('../config/db')

const getApplicationByUser = async (user_id) => {
    const result = await pool.query('SELECT * FROM applications WHERE user_id = $1', [user_id])
    return result.rows
}

const createApplication = async (user_id, company, role, status, date_applied, notes, reminder_date) => {
    const result = await pool.query('INSERT INTO applications (user_id, company, role, status, date_applied, notes, reminder_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [user_id, company, role, status, date_applied, notes, reminder_date])
    return result.rows[0]
}

const updateApplication = async (id, userId, company, role, status, dateApplied, notes, reminder_date) => {
    const result = await pool.query('UPDATE applications SET company=$1, role=$2, status=$3, date_applied=$4, notes=$5, reminder_date=$6 WHERE id=$7 AND user_id=$8 RETURNING *', [company, role, status, dateApplied, notes, reminder_date, id, userId])
    return result.rows[0]
}

const deleteApplication = async (id, user_id) => {
    const result = await pool.query(
        'DELETE FROM applications WHERE id=$1 AND user_id=$2 RETURNING *',
        [id, user_id]
    )
    return result.rows[0]
}

module.exports = { getApplicationByUser, createApplication, updateApplication, deleteApplication }