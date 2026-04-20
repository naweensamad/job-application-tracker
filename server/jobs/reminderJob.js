const cron = require('node-cron')
const pool = require('../config/db')
const { Resend } = require('resend')


const resend = new Resend(process.env.RESEND_API_KEY)

// runs every day at 9am
cron.schedule('0 9 * * *', async () => {
    console.log('Running reminder job...')

    try {
        const result = await pool.query(`
            SELECT applications.*, users.email 
            FROM applications
            JOIN users ON applications.user_id = users.id
            WHERE reminder_date = CURRENT_DATE
            AND reminder_sent = false
        `)

         for (const app of result.rows) {
            try {
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: app.email,
                    subject: `Reminder: Follow up on ${app.company}`,
                    html: `
                        <p>Hi,</p>
                        <p>This is your reminder for your application to <strong>${app.company}</strong> for the role of <strong>${app.role}</strong>.</p>
                        <p>Status: ${app.status}</p>
                        <p>Good luck.</p>
                    `
                })

                console.log(`Reminder email sent for ${app.company} -> ${app.email}`)

                await pool.query(
                    'UPDATE applications SET reminder_sent = true WHERE id = $1',
                    [app.id]
                )

            } catch (emailErr) {
                console.error(`Failed to send email for application ${app.id}:`, emailErr)
            }
        }

    } catch (err) {
        console.error('Reminder job error:', err)
    }
})