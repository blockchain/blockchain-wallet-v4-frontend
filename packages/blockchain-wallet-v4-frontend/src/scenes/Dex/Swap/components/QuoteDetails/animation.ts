import { keyframes } from 'styled-components'

export const slideInTopAnimation = keyframes`
  0% {
    transform: scaleY(0.25);
    transform-origin: 100% 0;
  }
  100% {
    transform: scaleY(1);
    transform-origin: 100% 0;
  }
`
