import { useRuntimeConfig } from 'nuxt/app'

const useJokeApi = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl

  const fetchJokes = async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString()
      const res = await fetch(`${API_URL}?${query}`)
      return await res.json()
    } catch (e) {
      console.error('Failed to fetch jokes:', e)
      throw e
    }
  }

  const addJoke = async (joke: any) => {
    try {
      const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joke),
      })
      return await res.json()
    } catch (e) {
      console.error('Failed to add joke:', e)
      throw e
    }
  }

  const removeJoke = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    } catch (e) {
      console.error('Failed to remove joke:', e)
      throw e
    }
  }

  const rateJoke = async (id: string, rating: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      })
      return await res.json()
    } catch (e) {
      console.error('Failed to rate joke:', e)
      throw e
    }
  }

  return {
    fetchJokes,
    addJoke,
    removeJoke,
    rateJoke,
  }
}

export default useJokeApi
