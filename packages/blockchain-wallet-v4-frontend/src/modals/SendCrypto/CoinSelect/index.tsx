import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Field } from 'redux-form'
import reduxForm, { InjectedFormProps } from 'redux-form/lib/reduxForm'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { StickyHeaderFlyoutWrapper } from 'components/Flyout'
import { StepHeader } from 'components/Flyout/SendRequestCrypto'
import { CoinAccountListOption, SelectBoxCoin } from 'components/Form'
import { actions } from 'data'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'

import { Props as OwnProps } from '..'
import { SEND_FORM } from '../model'
import { getData } from './selectors'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Header = styled(StepHeader)`
  margin-bottom: 40px;
`
const SelectCoinWrapper = styled.div`
  margin-top: 24px;
  width: 40%;
`
const NoAccountsText = styled.div`
  border-top: ${(props) => `1px solid ${props.theme.grey000}`};
  padding: 40px 40px 0;
  text-align: center;
`

class SendCoinSelect extends React.PureComponent<InjectedFormProps<{}, Props> & Props> {
  render() {
    const { close, data, formActions, sendCryptoActions, sendableCoins, walletCurrency } =
      this.props

    return (
      <Wrapper>
        <StickyHeaderFlyoutWrapper>
          <Header spaceBetween>
            <Icon name='arrow-top-right' color='blue600' size='48px' />
            <Icon
              name='close'
              color='grey600'
              role='button'
              data-e2e='close'
              size='24px'
              cursor
              onClick={close}
            />
          </Header>
          <div>
            <Text size='24px' color='grey900' weight={600}>
              <FormattedMessage
                id='modals.sendcrypto.coinselect.title'
                defaultMessage='Send Crypto'
              />
            </Text>
            <Text size='16px' color='grey600' weight={500} style={{ marginTop: '10px' }}>
              <FormattedMessage
                id='modals.sendcrypto.coinselect.subtitle'
                defaultMessage='Select the wallet you want to send from.'
              />
            </Text>
            <SelectCoinWrapper>
              <Field component={SelectBoxCoin} height='32px' name='coin' type='send' />
            </SelectCoinWrapper>
          </div>
        </StickyHeaderFlyoutWrapper>
        {data.accounts.map((account) => (
          <CoinAccountListOption
            key={account.coin + account.address}
            account={account}
            coin={account.coin}
            onClick={() => {
              formActions.change(SEND_FORM, 'selectedAccount', account)
              sendCryptoActions.setStep({ step: SendCryptoStepType.ENTER_TO })
            }}
            walletCurrency={walletCurrency}
          />
        ))}
        {data.accounts.length === 0 && (
          <NoAccountsText>
            <Text size='16px' color='grey900' weight={500} style={{ marginTop: '10px' }}>
              <FormattedMessage
                id='modals.sendcrypto.coinselect.noaccounts'
                defaultMessage='Currently there are no accounts for the selected crypto.'
              />
            </Text>
          </NoAccountsText>
        )}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)
const enhance = compose(
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: SEND_FORM
  }),
  connector
)

type Props = ConnectedProps<typeof connector> & OwnProps

export default enhance(SendCoinSelect) as React.ComponentType<OwnProps>
