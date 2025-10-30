import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login',
        { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid credentials')
    }
  }

  return (
    <div className="bg-white p-8 rounded shadow w-96">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {message && <p className="text-red-500 mb-2">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input className="border p-2 w-full mb-2" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border p-2 w-full mb-2" placeholder="Password"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
      </form>
      <p className="text-sm text-center mt-2">
        No account? <Link to="/register" className="text-blue-500">Register</Link>
      </p>
    </div>
  )
}
