import mongoose from 'mongoose'

const JokeSchema = new mongoose.Schema({
  setup: { type: String, required: true },
  punchline: { type: String, required: true },
  type: { type: String, required: true },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Joke', JokeSchema);
