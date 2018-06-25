// const sizes = {
//   mobile: '425px',
//   tablet: '768px',
//   laptop: '1024px',
//   laptopL: '1440px',
//   desktop: '2560px'
// }

// const device = {
//   mobile: `(max-width: ${sizes.mobile})`,
//   tablet: `(max-width: ${sizes.tablet})`,
//   laptop: `(max-width: ${sizes.laptop})`,
//   laptopL: `(max-width: ${sizes.laptopL})`,
//   desktop: `(max-width: ${sizes.desktop})`
// }

// export default device

import { css } from 'styled-components'

const sizes = {
  mobile: 425,
  tablet: 768,
  laptop: 1024,
  laptopL: 1440,
  desktop: 2560
}

// Iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `

  return acc
}, {})

export default media
