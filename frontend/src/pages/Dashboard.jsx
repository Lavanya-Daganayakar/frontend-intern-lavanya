import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchNotes = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const resNotes = await axios.get(`http://localhost:4000/api/notes?q=${search}`, { headers })
      const resUser = await axios.get('http://localhost:4000/api/profile', { headers })
      setNotes(resNotes.data)
      setUser(resUser.data)
    } catch (err) {
      console.error(err)
      navigate('/login')
    }
  }

  useEffect(() => { fetchNotes() }, [search])

  const handleSubmit = async e => {
    e.preventDefault()
    const headers = { Authorization: `Bearer ${token}` }
    if (editId)
      await axios.put(`http://localhost:4000/api/notes/${editId}`, { title, body }, { headers })
    else
      await axios.post('http://localhost:4000/api/notes', { title, body }, { headers })
    setTitle(''); setBody(''); setEditId(null); fetchNotes()
  }

  const handleDelete = async id => {
    if (window.confirm('Delete this note?')) {
      await axios.delete(`http://localhost:4000/api/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      fetchNotes()
    }
  }

  const handleEdit = note => {
    setTitle(note.title); setBody(note.body); setEditId(note._id)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Welcome, {user ? user.name : 'User'} 👋
        </h1>
        <button onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl mb-2">{editId ? 'Edit Note' : 'Add Note'}</h2>
        <input className="border p-2 w-full mb-2" placeholder="Title"
               value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea className="border p-2 w-full mb-2" rows="3" placeholder="Body"
                  value={body} onChange={e=>setBody(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? 'Update' : 'Add'}
        </button>
      </form>

      {/* Search */}
      <input className="border p-2 w-full mb-4" placeholder="Search notes..."
             value={search} onChange={e=>setSearch(e.target.value)} />

      {/* Notes List */}
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map(n => (
            <li key={n._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">{n.title}</h2>
                <div>
                  <button onClick={()=>handleEdit(n)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm mr-2">Edit</button>
                  <button onClick={()=>handleDelete(n._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button>
                </div>
              </div>
              <p>{n.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
