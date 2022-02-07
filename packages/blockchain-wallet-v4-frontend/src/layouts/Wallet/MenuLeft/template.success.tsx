import React from 'react'
import styled from 'styled-components'

import { media } from 'services/styles'

import { Props as OwnProps, SuccessStateType } from '.'
import Balances from './Balances'
import FundsOnHold from './FundsOnHold'
import Navigation from './Navigation'

export const Container = styled.div<{ toggled?: boolean }>`
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: space-between;
  left: ${(props) => (props.toggled ? '0' : '-250px')};
  width: 250px;
  height: 100%;
  padding: 8px;
  overflow: scroll;
  box-sizing: border-box;
  background: ${(props) => props.theme.white};
  transition: left 0.3s ease-in-out;
  z-index: 11;
  ::-webkit-scrollbar {
    display: none;
  }

  ${media.atLeastTablet`
    display: flex;
    flex: 0 0 250px;
    position: relative;
    top: 0;
    left: 0;
  `}
`

const Overflow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 600px;
  height: 100%;
`

const MenuLeft = (props: Props) => {
  const userTier = props.userData?.tiers?.current
  const isTier2 = userTier >= 2

  return (
    <Container toggled={props.menuOpened}>
      <Balances />
      {isTier2 && props.withdrawalLocksFundsOnHold && <FundsOnHold />}
      <Overflow>
        <Navigation {...props} />
      </Overflow>
    </Container>
  )
}

export type Props = OwnProps & SuccessStateType

export default MenuLeft
