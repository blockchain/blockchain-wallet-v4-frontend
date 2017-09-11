import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { ButtonGroup, IconButton, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/CoinDisplay'
import CurrencyDisplay from 'components/CurrencyDisplay'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};

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
          <Text size='28px' weight={200} uppercase>
            <FormattedMessage id='layouts.wallet.menutop.bank' defaultMessage='Be your own bank.' />
          </Text>
        </TextContainer>
        <ButtonContainer>
          <IconButton name='send' onClick={openSendBitcoin}>
            <FormattedMessage id='layouts.wallet.menutop.send' defaultMessage='Send' />
          </IconButton>
          <ButtonGroup>
            <IconButton name='request' onClick={openRequestBitcoin}>
              <FormattedMessage id='layouts.wallet.menutop.request' defaultMessage='Request' />
            </IconButton>
            <IconButton name='clipboard' />
          </ButtonGroup>
        </ButtonContainer>
      </LeftContainer>
      <RightContainer>
        <BalanceContainer onClick={toggleCoinDisplay}>
          <Text size='24px' weight={300}>
            { coinDisplayed ? <CoinDisplay>{balance}</CoinDisplay> : <CurrencyDisplay>{balance}</CurrencyDisplay> }
          </Text>
          <Text size='20px' weight={200}>
            { !coinDisplayed ? <CoinDisplay>{balance}</CoinDisplay> : <CurrencyDisplay>{balance}</CurrencyDisplay> }
          </Text>
        </BalanceContainer>
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
