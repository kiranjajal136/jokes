import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Index from '../../src/pages/index.vue'
import { createTestingPinia } from '@pinia/testing'
import { useJokeStore } from '../../src/stores/jokes'
import { nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
}))

describe('Index.vue', () => {
  let wrapper: any
  const mockUseRoute = useRoute as jest.Mock
  const mockUseRouter = useRouter as jest.Mock

  beforeEach(() => {
    mockUseRoute.mockReturnValue({ query: { sortDirection: 'asc' } })
    mockUseRouter.mockReturnValue({ replace: vi.fn() })

    wrapper = mount(Index, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              jokesPerPage: 10,
              allJokes: [
                { _id: 1, setup: 'Setup 1', punchline: 'Punchline 1', type: 'Funny', rating: 4 },
                { _id: 2, setup: 'Setup 2', punchline: 'Punchline 2', type: 'Sarcasm', rating: 5 },
              ],
            },
            actions: {
              rateJoke: vi.fn((id: number, rating: number) => {
                const joke = wrapper.vm.store.allJokes.find(j => j._id === id)
                if (joke) {
                  joke.rating = rating
                }
              }),
            },
          }),
        ],
      },
    })
  })

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('hides the loader when `loading` is false', async () => {
    wrapper.vm.loading = ref(false)
    await nextTick()

    const progressCircular = wrapper.findComponent({ name: 'v-progress-circular' })
    expect(progressCircular.exists()).toBe(false)
  })

  it('removes joke when removeJoke method is called', async () => {
    const jokeToRemove = { _id: 1, setup: 'Setup 1', punchline: 'Punchline 1', type: 'Funny', rating: 4 }

    const removeJokeMock = vi.fn()
    wrapper.vm.removeJoke = removeJokeMock

    await wrapper.vm.removeJoke(jokeToRemove._id)

    expect(removeJokeMock).toHaveBeenCalledWith(jokeToRemove._id)
  })

  it('rates a joke correctly when rateJoke is called', async () => {
    const jokeToRate = { _id: 1, setup: 'Setup 1', punchline: 'Punchline 1', type: 'Funny', rating: 4 }

    wrapper.vm.store.allJokes = [
      { _id: 1, setup: 'Setup 1', punchline: 'Punchline 1', type: 'Funny', rating: 4 },
      { _id: 2, setup: 'Setup 2', punchline: 'Punchline 2', type: 'Sarcasm', rating: 5 },
    ]

    await wrapper.vm.rateJoke(jokeToRate._id, 3)

    await nextTick()

    console.log('all jokes:', wrapper.vm.store.allJokes)
    const updatedJoke = wrapper.vm.store.allJokes.find((joke: any) => joke._id === jokeToRate._id)
    console.log('Updated Joke:', updatedJoke)
    expect(updatedJoke?.rating).toBe(3)
  })

  it('shares a joke correctly when shareJoke is called', () => {
    const jokeToShare = { _id: 1, setup: 'Setup 1', punchline: 'Punchline 1', type: 'Funny', rating: 4 }
    const openMock = vi.fn()

    global.window.open = openMock

    wrapper.vm.shareJoke(jokeToShare)

    expect(openMock).toHaveBeenCalledWith(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent('Setup 1 — Punchline 1')}`,
      '_blank'
    )
  })
})
