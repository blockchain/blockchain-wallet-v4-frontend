import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button, ButtonGroup, Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/shared/CoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'

console.log(CoinDisplay, CurrencyDisplay)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid #DDDDDD;

  @media(min-width: 768px) { 
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
`
const LeftContainer = styled(Container)`
  order: 2;
  @media(min-width: 768px) { order: 1; }
`
const RightContainer = styled(Container)`
  order: 1;
  @media(min-width: 768px) { order: 2; }
`
const TextContainer = styled.div`
  display: none;
  @media(min-width: 768px) { display: flex; }
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px;
  width: 300px;
`
const BalanceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  & > :last-child { display: none; }

  @media(min-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    & > :last-child { display: block; }
  }
`

const MenuTop = (props) => {
  const { openSendBitcoin, openRequestBitcoin, coinDisplayed, toggleCoinDisplay, balance } = props

  return (
    <Wrapper>
      <LeftContainer>
        <TextContainer>
          <Text id='components.layouts.wallet.menutop.bank' text='Be your own bank.' biggest />
        </TextContainer>
        <ButtonContainer>
          <Button onClick={openSendBitcoin}>
            <Icon name='icon-send' small />
            <Text id='components.layouts.wallet.menutop.send' text='Send' small light />
          </Button>
          <ButtonGroup>
            <Button onClick={openRequestBitcoin}>
              <Icon name='icon-receive' small />
              <Text id='components.layouts.wallet.menutop.request' text='Request' small light />
            </Button>
            <Button>
              <Icon name='ti-clipboard' small />
            </Button>
          </ButtonGroup>
        </ButtonContainer>
      </LeftContainer>
      <RightContainer>
        { coinDisplayed
          ? <BalanceContainer onClick={toggleCoinDisplay}>
            <CoinDisplay biggest>{balance}</CoinDisplay>
            <CurrencyDisplay big>{balance}</CurrencyDisplay>
          </BalanceContainer>
          : <BalanceContainer onClick={toggleCoinDisplay}>
            <CurrencyDisplay biggest>{balance}</CurrencyDisplay>
            <CoinDisplay big>{balance}</CoinDisplay>
          </BalanceContainer>
        }
      </RightContainer>
    </Wrapper>
  )
}

MenuTop.propTypes = {
  balance: PropTypes.number.isRequired,
  openSendBitcoin: PropTypes.func.isRequired,
  openRequestBitcoin: PropTypes.func.isRequired,
  toggleCoinDisplay: PropTypes.func.isRequired
}

export default MenuTop
