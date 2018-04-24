import { merge } from 'ramda'

export const selectStyle = status => {
  const initial = { color1: 'gray-4', animation1: false, color2: 'gray-4', animation2: false, color3: 'gray-4', animation3: false, icon3: 'checkmark' }
  switch (status) {
    case 'no_deposits': return merge(initial, { color1: 'brand-primary', animation1: true })
    case 'received': return merge(initial, { color1: 'brand-primary', color2: 'brand-primary', animation2: true })
    case 'failed': return merge(initial, { color1: 'brand-primary', color2: 'brand-primary', color3: 'error', animation3: true, icon3: 'close' })
    case 'complete': return merge(initial, { color1: 'brand-primary', color2: 'brand-primary', color3: 'success', animation3: true })
    // case 'resolved': return merge(initial, { color1: 'brand-primary', color2: 'brand-primary', color3: 'brand-secondary', animation3: true, icon3: 'build' })
    default: return initial
  }
}
