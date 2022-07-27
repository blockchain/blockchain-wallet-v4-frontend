import { css, keyframes } from 'styled-components'

const swingOutAnimationTopKeyframes = keyframes`
  0% {
    transform: rotateX(0deg);
    transform-origin: top;
    opacity: 1;
  }
  100% {
    transform: rotateX(-100deg);
    transform-origin: top;
    opacity: 0.5;
  }
`
const swingInAnimationTopKeyframes = keyframes`
  0% {
    transform: rotateX(-100deg);
    transform-origin: top;
    opacity: 0.5;
  }
  100% {
    transform: rotateX(0deg);
    transform-origin: top;
    opacity: 1;
  }
`
const swingInAnimationBottomKeyframes = keyframes`
  0% {
    transform: rotateX(-100deg);
    transform-origin: bottom;
    opacity: 0.5;
  }
  100% {
    transform: rotateX(0deg);
    transform-origin: bottom;
    opacity: 1;
  }
`

const swingOutBottomAnimationKeyframes = keyframes`
  0% {
    transform: rotateX(0);
    transform-origin: bottom;
    opacity: 1;
  }
  100% {
    transform: rotateX(100deg);
    transform-origin: bottom;
    opacity: 0.5;
  }
`

export const swingInTopAnimation = css`
  animation: ${swingInAnimationTopKeyframes} 0.4s linear;
`
export const swingOutTopAnimation = css`
  animation: ${swingOutAnimationTopKeyframes} 0.4s linear;
`
export const swingInBottomAnimation = css`
  animation: ${swingInAnimationBottomKeyframes} 0.4s linear;
`
export const swingOutBottomAnimation = css`
  animation: ${swingOutBottomAnimationKeyframes} 0.4s linear;
`
