import { useEffect, useMemo, useState } from 'react'
import { mergeAll } from 'ramda'
import { css } from 'styled-components'

const types = {
  m: 'margin',
  p: 'padding'
}

const templates = {
  a: (type, size) => ({ [type]: size }),
  b: (type, size) => ({ [`${type}Bottom`]: size }),
  h: (type, size) => ({ [type]: `0px ${size}px` }),
  l: (type, size) => ({ [`${type}Left`]: size }),
  r: (type, size) => ({ [`${type}Right`]: size }),
  t: (type, size) => ({ [`${type}Top`]: size }),
  v: (type, size) => ({ [type]: `${size}px 0px` })
}

export const spacing = (value) =>
  mergeAll(
    value.split(' ').map((statement) => {
      const [rule, size] = statement.split('-')
      const [type, tmpl] = rule.split('')
      const valid = types[type] && templates[tmpl] && size % 5 === 0
      return valid ? templates[tmpl](types[type], parseInt(size)) : {}
    })
  )

const flexDirections = {
  col: 'column',
  row: 'row'
}

const flexProperties = {
  align: 'alignItems',
  justify: 'justifyContent'
}

const flexRules = {
  around: 'space-around',
  base: 'baseline',
  between: 'space-between',
  center: 'center',
  end: 'flex-end',
  evenly: 'space-evenly',
  start: 'flex-start'
}

export const flex = (value) => {
  const [directions, ...params] = value.split(' ')
  const base = {
    display: 'flex',
    flexDirection: flexDirections[directions]
  }
  return mergeAll(
    [base].concat(
      params.map((p) => {
        const [property, rule] = p.split('/')
        return { [flexProperties[property]]: flexRules[rule] }
      })
    )
  )
}

export const isMobile = () => window.outerWidth <= 479

export const sizes = {
  desktop: 2560,
  laptop: 1024,
  laptopL: 1440,
  laptopM: 1280,
  mobile: 480,
  tablet: 768,
  tabletL: 992
}

export const heights = {
  big: 800,
  small: 600
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
      ${css(
        // @ts-ignore
        ...args
      )};
    }
  `
  acc[`atLeast${label[0].toUpperCase()}${label.slice(1, label.length)}`] = (...args) => css`
    @media (min-width: ${sizes[label] + 1}px) {
      ${css(
        // @ts-ignore
        ...args
      )};
    }
  `

  return acc
}, {}) as MediaServiceType

export function useMedia(size: Sizes): boolean {
  const getSize = useMemo(() => {
    return () => {
      if (window.innerWidth <= sizes[size]) {
        return true
      }

      return false
    }
  }, [size])

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
      ${css(
        // @ts-ignore
        ...args
      )};
    }
  `
  return acc
}, {}) as MediaHeightServiceType
