import { defineStore } from 'pinia'
import type { Joke } from '~/types/joke'
import { useRuntimeConfig } from 'nuxt/app'

export const useJokeStore = defineStore('jokes', () => {
  const jokes = ref<Joke[]>([])
  const loading = ref(false)
  const jokesPerPage = ref(10)
  const sortBy = ref('')

  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl

  const allJokes = computed(() => jokes.value)
  const isLoading = computed(() => loading.value)
  const sortByComputed = computed(() => sortBy.value)
  const jokesPerPageComputed = computed(() => jokesPerPage.value)

  function setJokes(newJokes: Joke[]) {
    jokes.value = newJokes
  }

  function addJokeLocally(joke: Joke) {
    jokes.value.unshift(joke)
  }

  function removeJokeLocally(id: string) {
    jokes.value = jokes.value.filter(j => j._id !== id)
  }

  function updateJokeRating(id: string, rating: number) {
    const index = jokes.value.findIndex(j => j._id === id)
    if (index !== -1) {
      jokes.value[index] = { ...jokes.value[index], rating }
    }
  }

  function setJokesPerPage(count: number) {
    jokesPerPage.value = count
  }

  async function fetchJokes(params = {}) {
    loading.value = true
    try {
      const query = new URLSearchParams(params).toString()
      const res = await fetch(`${API_URL}?${query}`)
      const data = await res.json()
      setJokes(data)
    } catch (e) {
      console.error('Failed to fetch jokes:', e)
    } finally {
      loading.value = false
    }
  }

  async function addJoke(joke: Joke) {
    try {
      const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joke),
      })
      const data = await res.json()
      addJokeLocally(data)
    } catch (e) {
      console.error('Failed to add joke:', e)
    }
  }

  async function removeJoke(id: string) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      removeJokeLocally(id)
    } catch (e) {
      console.error('Failed to remove joke:', e)
    }
  }

  async function rateJoke(id: string, rating: number) {
    const joke = jokes.value.find(j => j._id === id)
    if (!joke) return

    try {
      const res = await fetch(`${API_URL}/${id}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...joke, rating }),
      })
      const updated = await res.json()
      updateJokeRating(id, updated.joke.rating)
    } catch (e) {
      console.error('Failed to rate joke:', e)
    }
  }

  return {
    jokes,
    isLoading,
    jokesPerPageComputed,
    sortByComputed,
    allJokes,
    setJokesPerPage,
    fetchJokes,
    addJoke,
    removeJoke,
    rateJoke,
  }
})
