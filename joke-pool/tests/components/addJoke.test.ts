import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AddJoke from '~/components/AddJoke.vue'
import JokeModal from '~/components/JokeModal.vue'
import { useJokeStore } from '~/stores/jokes'
import type { Joke } from '~/types/joke'

vi.mock('~/stores/jokes', () => ({
  useJokeStore: vi.fn()
}))

const mockJoke: Joke = {
  _id: '1',
  setup: 'Why did the chicken cross the road?',
  punchline: 'To get to the other side.',
  rating: 3,
  type: 'animal'
}

describe('AddJoke.vue', () => {
  it('calls addJoke when JokeModal emits add event', async () => {
    const addJoke = vi.fn()
    ;(useJokeStore as any).mockReturnValue({ addJoke })

    const wrapper = mount(AddJoke, {
      global: {
        components: {
          JokeModal
        }
      }
    })

    const modal = wrapper.findComponent(JokeModal)
    expect(modal.exists()).toBe(true)

    await modal.vm.$emit('add', mockJoke)

    expect(addJoke).toHaveBeenCalledTimes(1)
    expect(addJoke).toHaveBeenCalledWith(mockJoke)
  })
})
