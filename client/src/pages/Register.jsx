import { useState } from 'react'
import api from '../services/api'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            await api.post('/auth/register', { email, password })
            navigate('/')
        } catch (err) {
            setError('Could not register. Please try again.')
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p className="auth-subtitle">Start tracking your job applications</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit">Register</button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register