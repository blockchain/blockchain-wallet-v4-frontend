import { css } from 'styled-components'
import { useEffect, useState } from 'react'

export const isMobile = () => window.outerWidth <= 479

export const sizes = {
  mobile: 479,
  tablet: 767,
  tabletL: 991,
  laptop: 1023,
  laptopM: 1279,
  laptopL: 1439,
  desktop: 2560
}

export type SizesTypes = typeof sizes
export type Sizes = keyof SizesTypes
export type MediaServiceType = {
  atLeastDesktop: (...args) => any
  atLeastLaptop: (...args) => any
  atLeastLaptopL: (...args) => any
  atLeastLaptopM: (...args) => any
  atLeastMobile: (...args) => any
  atLeastTablet: (...args) => any
  atLeastTabletL: (...args) => any
  desktop: (...args) => any
  laptop: (...args) => any
  laptopL: (...args) => any
  laptopM: (...args) => any
  mobile: (...args) => any
  tablet: (...args) => any
  tabletL: (...args) => any
}

// Iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      // @ts-ignore
      ${css(...args)};
    }
  `
  acc['atLeast' + label[0].toUpperCase() + label.slice(1, label.length)] = (
    ...args
  ) => css`
    @media (min-width: ${sizes[label] + 1}px) {
      // @ts-ignore
      ${css(...args)};
    }
  `

  return acc
}, {})

export function useMedia (size: Sizes): boolean {
  const getSize = () => {
    if (window.innerWidth <= sizes[size]) {
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

export default media as MediaServiceType
