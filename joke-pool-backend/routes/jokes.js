import Joke from '../models/Joke.js';
import express from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const {
      category,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const filter = category ? { type: category } : {};
    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const totalCount = await Joke.countDocuments(filter);
    const jokes = await Joke.find(filter)
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(StatusCodes.OK).json({
      jokes,
      totalCount,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  const { setup, punchline, type } = req.body
  const newJoke = new Joke({ setup, punchline, type })

  try {
    const savedJoke = await newJoke.save()
    res.status(StatusCodes.CREATED).json(savedJoke)
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const joke = await Joke.findByIdAndDelete(req.params.id)
    if (!joke) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Joke not found' })
    }

    res
      .status(StatusCodes.OK)
      .json({ message: 'Joke deleted successfully', id: joke._id })
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
  }
})

router.patch('/:id/rate', async (req, res) => {
  const { id } = req.params
  const { rating } = req.body

  if (typeof rating !== 'number') {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid rating' })
  }

  try {
    const joke = await Joke.findById(id)
    if (!joke) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Joke not found' })
    }

    joke.rating = rating
    await joke.save()
    res.status(StatusCodes.OK).json({ message: 'Rating updated', joke })
  } catch (err) {
    console.error(err)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Server error' })
  }
})

export default router
