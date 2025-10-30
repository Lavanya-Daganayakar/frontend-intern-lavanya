const express = require('express')
const Note = require('../models/Note')
const auth = require('../middleware/authMiddleware')

const router = express.Router()

// Read (with optional search)
router.get('/', auth, async (req, res) => {
  const q = req.query.q || ''
  const notes = await Note.find({
    owner: req.user.id,
    title: { $regex: q, $options: 'i' }
  })
  res.json(notes)
})

// Create
router.post('/', auth, async (req, res) => {
  const note = await Note.create({
    title: req.body.title,
    body: req.body.body,
    owner: req.user.id
  })
  res.json(note)
})

// Update
router.put('/:id', auth, async (req, res) => {
  const updated = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
  )
  res.json(updated)
})

// Delete
router.delete('/:id', auth, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
  res.json({ message: 'Deleted' })
})

module.exports = router
