import styled, { keyframes } from 'styled-components'

const skeletonKeyframes = (width) => keyframes`
    0% {
        background-position: -${width} 0;
    }
    100% {
        background-position: calc(${width} + 100%) 0;
    }
`

const Teaser = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  max-width: 100%;
  border-radius: ${(props) => props.borderRadius || '8px'};
  background-color: ${(props) => props.theme.grey000};
  background-image: ${(props) =>
    `linear-gradient(90deg, ${props.theme.greyFade100}, ${props.theme.grey100}, ${props.theme.greyFade100})`};
  animation: ${(props) => skeletonKeyframes(props.width)} 1s ease-in-out infinite;
`

export default Teaser
