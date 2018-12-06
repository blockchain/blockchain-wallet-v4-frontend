import { css } from 'styled-components'

export const isMobile = () => window.outerWidth <= 479

export const sizes = {
  mobile: 479,
  tablet: 767,
  laptop: 1023,
  laptopL: 1440,
  desktop: 2560
}

// Iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      ${css(...args)};
    }
  `

  return acc
}, {})

export default media
