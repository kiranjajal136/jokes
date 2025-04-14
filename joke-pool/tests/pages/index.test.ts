import { mount } from '@vue/test-utils'
import Index from '../../pages/index.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useJokeStore } from '../../src/stores/jokes'
import { nextTick } from 'vue'

describe('Index.vue', () => {
  let wrapper: any
  let store: any

  beforeEach(() => {
    wrapper = mount(Index, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    })

    store = useJokeStore()
    store.allJokes = [
      {
        _id: '1',
        setup: 'Why did the chicken cross the road?',
        punchline: 'To get to the other side!',
        type: 'animal',
        rating: 3,
      },
    ]
  })

  it('renders joke cards', async () => {
    await nextTick()
    expect(wrapper.findComponent({ name: 'JokeCard' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('Why did the chicken cross the road?')
  })

  it('filters jokes by category', async () => {
    wrapper.vm.categoryFilter = 'animal'
    await nextTick()
    const jokes = wrapper.vm.paginated
    expect(jokes.length).toBe(1)
    expect(jokes[0].type).toBe('animal')
  })

  it('adds a new joke', async () => {
    const newJoke = {
      _id: '2',
      setup: 'What do you call a bear with no teeth?',
      punchline: 'A gummy bear!',
      type: 'animal',
      rating: 5,
    }

    wrapper.vm.addJoke(newJoke)
    expect(store.addJoke).toHaveBeenCalledWith(newJoke)
  })

  it('removes a joke after confirmation', async () => {
    vi.stubGlobal('confirm', () => true)
    wrapper.vm.removeJoke('1')
    expect(store.removeJoke).toHaveBeenCalledWith('1')
  })

  it('rates a joke', () => {
    wrapper.vm.rateJoke('1', 4)
    expect(store.rateJoke).toHaveBeenCalledWith('1', 4)
  })

  it('shares a joke via window.open', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const joke = store.allJokes[0]
    wrapper.vm.shareJoke(joke)
    expect(openSpy).toHaveBeenCalled()
    expect(openSpy.mock.calls[0][0]).toContain('twitter.com/intent/tweet')
    openSpy.mockRestore()
  })
})
