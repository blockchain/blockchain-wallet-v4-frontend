import { connect, ConnectedProps } from 'react-redux'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { CoinAccountListOption, SelectBoxCoin } from 'components/Form'
import { FlyoutWrapper } from 'components/Flyout'
import { Icon, Text } from 'blockchain-info-components'
import { SwapAccountType } from 'data/components/swap/types'

import { getData } from './selectors'
import { Props as OwnProps } from '..'
import { REQUEST_FORM, StepHeader } from '../model'
import { RequestSteps } from '../types'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  padding: 0 40px;
`
const SelectCoinWrapper = styled.div`
  margin: 24px 0 28px;
  width: 40%;
`
const NoAccountsText = styled.div`
  border-top: ${props => `1px solid ${props.theme.grey000}`};
  padding: 40px 40px 0;
  text-align: center;
`

class RequestCoinSelect extends React.PureComponent<Props> {
  render () {
    const {
      accounts,
      formActions,
      handleClose,
      requestableCoins,
      supportedCoins,
      walletCurrency
    } = this.props
    return (
      <Wrapper>
        <FlyoutWrapper>
          <StepHeader spaceBetween>
            <Icon name='arrow-bottom-right' color='blue600' size='24px' />
            <Icon
              name='close'
              color='grey600'
              role='button'
              data-e2e='close'
              size='24px'
              cursor
              onClick={handleClose}
            />
          </StepHeader>
        </FlyoutWrapper>
        <Header>
          <Text size='24px' color='grey900' weight={600}>
            <FormattedMessage
              id='modals.requestcrypto.coinselect.title'
              defaultMessage='Receive Crypto'
            />
          </Text>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ marginTop: '10px' }}
          >
            <FormattedMessage
              id='modals.requestcrypto.coinselect.subtitle'
              defaultMessage='Select and share your address or QR code to receive crypto from anyone around the world.'
            />
          </Text>
          <SelectCoinWrapper>
            <Field
              component={SelectBoxCoin}
              height='32px'
              name='selectedCoin'
              props={{
                additionalOptions: [{ text: 'All Wallets', value: 'ALL' }],
                limitTo: requestableCoins.map(coin => ({
                  text: coin,
                  value: coin
                }))
              }}
              type='request'
            />
          </SelectCoinWrapper>
        </Header>
        {accounts.map(account => (
          <CoinAccountListOption
            account={account}
            coinModel={supportedCoins[account.coin]}
            onClick={() => {
              formActions.change(REQUEST_FORM, 'selectedAccount', account)
              formActions.change(
                REQUEST_FORM,
                'step',
                RequestSteps.SHOW_ADDRESS
              )
            }}
            walletCurrency={walletCurrency}
          />
        ))}
        {accounts.length === 0 && (
          <NoAccountsText>
            <Text
              size='16px'
              color='grey900'
              weight={500}
              style={{ marginTop: '10px' }}
            >
              <FormattedMessage
                id='modals.requestcrypto.coinselect.noaccounts'
                defaultMessage='Currently there are no receivable accounts for the selected crypto.'
              />
            </Text>
          </NoAccountsText>
        )}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  accounts: getData(state, ownProps)
})

const connector = connect(mapStateToProps)
type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    handleAccountChange: (account: SwapAccountType) => void
    handleClose: () => void
  }

export default connector(RequestCoinSelect)
