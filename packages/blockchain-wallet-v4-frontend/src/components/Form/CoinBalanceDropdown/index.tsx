import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { CoinAccountIcon, Text } from 'blockchain-info-components'
import {
  CoinType,
  RatesType,
  SupportedCoinType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import SelectBox from 'components/Form/SelectBox'

import { getData } from './selectors'

const DisplayContainer = styled.div<{
  coinType: SupportedCoinType
  isItem: boolean
}>`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: ${props => (props.isItem ? '0px 6px' : '16px 12px')};
  > span {
    color: ${props => props.theme[props.coinType.coinCode]} !important;
  }
`
const AccountContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  width: 100%;
  cursor: pointer;
  .bc__single-value {
    position: relative;
    top: 0;
    transform: initial;
    margin: 0;
  }
  input {
    height: 0;
  }
`
const AmountContainer = styled.div`
  margin-top: 4px;
  display: flex;
`
const FiatContainer = styled.div`
  display: flex;
  font-size: 12px;
  color: ${props => props.theme.grey400};
`
export class CoinBalanceDropdown extends PureComponent<Props> {
  coinBalance = selectProps => {
    if (selectProps.value) {
      // Account balance
      if (selectProps.value.balance) {
        return selectProps.value.balance
        // Custodial balance
      } else {
        return selectProps.value.available
      }
    } else {
      return 0
    }
  }

  accountLabel = selectProps => {
    if (selectProps.value) {
      // Account/Custodial label
      return selectProps.value.label || selectProps.label
    } else {
      return ''
    }
  }

  renderDisplay = (
    props: { selectProps: { options: Array<any> }; value },
    children
  ) => {
    const coinType = this.props.supportedCoins[this.props.coin]
    const balance = this.coinBalance(props)
    const account = this.accountLabel(props)
    const isItem = !children

    return (
      <DisplayContainer coinType={coinType} isItem={isItem}>
        <CoinAccountIcon
          accountType={props.value?.type}
          coin={coinType.coinCode}
        />
        <AccountContainer>
          <Text weight={500} color='grey400' size='14px'>
            {account}{' '}
          </Text>
          <AmountContainer>
            <CoinDisplay
              coin={this.props.coin}
              size='12px'
              weight={500}
              cursor='pointer'
              color='grey800'
            >
              {balance}
            </CoinDisplay>
            <div style={{ width: '2px' }} />
            <FiatContainer>
              (
              <FiatDisplay
                coin={this.props.coin}
                size='12px'
                weight={500}
                color='grey400'
                cursor='pointer'
              >
                {balance}
              </FiatDisplay>
              )
            </FiatContainer>
          </AmountContainer>
        </AccountContainer>
      </DisplayContainer>
    )
  }

  render() {
    return this.props.data.cata({
      Success: values => {
        const { addressData } = values
        const options = addressData.data
        return (
          <Field
            component={SelectBox}
            elements={options}
            grouped
            hideIndicator={options.length <= 1}
            openMenuOnClick={options.length > 1}
            options={options}
            name={this.props.name}
            searchEnabled={false}
            templateDisplay={this.renderDisplay}
            templateItem={this.renderDisplay}
          />
        )
      },
      Failure: e => (
        <Text>
          {' '}
          {typeof e === 'string' ? e : typeof e === 'object' ? e.message : e}
        </Text>
      ),
      Loading: () => <Text size='24px'>...</Text>,
      NotAsked: () => <Text size='24px'>...</Text>
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const connector = connect(mapStateToProps)

export type OwnProps = {
  coin: CoinType
  fiatCurrency?: string
  includeCustodial: boolean
  name:
    | 'collateral'
    | 'interestDepositAccount'
    | 'interestWithdrawalAccount'
    | 'repay-principal'
  rates: RatesType
  supportedCoins: SupportedWalletCurrenciesType
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinBalanceDropdown)
