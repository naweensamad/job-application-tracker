import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const [applications, setApplications] = useState([])
    const [company, setCompany] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('applied')
    const [dateApplied, setDateApplied] = useState('')
    const [notes, setNotes] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState({})
    const [error, setError] = useState('')
    const [reminderDate, setReminderDate] = useState('')
    const navigate = useNavigate()

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications')
            setApplications(response.data)
        } catch (err) {
            setError('Could not load applications')
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        setError('')

        try {
            await api.post('/applications', {
                company,
                role,
                status,
                date_applied: dateApplied,
                notes,
                reminder_date: reminderDate
            })

            setCompany('')
            setRole('')
            setStatus('applied')
            setDateApplied('')
            setNotes('')
            fetchApplications()
            setReminderDate('')
        } catch (err) {
            setError('Could not add application')
        }
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/applications/${id}`)
            fetchApplications()
        } catch (err) {
            setError('Could not delete application')
        }
    }

    const handleEdit = (app) => {
        setEditingId(app.id)
        setEditData({
            company: app.company,
            role: app.role,
            status: app.status,
            date_applied: app.date_applied ? app.date_applied.split('T')[0] : '',
            notes: app.notes || '',
            reminder_date: app.reminder_date ? app.reminder_date.split('T')[0] : ''

        })
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setError('')

        try {
            await api.put(`/applications/${editingId}`, editData)
            setEditingId(null)
            fetchApplications()
        } catch (err) {
            setError('Could not update application')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    return (
        <div className="container">
            <div className="dashboard-header">
                <div>
                    <h1>My Applications</h1>
                    <p className="dashboard-subtitle">Track your job search in one place</p>
                </div>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleCreate} className="application-form">
                <input
                    placeholder="Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />

                <input
                    placeholder="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                </select>

                <input
                    type="date"
                    value={dateApplied}
                    onChange={(e) => setDateApplied(e.target.value)}
                />

                <textarea
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>

                <input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                />

                <button type="submit">Add Application</button>
            </form>

            <div className="applications-list">
                {applications.length === 0 ? (
                    <div className="empty-state">
                        <h3>No applications yet</h3>
                        <p>Add your first application above to get started.</p>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="app-card">
                            {editingId === app.id ? (
                                <form onSubmit={handleUpdate} className="edit-form">
                                    <input
                                        value={editData.company}
                                        onChange={(e) =>
                                            setEditData({ ...editData, company: e.target.value })
                                        }
                                    />

                                    <input
                                        value={editData.role}
                                        onChange={(e) =>
                                            setEditData({ ...editData, role: e.target.value })
                                        }
                                    />

                                    <select
                                        value={editData.status}
                                        onChange={(e) =>
                                            setEditData({ ...editData, status: e.target.value })
                                        }
                                    >
                                        <option value="applied">Applied</option>
                                        <option value="interview">Interview</option>
                                        <option value="offer">Offer</option>
                                        <option value="rejected">Rejected</option>
                                    </select>

                                    <input
                                        type="date"
                                        value={editData.date_applied}
                                        onChange={(e) =>
                                            setEditData({ ...editData, date_applied: e.target.value })
                                        }
                                    />

                                    <textarea
                                        value={editData.notes}
                                        onChange={(e) =>
                                            setEditData({ ...editData, notes: e.target.value })
                                        }
                                    />

                                    <input
                                        type="date"
                                        value={editData.reminder_date || ''}
                                        onChange={(e) =>
                                            setEditData({ ...editData, reminder_date: e.target.value })
                                        }
                                    />

                                    <div className="action-buttons">
                                        <button type="submit">Save</button>
                                        <button
                                            type="button"
                                            className="btn-cancel"
                                            onClick={() => setEditingId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="app-card-content">
                                        <div className="app-card-top">
                                            <h3>{app.company}</h3>
                                            <span className={`status-badge status-${app.status}`}>
                                                {app.status}
                                            </span>
                                        </div>

                                        <p className="app-role">{app.role}</p>

                                        <p className="app-date">
                                            Date Applied:{' '}
                                            {app.date_applied
                                                ? app.date_applied.split('T')[0]
                                                : 'N/A'}
                                        </p>

                                        <p className="app-date">
                                            Reminder:{' '}
                                            {app.reminder_date
                                                ? app.reminder_date.split('T')[0]
                                                : 'None'}
                                        </p>

                                        <p className="app-notes">
                                            {app.notes ? app.notes : 'No notes added'}
                                        </p>
                                    </div>

                                    <div className="action-buttons">
                                        <button className="btn-edit" onClick={() => handleEdit(app)}>
                                            Edit
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(app.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Dashboard