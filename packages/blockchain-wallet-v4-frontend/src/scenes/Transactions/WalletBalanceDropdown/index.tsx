import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import {
  CoinType,
  CoinTypeEnum,
  ExtractSuccess,
  FiatType,
  FiatTypeEnum,
  SupportedCoinType,
  WalletFiatType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'core/exchange/currency'
import { Field } from 'redux-form'
import { flatten } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { Icon, Text } from 'blockchain-info-components'
import { ModalNamesType } from 'data/types'
import { PriceChange } from '../model'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import Loading from './template.loading'
import React, { Component } from 'react'
import SelectBox from 'components/Form/SelectBox'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
`

// FIXME: TypeScript use SupportedWalletCurrenciesType
const DisplayContainer = styled.div<{ coinType: any; isItem?: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  height: ${props => (props.isItem ? 'auto' : '100%')};
  padding: ${props => (props.isItem ? '0px 0px' : '15px 4px')};
  > span {
    color: ${props => props.theme[props.coinType.colorCode]} !important;
  }
  background-color: none;
`
const AccountContainer = styled.div<{ isItem?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: ${props => (props.isItem ? '16px' : '12px')};
  height: ${props => (props.isItem ? 'auto' : '100%')};
  padding: 12px 0;
  width: 100%;
  cursor: pointer;
  .bc__single-value {
    position: relative;
    top: 0;
    transform: initial;
  }
  input {
    height: 0;
    position: absolute;
  }
`

const AmountContainer = styled.div<{ isItem?: boolean }>`
  display: flex;
  margin-top: ${props => (props.isItem ? '4px' : '0px')};
`

const FiatContainer = styled.div`
  display: flex;
  font-size: 12px;
  color: ${props => props.theme.grey400};
`

const CoinSelect = styled(SelectBox)`
  height: 100%;
  > div {
    height: 100%;
  }
  .bc__control {
    height: 100%;
    background-color: ${({ theme }) => theme.white};
    border: 1px solid ${({ theme }) => theme.grey100};
    & .bc__control--is-focused {
      border: 1px solid ${({ theme }) => theme.blue600};
    }
  }
  .bc__control .bc__value-container {
    padding: 0px;
    height: 100%;
  }
  .bc__menu {
    margin: 8px;
    border-radius: 8px;
  }
  .bc__group {
    &:not(:last-child) {
      ${AccountContainer} {
        border-bottom: 1px solid ${props => props.theme.grey000};
      }
    }
  }
  .bc__option {
    padding: 0px 12px;
  }
  .bc__indicators {
    align-items: flex-start;
    padding-top: 8px;
    padding-right: 8px;
  }
`

export class WalletBalanceDropdown extends Component<Props> {
  state = {}

  isBtcTypeCoin = () => {
    return this.props.coin === 'BTC' || this.props.coin === 'BCH'
  }

  hasBalanceOrAccounts = (groups: Array<any>) => {
    if (this.props.coin in FiatTypeEnum) return false

    const balance = this.coinBalance(this.props.coin)
    const accounts = flatten(groups.map(group => group.options))

    if (balance > 0) {
      return true
    } else if (this.isBtcTypeCoin() && accounts.length > 3) {
      return true
    } else if (!this.isBtcTypeCoin() && accounts.length > 2) {
      return true
    } else {
      return false
    }
  }

  handleRequest = () => {
    if (this.props.isCoinErc20) {
      this.props.modalActions.showModal('@MODAL.REQUEST.ETH', {
        coin: this.props.coin,
        origin: 'WalletBalanceDropdown'
      })
    } else {
      const modal = `@MODAL.REQUEST.${this.props.coin}` as ModalNamesType
      this.props.modalActions.showModal(modal, {
        origin: 'WalletBalanceDropdown',
        coin: this.props.coin
      })
    }
  }

  isTotalBalanceType = selectProps => {
    // BTC/BCH
    if (selectProps.value === 'all') return true
    // ETH/PAX/STELLAR/ALGO
    if (!selectProps.value) return true

    return false
  }

  coinBalance = selectProps => {
    if (this.isTotalBalanceType(selectProps)) {
      // Total balance
      return this.props.data.getOrElse({
        addressData: { data: [] },
        balanceData: 0,
        currency: 'USD',
        currencySymbol: '$',
        priceChangeFiat: 0,
        price24H: { change: '0', movement: 'none', price: 1 },
        priceChangePercentage: 0,
        sbBalance: { available: '0', pending: '0', withdrawable: '0' }
      }).balanceData
    } else if (selectProps.value) {
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
    if (this.isTotalBalanceType(selectProps)) {
      // All label
      return this.props.coinModel.coinTicker
    } else if (selectProps.value) {
      // Account/Custodial label
      return selectProps.value.label || selectProps.label
    } else {
      return ''
    }
  }

  // FIXME: TypeScript use value: { AccountTypes }
  renderDisplay = (
    props: { selectProps: { options: Array<any> }; value },
    children
  ) => {
    const { coinCode, coinTicker } = this.props.coinModel
    const balance = this.coinBalance(props)
    const account = this.accountLabel(props)
    const unsafe_data: SuccessStateType = this.props.data.getOrElse({
      addressData: { data: [] },
      balanceData: 0,
      currency: 'USD' as FiatType,
      currencySymbol: '$',
      priceChangeFiat: 0,
      price24H: { change: '0', movement: 'none', price: 1 },
      priceChangePercentage: 0,
      sbBalance: { available: '0', pending: '0', withdrawable: '0' }
    })

    return (
      <DisplayContainer coinType={coinCode}>
        <AccountContainer>
          {children && children.length && children[1]}
          <Text weight={500} color='grey400'>
            {account}{' '}
            <FormattedMessage id='copy.balance' defaultMessage='Balance' />
          </Text>
          <AmountContainer>
            <FiatDisplay
              coin={this.props.coin}
              size='24px'
              weight={500}
              cursor='pointer'
              color='grey800'
            >
              {balance}
            </FiatDisplay>
          </AmountContainer>

          {this.props.coin in CoinTypeEnum ? (
            this.hasBalanceOrAccounts(props.selectProps.options) ||
            !this.props.coinModel.availability.request ? (
              <PriceChange {...unsafe_data}>
                {' '}
                <FormattedMessage
                  id='scenes.transactions.performance.prices.day'
                  defaultMessage='today'
                />
              </PriceChange>
            ) : (
              <Text
                size='14px'
                weight={500}
                color='blue600'
                onClick={this.handleRequest}
                lineHeight='18px'
              >
                <FormattedMessage
                  id='scenes.transactions.performance.request'
                  defaultMessage='Request {coinTicker} Now'
                  values={{ coinTicker }}
                />
              </Text>
            )
          ) : (
            <Text size='14px' color='grey600' weight={500}>
              <FormattedMessage id='copy.pending' defaultMessage='Pending' />
              {': '}
              {fiatToString({
                value: convertBaseToStandard(
                  'FIAT',
                  unsafe_data.sbBalance?.pending || '0'
                ),
                unit: this.props.coin as WalletFiatType
              })}
            </Text>
          )}
        </AccountContainer>
      </DisplayContainer>
    )
  }

  renderItem = (props: { label; value }) => {
    const coinType = this.props.coinModel as SupportedCoinType
    const balance = this.coinBalance(props)
    const account = this.accountLabel(props)

    return (
      <DisplayContainer coinType={coinType} isItem>
        <Icon
          color={coinType.colorCode}
          name={coinType.icons.circleFilled}
          size='32px'
        />
        <AccountContainer isItem>
          <Text weight={500} color='grey400' size='14px'>
            {account}{' '}
            {this.isTotalBalanceType(props) && (
              <FormattedMessage id='copy.balance' defaultMessage='Balance' />
            )}
          </Text>
          <AmountContainer isItem>
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

  render () {
    return this.props.data.cata({
      Success: values => {
        const { addressData } = values
        const options = addressData.data
        return (
          <Wrapper>
            <Field
              component={CoinSelect}
              elements={options}
              grouped
              hideIndicator={!this.hasBalanceOrAccounts(options)}
              openMenuOnClick={this.hasBalanceOrAccounts(options)}
              options={options}
              name='source'
              searchEnabled={false}
              templateDisplay={this.renderDisplay}
              templateItem={this.renderItem}
            />
          </Wrapper>
        )
      },
      Failure: e => <Text>{typeof e === 'string' ? e : 'Unknown Error'}</Text>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType | WalletFiatType
  coinModel: SupportedCoinType
  isCoinErc20: boolean
}

type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(WalletBalanceDropdown)
