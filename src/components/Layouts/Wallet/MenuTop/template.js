import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, ButtonGroup, Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/shared/CoinDisplay'
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
          <Text size='28px' uppercase>
            <FormattedMessage id='components.layouts.wallet.menutop.bank' defaultMessage='Be your own bank.' />
          </Text>
        </TextContainer>
        <ButtonContainer>
          <Button onClick={openSendBitcoin}>
            <Icon name='send' />
            <FormattedMessage id='components.layouts.wallet.menutop.send' defaultMessage='Send' />
          </Button>
          <ButtonGroup>
            <Button onClick={openRequestBitcoin}>
              <Icon name='receive' />
              <FormattedMessage id='components.layouts.wallet.menutop.request' defaultMessage='Request' />
            </Button>
            <Button>
              <Icon name='clipboard' />
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
