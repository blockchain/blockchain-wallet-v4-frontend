import React from 'react'
import styled, { keyframes } from 'styled-components'

const stretchAnimation = keyframes`
  0%, 40%, 100% { transform: scaleY(0.4); }  
  20% { transform: scaleY(1.0); }
`
const Container = styled.div`
  display: flex;
  justify-content: space-around;
  width: 45px;
  height: 50px;
  text-align: center;
  font-size: 10px;
`
const Rectangle = styled.div`
  display: inline-block;
  width: 6px;
  height: 100%;
  background-color: ${props => props.theme['brand-secondary']};
  animation: ${stretchAnimation} 1.2s infinite ease-in-out;
`
const Rectangle1 = styled(Rectangle)`
  animation-delay: -1.1s;
`
const Rectangle2 = styled(Rectangle)`
  animation-delay: -1.0s;
`
const Rectangle3 = styled(Rectangle)`
  animation-delay: -0.9s
`
const Rectangle4 = styled(Rectangle)`
  animation-delay: -0.8s
`
const Rectangle5 = styled(Rectangle)`
  animation-delay: -0.7s
`

const Loader = props => (
  <Container>
    <Rectangle1 />
    <Rectangle2 />
    <Rectangle3 />
    <Rectangle4 />
    <Rectangle5 />
  </Container>
)

export default Loader
