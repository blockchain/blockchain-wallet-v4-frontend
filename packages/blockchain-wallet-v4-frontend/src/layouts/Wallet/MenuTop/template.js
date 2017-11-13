import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { ButtonGroup, IconButton, Text } from 'blockchain-info-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

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

  @media(min-width: 850px) { 
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
  @media(min-width: 850px) { order: 1; }
`
const RightContainer = styled(Container)`
  order: 1;
  @media(min-width: 850px) { order: 2; }
`
const TextContainer = styled.div`
  display: none;
  @media(min-width: 850px) { display: flex; }
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px;
  width: auto;
`
const BalanceContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & > * { margin-right: 5px; }

  @media(min-width: 850px) { align-items: flex-end; }
`

const MenuTop = (props) => {
  const { openSend, openRequest, toggleCoinDisplay, bitcoinBalance, etherBalance } = props

  return (
    <Wrapper>
      <LeftContainer>
        <TextContainer>
          <Text size='28px' weight={200} uppercase>
            <FormattedMessage id='layouts.wallet.menutop.bank' defaultMessage='Be your own bank.' />
          </Text>
        </TextContainer>
        <ButtonContainer>
          <IconButton name='send' onClick={openSend}>
            <FormattedMessage id='layouts.wallet.menutop.send' defaultMessage='Send' />
          </IconButton>
          <ButtonGroup>
            <IconButton name='request' onClick={openRequest}>
              <FormattedMessage id='layouts.wallet.menutop.request' defaultMessage='Request' />
            </IconButton>
            <IconButton name='clipboard' />
          </ButtonGroup>
        </ButtonContainer>
      </LeftContainer>
      <RightContainer>
        <BalanceContainer onClick={toggleCoinDisplay}>
          <SwitchableDisplay coin='BTC' size='24px' weight={100} showIcon>{bitcoinBalance}</SwitchableDisplay>
          <Text weight={200} size='24px' >|</Text>
          <SwitchableDisplay coin='ETH' size='24px' weight={100} showIcon>{etherBalance}</SwitchableDisplay>
        </BalanceContainer>
      </RightContainer>
    </Wrapper>
  )
}

MenuTop.propTypes = {
  balance: PropTypes.number.isRequired,
  openSend: PropTypes.func.isRequired,
  openRequest: PropTypes.func.isRequired,
  toggleCoinDisplay: PropTypes.func.isRequired
}

MenuTop.defaultProps = {
  balance: 0
}

export default MenuTop
