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

const FiatDisplay = props => {
  const { showIcon, coin, children, size, weight, color } = props

  return (
    <Wrapper>
      {showIcon && coin === 'BTC' && <Icon name='bitcoin' size={size} weight={weight} color={color} />}
      {showIcon && coin === 'ETH' && <Icon name='ethereum' size={size} weight={weight} color={color} />}
      <Text size={size} weight={weight} color={color}>{children}</Text>
    </Wrapper>
  )
}

FiatDisplay.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  children: PropTypes.string.isRequired,
  showIcon: PropTypes.bool,
  size: PropTypes.string,
  weight: PropTypes.number,
  color: PropTypes.string
}

FiatDisplay.defaultProps = {
  showIcon: false,
  size: '16px',
  weight: 300,
  color: 'gray-5'
}

export default FiatDisplay
