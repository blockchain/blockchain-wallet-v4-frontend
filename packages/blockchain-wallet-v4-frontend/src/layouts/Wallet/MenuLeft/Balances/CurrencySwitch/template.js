import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  margin: 12px 0 20px;
`

const SwitchButton = styled(Button)`
  width: 200px;
  height: 30px;
  padding: 0;

  &:hover {
    border: 1px solid ${props => props.theme.blue600};
    background-color: transparent;
  }
`
const ButtonText = styled(Text)`
  color: ${props => props.theme.blue600};
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
`

const Template = props => (
  <Wrapper>
    <SwitchButton
      onClick={props.toggleCoinDisplayed}
      data-e2e='balanceDropdown-currency-switch'
    >
      <ButtonText>
        {props.coinDisplayed ? (
          <FormattedMessage
            id='layouts.wallet.menutop.balance.walletbalance.showfiat'
            defaultMessage='Show {currency}'
            values={{ currency: props.currency }}
          />
        ) : (
          <FormattedMessage
            id='layouts.wallet.menutop.balance.walletbalance.showcrypto'
            defaultMessage='Show Crypto'
          />
        )}
      </ButtonText>
    </SwitchButton>
  </Wrapper>
)

export default Template
