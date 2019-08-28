import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const CoinText = styled(Text)`
  font-size: ${props => props.mobileSize};
  @media (min-width: 480px) {
    font-size: ${props => props.size};
  }
`

const CoinDisplay = props => {
  const {
    coin,
    children,
    size,
    weight,
    color,
    cursor,
    mobileSize,
    ...rest
  } = props
  return (
    <Wrapper {...rest}>
      <CoinText
        mobileSize={mobileSize}
        size={size}
        weight={weight}
        color={color}
        cursor={cursor}
        data-e2e={`${coin}Amt`}
      >
        {children}
      </CoinText>
    </Wrapper>
  )
}

CoinDisplay.propTypes = {
  coin: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  size: PropTypes.string,
  weight: PropTypes.number,
  color: PropTypes.string,
  cursor: PropTypes.string,
  mobileSize: PropTypes.string
}

CoinDisplay.defaultProps = {
  size: '16px',
  weight: 300,
  color: 'gray-5',
  cursor: 'auto',
  mobileSize: ''
}

export default CoinDisplay
