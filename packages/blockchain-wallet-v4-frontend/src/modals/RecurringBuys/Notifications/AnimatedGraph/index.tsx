import React, { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import styled from 'styled-components'

import animationData from '../graph.json'

const GraphAnimation = styled.div`
  background-color: ${(props) => props.theme.white};
  width: 100%;
  height: 14.4rem;
  display: block;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  text-align: center;
  opacity: 1;
  background-image: none;

  & > svg {
    height: 10.4rem !important;
  }
`

const AnimatedGraph = ({ stepIndex }: { stepIndex: number }) => {
  const animationContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (animationContainer.current !== null) {
        animationContainer.current.innerHTML = ''
        const anim = lottie.loadAnimation({
          animationData,
          autoplay: false,
          container: animationContainer.current,
          loop: false,
          renderer: 'svg'
        })

        switch (stepIndex) {
          case 0:
            anim.playSegments([0, 50], true)
            break
          case 1:
            anim.playSegments([50, 120], true)
            break
          case 2:
            anim.playSegments([125, 158], true)
            break
          case 3:
            anim.playSegments([200, 225], true)
            break
          default:
            anim.goToAndPlay(250, true)
            break
        }
      }
    }, 500)
  }, [stepIndex])
  return <GraphAnimation ref={animationContainer} />
}

export default AnimatedGraph
