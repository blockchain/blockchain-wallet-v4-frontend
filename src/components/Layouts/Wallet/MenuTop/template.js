import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button, ButtonGroup } from 'components/generic/Button'
import { Icon } from 'components/generic/Icon'
import { Text } from 'components/generic/Text'

import RequestBitcoin from 'modals/RequestBitcoin'
import BitcoinDisplay from 'components/shared/BitcoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid #EFEFEF;

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
  width: 275px;
`
const BalanceContainer = styled.div`
 display: flex;
  align-items: center;
  cursor: pointer;

  & > * { font-size: 1.4rem; }

  @media(min-width: 992px) {
    flex-direction: column${props => props.flip ? '-reverse' : ''};
    justify-content: center;
    align-items: flex-end;

    & > :first-child { font-size: 1.8rem; }
    & > :last-child { font-size: 1.4rem; }
  }
`

const MenuTop = (props) => (
  <Wrapper>
    <RequestBitcoin />
    <LeftContainer>
      <TextContainer>
        <Text id='components.layouts.wallet.menutop.bank' text='Be your own bank.' biggest />
      </TextContainer>
      <ButtonContainer>
        <Button onClick={props.openSendBitcoin}>
          <Icon name='icon-send' small />
          <Text id='components.layouts.wallet.menutop.send' text='Send' small light />
        </Button>
        <ButtonGroup>
          <Button onClick={props.openRequestBitcoin}>
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
      <BalanceContainer flip={!props.bitcoinDisplayed} onClick={props.toggleCurrencyDisplay}>
        <BitcoinDisplay amount={props.balance} />
        <CurrencyDisplay amount={props.balance} />
      </BalanceContainer>
    </RightContainer>
  </Wrapper>
)

MenuTop.propTypes = {
  balance: 0,
  openSendBitcoin: PropTypes.func.isRequired,
  openRequestBitcoin: PropTypes.func.isRequired
}

MenuTop.propTypes = {
  balance: PropTypes.number.isRequired,
  toggleCurrencyDisplay: PropTypes.func.isRequired
}

export default MenuTop
