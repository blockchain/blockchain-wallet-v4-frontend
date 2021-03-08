import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Button, Text } from 'blockchain-info-components'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'

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

class CurrencySwitchContainer extends React.PureComponent {
  render () {
    const { coinDisplayed, preferencesActions, settings } = this.props
    const { currency } = settings.getOrElse({})

    return (
      <Wrapper>
        <SwitchButton
          onClick={preferencesActions.toggleCoinDisplayed}
          data-e2e='balanceDropdown-currency-switch'
        >
          <ButtonText>
            {coinDisplayed ? (
              <FormattedMessage
                id='layouts.wallet.menutop.balance.walletbalance.showfiat'
                defaultMessage='Show {currency}'
                values={{ currency: currency }}
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
  }
}

const mapStateToProps = state => ({
  settings: selectors.core.settings.getSettings(state),
  coinDisplayed: selectors.preferences.getCoinDisplayed(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrencySwitchContainer)
