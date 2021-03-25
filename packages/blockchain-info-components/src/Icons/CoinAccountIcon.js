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
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 12px;
  margin: 1px;
  font-weight: ${props => props.weight};
  font-size: ${props => props.size};
  color: white;
  -webkit-font-smoothing: antialiased;
  cursor: ${props => (props.cursorEnabled ? 'pointer' : 'inherit')};
  background: ${props => props.theme[props.color] || props.color};

  &:before {
    position: absolute;
    bottom: ${props => props.offsetBottom};
    right: ${props => props.offsetRight};
    font-family: 'icomoon', sans-serif;
    content: '${props => props.icon}';
  }
`

// hardcoded for 32px size icons... 😕
const CoinAccountIcon = props => {
  const { accountType, coin } = props
  let subIcon
  switch (true) {
    case accountType === 'CUSTODIAL':
      subIcon = {
        offsetBottom: '0.21rem',
        offsetRight: '0.17rem',
        icon: Icomoon['arrow-top-right-bottom-left'],
        size: '6px'
      }
      break
    case accountType === 'EXCHANGE':
      subIcon = {
        offsetBottom: '0.06rem',
        offsetRight: '0.06rem',
        icon: Icomoon['blockchain-logo'],
        size: '9px'
      }
      break
    case accountType === 'INTEREST':
      subIcon = {
        offsetBottom: '0.05rem',
        offsetRight: '0.1rem',
        icon: Icomoon['percentage'],
        size: '9px'
      }
      break
    case accountType === 'ACCOUNT':
    default:
      subIcon = {
        offsetBottom: '0.25rem',
        offsetRight: '0.05rem',
        icon: Icomoon['key'],
        size: '5px'
      }
      break
  }

  return (
    <Wrapper {...props}>
      <Image height='32px' name={coin.toLowerCase()} width='32px' />
      <SubIconWrapper>
        <SubIcon {...subIcon} color={coin} />
      </SubIconWrapper>
    </Wrapper>
  )
}

export default CoinAccountIcon
