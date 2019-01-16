import { css, keyframes } from 'styled-components'

const flightFrames = keyframes`
  0% { left: calc(100%); }
  100% { left: calc(0% - 230px); }
`
export const flight = css`
  ${flightFrames} 10s infinite linear;
`

const flightDelay1Frames = keyframes`
  0% { left: calc(100%); }
  100% { left: calc(-100% - 230px); }
`
export const flightDelay1 = css`
  ${flightDelay1Frames} 20s infinite linear;
`

const flightDelay2Frames = keyframes`
  0% { left: calc(200% + 230px); }
  100% { left: calc(0% - 230px); }
`
export const flightDelay2 = css`
  ${flightDelay2Frames} 20s infinite linear;
`

const balloonFrames = keyframes`
  0% { bottom: calc(0% - 100px); }
  100% { bottom: calc(100%); }
`
export const balloon = css`
  ${balloonFrames} 10s infinite linear;
`

const balloonDelay1Frames = keyframes`
  0% { bottom: calc(0% - 100px); }
  100% { bottom: calc(200%); }
`
export const balloonDelay1 = css`
  ${balloonDelay1Frames} 20s infinite linear;
`

const balloonDelay2Frames = keyframes`
  0% { bottom: calc(-200% - 100px); }
  100% { bottom: calc(100%); }
`
export const balloonDelay2 = css`
  ${balloonDelay2Frames} 20s infinite linear;
`

const droneFrames = keyframes`
  0% { bottom: calc(0% - 100px); }
  50% { bottom: 30%; }
  100% { bottom: calc(-100%); }
`
export const drone = css`
  ${droneFrames} 3s infinite linear;
`

const droneDelay1Frames = keyframes`
  0% { bottom: calc(0% - 100px); }
  30% { bottom: 30%; }
  40% { bottom: 30%; }
  50% { bottom: calc(-100px); }
  100% { bottom: calc(-200%); }
`
export const droneDelay1 = css`
  ${droneDelay1Frames} 6s infinite linear;
`

const droneDelay2Frames = keyframes`
  0% { bottom: calc(-100% - 100px); }
  30% { bottom: calc(-50% - 100px); }
  40% { bottom: calc(-0% - 100px); }
  80% { bottom: 30%; }
  90% { bottom: 30%; }
  95% { bottom: 0%; }
  100% { bottom: -100px; }
`
export const droneDelay2 = css`
  ${droneDelay2Frames} 6s infinite linear;
`
