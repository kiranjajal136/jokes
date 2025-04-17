import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import RatingComponent from '~/components/RatingStars.vue'

describe('RatingComponent', () => {
  it('should initialize with the correct rating prop value', () => {
    const wrapper = mount(RatingComponent, {
      props: { rating: 3 },
    })
    expect(wrapper.vm.rating).toBe(3)
  })

  it('should watch and update the rating value when the prop changes', async () => {
    const wrapper = mount(RatingComponent, {
      props: { rating: 2 },
    })
    expect(wrapper.vm.rating).toBe(2)
    await wrapper.setProps({ rating: 4 })
    expect(wrapper.vm.rating).toBe(4)
  })
})
