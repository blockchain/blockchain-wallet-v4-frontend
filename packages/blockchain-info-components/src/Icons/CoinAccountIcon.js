import React from 'react'
import styled from 'styled-components'

import { Image } from '../..'
import Icomoon from './Icomoon'

const Wrapper = styled.div`
  position: relative;
  height: ${props => props.height || '32px'};
  width: ${props => props.height || '32px'};
`
const SubIconWrapper = styled.div`
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 14px;
  height: 14px;
  background: ${props => props.theme.white};
  border-radius: 14px;
`
const SubIcon = styled.span`
  display: flex;
  font-size: 12px;
  margin: 1px;
  color: ${props => props.theme[props.color] || props.color};
  cursor: ${props => (props.cursorEnabled ? 'pointer' : 'inherit')};
  -webkit-font-smoothing: antialiased;

  * {
    color: red !important;
  }
  
  &:before {
    font-family: 'icomoon', sans-serif;
    content: '${props => props.icon}';
  }
`

const CoinAccountIcon = props => {
  const { accountType, coin } = props

  let icon
  switch (true) {
    case accountType === 'CUSTODIAL':
      icon = Icomoon['arrow-top-right-bottom-left-circle']
      break
    case accountType === 'EXCHANGE':
      icon = Icomoon['blockchain-logo-circle']
      break
    case accountType === 'INTEREST':
      icon = Icomoon['percentage']
      break
    case accountType === 'ACCOUNT':
    default:
      icon = Icomoon['key-circle']
      break
  }

  return (
    <Wrapper {...props}>
      <Image height='32px' name={coin.toLowerCase()} width='32px' />
      <SubIconWrapper>
        <SubIcon icon={icon} color={coin} />
      </SubIconWrapper>
    </Wrapper>
  )
}

export default CoinAccountIcon
