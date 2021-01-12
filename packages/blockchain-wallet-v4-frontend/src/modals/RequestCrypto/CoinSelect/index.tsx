import { connect, ConnectedProps } from 'react-redux'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { SwapAccountType } from 'data/components/swap/types'
import { Text } from 'blockchain-info-components'
import SelectBoxCoin from 'components/Form/SelectBoxCoin'

import { getData } from './selectors'
import { Props as OwnProps } from '..'
import { REQUEST_FORM } from '../model'
import { RequestSteps } from '../types'
import CryptoAccountOption from './CryptoAccountOption'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const SelectCoinWrapper = styled.div`
  margin: 24px 0 28px;
  width: 40%;
`

class RequestCoinSelect extends React.PureComponent<Props> {
  render () {
    const {
      accounts,
      formActions,
      requestableCoins,
      supportedCoins,
      walletCurrency
    } = this.props
    return (
      <Wrapper>
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
        {accounts.map(account => (
          <CryptoAccountOption
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
  }

export default connector(RequestCoinSelect)
