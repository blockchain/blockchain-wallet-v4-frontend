import React from 'react'
import styled from 'styled-components'

import Icon from './Icon'

const Wrapper = styled.div`
  position: relative;
  height: ${(props) => props.height || '32px'};
  width: ${(props) => props.height || '32px'};
`
const SubIconWrapper = styled.div`
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 14px;
  height: 14px;
  background: ${(props) => props.theme.white};
  border-radius: 14px;
`
const SubIcon = styled.span`
  display: flex;
  font-size: 12px;
  margin: 1px;
  cursor: ${(props) => (props.cursorEnabled ? 'pointer' : 'inherit')};
  -webkit-font-smoothing: antialiased;

  * {
    color: red !important;
  }
`

const CoinAccountIcon = (props) => {
  const { accountType, coin } = props

  let SubIcon
  switch (true) {
    case accountType === 'CUSTODIAL':
      SubIcon = <Icon name='arrow-top-right-bottom-left-circle' color={coin} />
      break
    case accountType === 'EXCHANGE':
      SubIcon = <Icon name='blockchain-logo-circle' color={coin} />
      break
    case accountType === 'INTEREST':
      SubIcon = <Icon name='percentage' color={coin} />
      break
    case accountType === 'ACCOUNT':
    default:
      SubIcon = <Icon name='key-circle' color={coin} />
      break
  }

  return (
    <Wrapper {...props}>
      <Icon height='32px' name={coin} width='32px' />
      <SubIconWrapper>{SubIcon}</SubIconWrapper>
    </Wrapper>
  )
}

export default CoinAccountIcon
