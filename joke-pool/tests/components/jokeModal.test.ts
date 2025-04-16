import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import JokeModal from '~/components/JokeModal.vue'
import { useJokeStore } from '~/stores/jokes'
import { ErrorMessages, JokeLabels } from '~/types/joke'

// Mocking the store
vi.mock('~/stores/jokes', () => ({
  useJokeStore: vi.fn(() => ({
    jokes: [
      { type: 'Knock Knock' },
      { type: 'Pun' },
    ],
  })),
}))

describe('JokeModal.vue', () => {
  it('renders the dialog and form fields correctly', () => {
    const wrapper = mount(JokeModal)
    expect(wrapper.find('v-dialog').exists()).toBe(true)
    expect(wrapper.find('v-text-field[label="Setup"]').exists()).toBe(true)
    expect(wrapper.find('v-text-field[label="Punchline"]').exists()).toBe(true)
    expect(wrapper.find('v-combobox[label="Category"]').exists()).toBe(true)
  })
})
