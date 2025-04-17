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
          VMenu: {
            template: `
              <div>
                <slot name="activator" :props="{}" />
                <div class="v-menu-content"><slot /></div>
              </div>
            `,
          },
          VList: {
            template: '<div class="v-list"><slot /></div>',
          },
          VListItem: {
            template: '<div class="v-list-item"><slot /></div>',
          },
          VListItemTitle: {
            template: '<div class="v-list-item-title"><slot /></div>',
          },
          VIcon: true,
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

  it('does not show emoji if rating is 0 or undefined', async () => {
    await wrapper.setProps({ joke: { ...mockJoke, rating: 0 } })
    expect(wrapper.find('.emoji-animate').exists()).toBe(false)
  })
  
  it('shows emoji 😊 when rating is high', async () => {
    await wrapper.setProps({ joke: { ...mockJoke, rating: 5 } })
    expect(wrapper.text()).toContain('😊')
  })
  
  it('shows emoji 😢 when rating is low', async () => {
    await wrapper.setProps({ joke: { ...mockJoke, rating: 1 } })
    expect(wrapper.text()).toContain('😢')
  })
  
  it('renders category from joke type', () => {
    expect(wrapper.text()).toContain(`Category: ${mockJoke.type}`)
  })
  
  it('renders all share options in the menu', () => {
    const listItems = wrapper.findAll('.v-list-item')
    expect(listItems.length).toBe(4)
  
    const labels = listItems.map(item => item.text().trim())
    expect(labels).toEqual(expect.arrayContaining([
      ShareLabels.Twitter,
      ShareLabels.Whatsapp,
      ShareLabels.Facebook,
      ShareLabels.Clipboard,
    ]))
  })
  
  it('opens WhatsApp share link in a new window', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    wrapper.vm.share(ShareLabels.Whatsapp)
  
    expect(openSpy).toHaveBeenCalled()
    expect(openSpy.mock.calls[0][0]).toContain('api.whatsapp.com/send?text=')
  
    openSpy.mockRestore()
  })
  
  it('opens Facebook share link in a new window', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    wrapper.vm.share(ShareLabels.Facebook)
  
    expect(openSpy).toHaveBeenCalled()
    expect(openSpy.mock.calls[0][0]).toContain('facebook.com/sharer/sharer.php')
  
    openSpy.mockRestore()
  })  
})
