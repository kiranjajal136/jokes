import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import JokeCard from '../../src/components/JokeCard.vue'
import type { Joke } from '../../src/types/joke'
import { ShareLabels } from '~/types/joke'

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
      global: {
        stubs: {
          RatingStars: {
            template: '<button data-test-id="rate-btn" @click="$emit(\'rate\', 5)">Rate</button>',
          },
        },
      },
    })
  })

  it('renders joke setup and punchline', () => {
    expect(wrapper.text()).toContain(mockJoke.setup)
    expect(wrapper.text()).toContain(mockJoke.punchline)
  })

  it('renders emoji based on rating', () => {
    expect(wrapper.text()).toContain('😐')
  })

  it('emits "remove" event when Delete button is clicked', async () => {
    const deleteBtn = wrapper.get('[data-test-id="delete-joke"]')
    await deleteBtn.trigger('click')

    expect(wrapper.emitted('remove')).toBeTruthy()
  })

  it('emits "rate" event when RatingStars emits rate', async () => {
    const rateBtn = wrapper.get('[data-test-id="rate-btn"]')
    await rateBtn.trigger('click')

    expect(wrapper.emitted('rate')).toBeTruthy()
    expect(wrapper.emitted('rate')![0]).toEqual([5])
  })

  it('opens sharing link in new window when sharing to Twitter', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    wrapper.vm.share(ShareLabels.Twitter)

    expect(openSpy).toHaveBeenCalled()
    expect(openSpy.mock.calls[0][0]).toContain('twitter.com/intent/tweet')

    openSpy.mockRestore()
  })

  it('copies joke to clipboard', async () => {
    const writeText = vi.fn(() => Promise.resolve())
    Object.assign(navigator, {
      clipboard: { writeText },
    })

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    await wrapper.vm.copyToClipboard()

    expect(writeText).toHaveBeenCalledWith(
      'Why did the chicken cross the road? To get to the other side!'
    )
    expect(alertSpy).toHaveBeenCalledWith(ShareLabels.CopiedMessage)

    alertSpy.mockRestore()
  })
})
