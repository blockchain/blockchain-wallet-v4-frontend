import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getCurrentTier } from 'data/modules/profile/selectors'
import { media } from 'services/styles'

import Balances from './Balances'
import FundsOnHold from './FundsOnHold'
import Navigation from './Navigation'

export const Container = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: space-between;
  left: -250px;
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

const MenuLeft = () => {
  const { data: currentTier } = useSelector(getCurrentTier, (prev, next) => prev.data === next.data)
  const isTier2 = currentTier >= 2

  return (
    <Container>
      <Balances />
      {isTier2 && <FundsOnHold />}
      <Overflow>
        <Navigation />
      </Overflow>
    </Container>
  )
}

export default MenuLeft
