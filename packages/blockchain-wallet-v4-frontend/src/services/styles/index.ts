import { useEffect, useState } from 'react'
import { mergeAll } from 'ramda'
import { css } from 'styled-components'

const types = {
  m: 'margin',
  p: 'padding'
}

const templates = {
  a: (type, size) => ({ [type]: size }),
  h: (type, size) => ({ [type]: `0px ${size}px` }),
  v: (type, size) => ({ [type]: `${size}px 0px` }),
  t: (type, size) => ({ [`${type}Top`]: size }),
  r: (type, size) => ({ [`${type}Right`]: size }),
  b: (type, size) => ({ [`${type}Bottom`]: size }),
  l: (type, size) => ({ [`${type}Left`]: size })
}

export const spacing = value =>
  mergeAll(
    value.split(' ').map(statement => {
      let [rule, size] = statement.split('-')
      let [type, tmpl] = rule.split('')
      let valid = types[type] && templates[tmpl] && size % 5 === 0
      return valid ? templates[tmpl](types[type], parseInt(size)) : {}
    })
  )

const flexDirections = {
  row: 'row',
  col: 'column'
}

const flexProperties = {
  align: 'alignItems',
  justify: 'justifyContent'
}

const flexRules = {
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  base: 'baseline',
  around: 'space-around',
  between: 'space-between',
  evenly: 'space-evenly'
}

export const flex = value => {
  const [directions, ...params] = value.split(' ')
  const base = {
    display: 'flex',
    flexDirection: flexDirections[directions]
  }
  return mergeAll(
    [base].concat(
      params.map(p => {
        const [property, rule] = p.split('/')
        return { [flexProperties[property]]: flexRules[rule] }
      })
    )
  )
}

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

export const heights = {
  small: 600,
  big: 800
}

export type SizesTypes = typeof sizes
export type HeightTypes = typeof heights
export type Sizes = keyof SizesTypes
export type Heights = keyof HeightTypes
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

export type MediaHeightServiceType = {
  big: (...args) => any
  small: (...args) => any
}

// Iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((acc, label) => {
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
}, {}) as MediaServiceType

export function useMedia(size: Sizes): boolean {
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

export const mediaHeight = Object.keys(heights).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-height: ${heights[label]}px) {
      // @ts-ignore
      ${css(...args)};
    }
  `
  return acc
}, {}) as MediaHeightServiceType
