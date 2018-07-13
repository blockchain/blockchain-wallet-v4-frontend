import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const scaleDelay = keyframes`
  0%, 50%, 100% { transform: scale3D(1, 1, 1); }
  25% { transform: scale3D(0, 0, 1); }
`
const Wrapper = styled.div`
  position: relative;
  width: ${props => props.width};
  height: ${props => props.height};
  transform: rotate(-45deg);
  border-radius: 10%;
  overflow: hidden;
`
const Container = styled.div`
  width: 100%;
  height: 100%;
`
const Square = styled.div`
  display: inline-block;
  width: 20%;
  height: 20%;
  float: left;
  border: 0;
  animation: ${scaleDelay} 3s infinite ease-in-out;
`
const SquareMarketingSecondary = Square.extend`
  background-color: ${props => props.theme['marketing-secondary']};
`
const SquareTransferred = Square.extend`
  background-color: ${props => props.theme['transferred']};
`
const SquareMarketingPrimary = Square.extend`
  background-color: ${props => props.theme['marketing-primary']};
`
const SquareBrandTertiary = Square.extend`
  background-color: ${props => props.theme['brand-tertiary']};
`
const SquareBrandSecondary = Square.extend`
  background-color: ${props => props.theme['brand-secondary']};
`

const Square1 = SquareMarketingSecondary.extend`
  animation-delay: 0s;
`
const Square2 = SquareMarketingSecondary.extend`
  animation-delay: 0.5s;
`
const Square3 = SquareMarketingSecondary.extend`
  animation-delay: 0.2s;
`
const Square4 = SquareTransferred.extend`
  animation-delay: 0.3s;
`
const Square5 = SquareTransferred.extend`
  animation-delay: 0.4s;
`

const Square6 = SquareMarketingSecondary.extend`
  animation-delay: 0.5s;
`
const Square7 = SquareMarketingSecondary.extend`
  animation-delay: 0.2s;
`
const Square8 = SquareMarketingSecondary.extend`
  animation-delay: 0.3s;
`
const Square9 = SquareTransferred.extend`
  animation-delay: 0.4s;
`
const Square10 = SquareTransferred.extend`
  animation-delay: 0.5s;
`

const Square11 = SquareBrandSecondary.extend`
  animation-delay: 0.2s;
`
const Square12 = SquareBrandSecondary.extend`
  animation-delay: 0.3s;
`
const Square13 = SquareBrandSecondary.extend`
  animation-delay: 0.4s;
`
const Square14 = SquareMarketingPrimary.extend`
  animation-delay: 0.5s;
`
const Square15 = SquareMarketingPrimary.extend`
  animation-delay: 0.6s;
`

const Square16 = SquareBrandSecondary.extend`
  animation-delay: 0.3s;
`
const Square17 = SquareBrandSecondary.extend`
  animation-delay: 0.4s;
`
const Square18 = SquareBrandSecondary.extend`
  animation-delay: 0.5s;
`
const Square19 = SquareMarketingPrimary.extend`
  animation-delay: 0.6s;
`
const Square20 = SquareMarketingPrimary.extend`
  animation-delay: 0.7s;
`

const Square21 = SquareBrandSecondary.extend`
  animation-delay: 0.4s;
`
const Square22 = SquareBrandSecondary.extend`
  animation-delay: 0.5s;
`
const Square23 = SquareBrandSecondary.extend`
  animation-delay: 0.6s;
`
const Square24 = SquareBrandTertiary.extend`
  animation-delay: 0.7s;
`
const Square25 = SquareBrandTertiary.extend`
  animation-delay: 0.8s;
`

const BlockchainLoader = props => (
  <Wrapper {...props}>
    <Container>
      <Square1 />
      <Square2 />
      <Square3 />
      <Square4 />
      <Square5 />
      <Square6 />
      <Square7 />
      <Square8 />
      <Square9 />
      <Square10 />
      <Square11 />
      <Square12 />
      <Square13 />
      <Square14 />
      <Square15 />
      <Square16 />
      <Square17 />
      <Square18 />
      <Square19 />
      <Square20 />
      <Square21 />
      <Square22 />
      <Square23 />
      <Square24 />
      <Square25 />
    </Container>
  </Wrapper>
)

BlockchainLoader.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired
}

BlockchainLoader.defaultProps = {
  width: '150px',
  height: '150px'
}

export default BlockchainLoader
