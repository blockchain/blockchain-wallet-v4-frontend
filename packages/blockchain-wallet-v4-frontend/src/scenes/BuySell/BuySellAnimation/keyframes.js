import { keyframes } from 'styled-components'

export const flight = keyframes`
  0% { left: calc(100%); }
  100% { left: calc(0% - 230px); }
`
export const flightDelay1 = keyframes`
  0% { left: calc(100%); }
  100% { left: calc(-100% - 230px); }
`
export const flightDelay2 = keyframes`
  0% { left: calc(200% + 230px); }
  100% { left: calc(0% - 230px); }
`
export const balloon = keyframes`
  0% { bottom: calc(0% - 100px); }
  100% { bottom: calc(100%); }
`
export const balloonDelay1 = keyframes`
  0% { bottom: calc(0% - 100px); }
  100% { bottom: calc(200%); }
`
export const balloonDelay2 = keyframes`
  0% { bottom: calc(-200% - 100px); }
  100% { bottom: calc(100%); }
`
