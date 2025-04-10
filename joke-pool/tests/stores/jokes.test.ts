import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useJokeStore } from '../../stores/jokes'
import type { Joke } from '../../types/joke'

const mockJokes: Joke[] = [
  {
    _id: '1',
    setup: 'Why did the chicken cross the road?',
    punchline: 'To get to the other side!',
    type: 'classic',
    rating: 4
  }
]

describe('useJokeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('fetchJokes sets jokes from API', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => mockJokes
    } as Response)

    const store = useJokeStore()
    await store.fetchJokes()

    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(store.jokes).toEqual(mockJokes)
  })

  it('addJoke adds a joke to the store', async () => {
    const store = useJokeStore()

    const newJoke: Joke = {
      _id: '2',
      setup: 'I told my wife she was drawing her eyebrows too high.',
      punchline: 'She looked surprised.',
      type: 'dad',
      rating: 5
    }

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => newJoke
    } as Response)

    await store.addJoke(newJoke)

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/jokes'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newJoke)
      })
    )
    expect(store.jokes[0]).toEqual(newJoke)
  })

  it('rateJoke updates rating in store', async () => {
    const store = useJokeStore()
    store.jokes = [...mockJokes]

    const updatedJoke = { ...mockJokes[0], rating: 5 }

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => updatedJoke
    } as Response)

    await store.rateJoke(1, 5)

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/1/rate'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ rating: 5 })
      })
    )

    expect(store.jokes[0].rating).toBe(5)
  })

  it('removeJoke deletes joke by id', async () => {
    const store = useJokeStore()
    store.jokes = [...mockJokes]

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({} as Response)

    await store.removeJoke(1)

    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/1'), {
      method: 'DELETE'
    })
    expect(store.jokes.length).toBe(0)
  })

  it('sets jokesPerPage', () => {
    const store = useJokeStore()
    store.jokes = [...mockJokes]

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({} as Response)

    store.setJokesPerPage(15)

    expect(store.jokesPerPage).toBe(15)
  })
})
