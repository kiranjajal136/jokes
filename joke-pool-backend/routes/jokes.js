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

router.patch('/:id/rate', async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (typeof rating !== 'number') {
    return res.status(400).json({ message: 'Invalid rating' });
  }

  try {
    const joke = await Joke.findById(id);
    if (!joke) {
      return res.status(404).json({ message: 'Joke not found' });
    }

    joke.rating = rating;
    await joke.save();
    res.json({ message: 'Rating updated', joke });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
