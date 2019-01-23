import React from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'

const scaleFrames = keyframes`
  0%, 50%, 100% { transform: scale3D(1, 1, 1); }
  25% { transform: scale3D(0, 0, 1); }
`
const scaleAnimation = css`
  ${scaleFrames} 3s infinite ease-in-out;
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
  animation: ${scaleAnimation};
`
const SquareMarketingSecondary = styled(Square)`
  background-color: ${props => props.theme['marketing-secondary']};
`
const SquareTransferred = styled(Square)`
  background-color: ${props => props.theme['transferred']};
`
const SquareMarketingPrimary = styled(Square)`
  background-color: ${props => props.theme['marketing-primary']};
`
const SquareBrandTertiary = styled(Square)`
  background-color: ${props => props.theme['brand-tertiary']};
`
const SquareBrandSecondary = styled(Square)`
  background-color: ${props => props.theme['brand-secondary']};
`

const Square1 = styled(SquareMarketingSecondary)`
  animation-delay: 0s;
`
const Square2 = styled(SquareMarketingSecondary)`
  animation-delay: 0.05s;
`
const Square3 = styled(SquareMarketingSecondary)`
  animation-delay: 0.2s;
`
const Square4 = styled(SquareTransferred)`
  animation-delay: 0.3s;
`
const Square5 = styled(SquareTransferred)`
  animation-delay: 0.4s;
`

const Square6 = styled(SquareMarketingSecondary)`
  animation-delay: 0.05s;
`
const Square7 = styled(SquareMarketingSecondary)`
  animation-delay: 0.2s;
`
const Square8 = styled(SquareMarketingSecondary)`
  animation-delay: 0.3s;
`
const Square9 = styled(SquareTransferred)`
  animation-delay: 0.4s;
`
const Square10 = styled(SquareTransferred)`
  animation-delay: 0.5s;
`

const Square11 = styled(SquareBrandSecondary)`
  animation-delay: 0.2s;
`
const Square12 = styled(SquareBrandSecondary)`
  animation-delay: 0.3s;
`
const Square13 = styled(SquareBrandSecondary)`
  animation-delay: 0.4s;
`
const Square14 = styled(SquareMarketingPrimary)`
  animation-delay: 0.5s;
`
const Square15 = styled(SquareMarketingPrimary)`
  animation-delay: 0.6s;
`

const Square16 = styled(SquareBrandSecondary)`
  animation-delay: 0.3s;
`
const Square17 = styled(SquareBrandSecondary)`
  animation-delay: 0.4s;
`
const Square18 = styled(SquareBrandSecondary)`
  animation-delay: 0.5s;
`
const Square19 = styled(SquareMarketingPrimary)`
  animation-delay: 0.6s;
`
const Square20 = styled(SquareMarketingPrimary)`
  animation-delay: 0.7s;
`

const Square21 = styled(SquareBrandSecondary)`
  animation-delay: 0.4s;
`
const Square22 = styled(SquareBrandSecondary)`
  animation-delay: 0.5s;
`
const Square23 = styled(SquareBrandSecondary)`
  animation-delay: 0.6s;
`
const Square24 = styled(SquareBrandTertiary)`
  animation-delay: 0.7s;
`
const Square25 = styled(SquareBrandTertiary)`
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
