import { defineStore } from 'pinia'
import { API_URL } from '../constants/index'
import type { Joke } from '../types/joke'
import { computed, ref } from 'vue'

export const useJokeStore = defineStore('jokes', () => {
  const jokes = ref<Joke[]>([])
  const loading = ref<Boolean>(false)
  const jokesPerPage = ref<number>(10)
  const sortBy = ref<string>('')

  const allJokes = computed<Joke[]>(() => jokes.value)

  async function fetchJokes(params = {}) {
    loading.value = true
    try {
      const query = new URLSearchParams(params).toString()
      const res = await fetch(`${API_URL}?${query}`)
      const data = await res.json()
      jokes.value = data
    } catch (e) {
      console.error('Failed to fetch jokes:', e)
    } finally {
      loading.value = false
    }
  }

  async function addJoke(joke: Joke) {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(joke)
    })
    const data = await res.json()
    jokes.value.unshift(data)
  }

  async function removeJoke(id: number) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    jokes.value = jokes.value.filter(j => j._id !== id.toString())
  }

  async function rateJoke(id: number, rating: number) {
    const res = await fetch(`${API_URL}/${id}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating })
    })

    const updated = await res.json()
    const idx = jokes.value.findIndex(j => j._id === id.toString())
    if (idx !== -1) jokes.value[idx] = updated
  }

  function setJokesPerPage(count: number) {
    jokesPerPage.value = count
  }

  return {
    jokes,
    allJokes,
    loading,
    jokesPerPage,
    sortBy,
    fetchJokes,
    addJoke,
    removeJoke,
    rateJoke,
    setJokesPerPage
  }
})
