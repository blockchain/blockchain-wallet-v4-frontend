import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const CoinText = styled(Text)`
  font-size: ${props => props.mobileSize};
  @media (min-width: 480px){
    font-size: ${props => props.size};
  }
`

const CoinDisplay = props => {
  const { showIcon, coin, children, size, weight, color, cursor, mobileSize } = props
  return (
    <Wrapper>
      {showIcon && coin === 'BTC' && <Icon name='bitcoin' size={size} weight={weight} color={color} />}
      {showIcon && coin === 'ETH' && <Icon name='ethereum' size={size} weight={weight} color={color} />}
      {showIcon && coin === 'BCH' && <Icon name='bitcoin' size={size} weight={weight} color={color} />}
      <CoinText mobileSize={mobileSize} size={size} weight={weight} color={color} cursor={cursor}>{children}</CoinText>
    </Wrapper>
  )
}

CoinDisplay.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  children: PropTypes.string.isRequired,
  showIcon: PropTypes.bool,
  size: PropTypes.string,
  weight: PropTypes.number,
  color: PropTypes.string,
  cursor: PropTypes.string,
  mobileSize: PropTypes.string
}

CoinDisplay.defaultProps = {
  showIcon: false,
  size: '16px',
  weight: 300,
  color: 'gray-5',
  cursor: 'auto',
  mobileSize: false
}

export default CoinDisplay
