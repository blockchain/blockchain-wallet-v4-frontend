import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const FiatText = styled(Text)<{ mobileSize: string }>`
  font-size: ${(props) => props.mobileSize};
  ${media.atLeastMobile`
    font-size: ${(props) => props.size};
  `}
`

const FiatDisplay = (props) => {
  const { children, className, coin, color, cursor, mobileSize, size, weight, ...rest } = props

  return (
    <Wrapper className={className}>
      <FiatText
        mobileSize={mobileSize}
        size={size}
        weight={weight}
        color={color}
        cursor={cursor || undefined}
        data-e2e={`${coin}FiatAmt`}
        {...rest}
      >
        {children}
      </FiatText>
    </Wrapper>
  )
}

FiatDisplay.propTypes = {
  children: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  color: PropTypes.string,
  cursor: PropTypes.string,
  mobileSize: PropTypes.string,
  size: PropTypes.string,
  weight: PropTypes.number
}

FiatDisplay.defaultProps = {
  color: 'grey700',
  cursor: 'auto',
  size: '16px',
  weight: 300
}

export default FiatDisplay
