import { css } from 'styled-components'
import { useEffect, useState } from 'react'

export const isMobile = () => window.outerWidth <= 479

export const sizes = {
  mobile: 479,
  tablet: 767,
  tabletL: 991,
  laptop: 1023,
  laptopL: 1440,
  desktop: 2560
}

export type SizesTypes = typeof sizes
export type Sizes = keyof SizesTypes

// Iterate through the sizes and create a media template
const media: any = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      // @ts-ignore
      ${css(...args)};
    }
  `

  return acc
}, {})

export function useMedia (size: Sizes): boolean {
  const getSize = () => {
    if (window.outerWidth <= sizes[size]) {
      return true
    }

    return false
  }

  const [isSize, setIsSize] = useState(getSize())

  useEffect(() => {
    const handleResize = () => {
      setIsSize(getSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isSize
}

export default media
