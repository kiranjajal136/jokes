import Joke from '../models/Joke.js';
import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const { category, sortBy = 'createdAt', order = 'desc' } = req.query

        const filter = category ? { type: category } : {}

        const sort = {}
        sort[sortBy] = order === 'desc' ? -1 : 1

        const jokes = await Joke.find(filter).sort(sort)
        res.json(jokes)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/', async (req, res) => {
  const { setup, punchline, type } = req.body;
  const newJoke = new Joke({ setup, punchline, type });

  try {
    const savedJoke = await newJoke.save();
    res.status(201).json(savedJoke);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/', async (req, res) => {
  const { setup, punchline, type } = req.body;
  const newJoke = new Joke({ setup, punchline, type });

  try {
    const savedJoke = await newJoke.save();
    res.status(201).json(savedJoke);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
    try {
        const joke = await Joke.findByIdAndDelete(req.params.id);
        if (!joke) return res.status(404).json({ message: 'Joke not found' });

        res.json({ message: 'Joke deleted successfully', id: joke._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
