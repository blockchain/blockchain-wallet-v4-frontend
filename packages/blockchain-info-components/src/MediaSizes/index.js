import { css } from 'styled-components'

const Sizes = {
  mobile: 479,
  tablet: 767,
  laptop: 1023,
  laptopL: 1440,
  desktop: 2560
}

// Iterate through the sizes and create a media template
const Media = Object.keys(Sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${Sizes[label]}px) {
      ${css(...args)};
    }
  `

  return acc
}, {})

export { Media, Sizes }
