import { useState } from 'react'
import api from '../services/api'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const response = await api.post('/auth/login', { email, password })
            localStorage.setItem('token', response.data.token)
            navigate('/dashboard')
        } catch (err) {
            setError('Invalid email or password')
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1>Login</h1>
                <p className="auth-subtitle">Welcome back to your job tracker</p>

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

                    <button type="submit">Login</button>
                </form>

                <p className="auth-footer">
                    Don’t have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login