import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import JokeCard from '../../components/JokeCard.vue'
import type { Joke } from '../../src/types/joke'
const mockJoke: Joke = {
  _id: '1',
  setup: 'Why did the chicken cross the road?',
  punchline: 'To get to the other side!',
  type: 'animal',
  rating: 3,
}
describe('JokeCard.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(JokeCard, {
      props: {
        joke: mockJoke,
      },
    })
  })

  it('renders joke setup and punchline', () => {
    expect(wrapper.text()).toContain(mockJoke.setup)
    expect(wrapper.text()).toContain(mockJoke.punchline)
  })

  it('emits "remove" event when Delete button is clicked', async () => {
    const deleteBtn = wrapper.get('[data-test-id="delete-joke"]')
    await deleteBtn.trigger('click')

    expect(wrapper.emitted('remove')).toBeTruthy()
  })

  it('emits "rate" event from RatingStars', async () => {
    wrapper.vm.$emit('rate', 5)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('rate')).toBeTruthy()
    expect(wrapper.emitted('rate')![0]).toEqual([5])
  })
})
