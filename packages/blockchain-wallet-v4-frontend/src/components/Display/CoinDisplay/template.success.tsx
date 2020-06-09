import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const CoinText = styled(Text)<{ mobileSize: string }>`
  white-space: nowrap;
  font-size: ${props => props.mobileSize};
  text-transform: ${props => (props.italic ? 'italic' : 'none')};
  ${media.atLeastMobile`
    font-size: ${props => props.size};
  `}
`

const CoinDisplay = props => {
  const {
    coin,
    children,
    italic,
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
        italic={italic}
        color={color}
        cursor={cursor}
        data-e2e={`${coin}Amt`}
      >
        {children}
      </CoinText>
    </Wrapper>
  )
}

CoinDisplay.defaultProps = {
  size: '16px',
  weight: 300,
  color: 'grey700',
  cursor: 'auto',
  mobileSize: ''
}

export default CoinDisplay
