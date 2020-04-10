import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const FiatText = styled(Text)`
  font-size: ${props => props.mobileSize};
  @media (min-width: 480px) {
    font-size: ${props => props.size};
  }
`

const FiatDisplay = props => {
  const {
    coin,
    children,
    size,
    weight,
    color,
    cursor,
    mobileSize,
    className,
    ...rest
  } = props

  return (
    <Wrapper className={className}>
      <FiatText
        mobileSize={mobileSize}
        size={size}
        weight={weight}
        color={color}
        cursor={cursor}
        data-e2e={coin + 'FiatAmt'}
        {...rest}
      >
        {children}
      </FiatText>
    </Wrapper>
  )
}

FiatDisplay.propTypes = {
  coin: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  size: PropTypes.string,
  weight: PropTypes.number,
  color: PropTypes.string,
  cursor: PropTypes.string,
  mobileSize: PropTypes.string
}

FiatDisplay.defaultProps = {
  size: '16px',
  weight: 300,
  color: 'grey700',
  cursor: 'auto'
}

export default FiatDisplay
