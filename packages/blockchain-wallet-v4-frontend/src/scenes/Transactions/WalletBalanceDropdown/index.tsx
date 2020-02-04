import { connect } from 'react-redux'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { RemoteDataType } from 'core/types'
import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import media from 'services/ResponsiveService'
import React, { Component } from 'react'
import SelectBox from 'components/Form/SelectBox'
import styled from 'styled-components'

// FIXME: TypeScript use CoinType and SupportedCoinType
export type OwnProps = {
  coin: 'BTC' | 'BCH' | 'ETH' | 'PAX' | 'XLM'
  coinModel: any
}

type LinkStatePropsType = {
  // FIXME: TypeScript use AccountTypes
  data: RemoteDataType<
    string | Error,
    { addressData: { data: Array<any> }; balanceData: number }
  >
}

type Props = OwnProps & LinkStatePropsType

const Wrapper = styled.div`
  width: 320px;
  z-index: 2;
`
// FIXME: TypeScript use SupportedCoinsType
const DisplayContainer = styled.div<{ coinType: any; isItem?: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: ${props => (props.isItem ? '6px 6px 0px 0px' : '16px 4px')};
  > span {
    color: ${props => props.theme[props.coinType.colorCode]} !important;
  }
`

const AccountContainer = styled.div<{ isItem?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: ${props => (props.isItem ? '0px' : '12px')};
  width: 100%;
  cursor: pointer;
  .bc__single-value {
    position: relative;
    top: 0;
    transform: initial;
  }
  input {
    height: 0;
  }
`

const AmountContainer = styled.div`
  margin-top: 8px;
  display: flex;
`

const FiatContainer = styled.div`
  display: flex;
  font-size: 12px;
  color: ${props => props.theme.grey400};
`

export class WalletBalanceDropdown extends Component<Props> {
  state = {}

  isBtcTypeCoin = () => {
    return this.props.coin === 'BTC' || this.props.coin === 'BCH'
  }

  isTotalBalanceType = selectProps => {
    return selectProps.value === 'all' || !this.isBtcTypeCoin()
  }

  coinBalance = selectProps => {
    return this.isTotalBalanceType(selectProps)
      ? this.props.data.getOrElse({ balanceData: 0 }).balanceData
      : selectProps.value
      ? selectProps.value.balance
      : 0
  }

  // FIXME: TypeScript use value: { AccountTypes }
  renderDisplay = (props: { value }, children) => {
    const coinType = this.props.coinModel
    const balance = this.coinBalance(props)

    return (
      <DisplayContainer coinType={coinType}>
        <AccountContainer>
          {children && children.length && children[1]}
          <Text weight={500} color='grey400'>
            {this.isTotalBalanceType(props)
              ? this.props.coin
              : props.value
              ? props.value.label
              : ''}{' '}
            <FormattedMessage
              id='scenes.transactions.walletbalancedropdown.balance'
              defaultMessage='Balance'
            />
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
        </AccountContainer>
      </DisplayContainer>
    )
  }

  renderItem = (props: { label; value }) => {
    const coinType = this.props.coinModel
    const balance = this.coinBalance(props)

    return (
      <DisplayContainer coinType={coinType} isItem>
        <AccountContainer isItem>
          {this.isTotalBalanceType(props)
            ? props.label
            : props.value
            ? props.value.label
            : ''}
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
            <div style={{ width: '8px' }} />
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
        return (
          <Wrapper>
            <Field
              component={SelectBox}
              elements={values.addressData.data}
              grouped
              hideIndicator={values.addressData.data.length <= 1}
              openMenuOnClick={values.addressData.data.length > 1}
              options={values.addressData.data}
              name='source'
              searchEnabled={false}
              templateDisplay={this.renderDisplay}
              templateItem={this.renderItem}
            />
          </Wrapper>
        )
      },
      Failure: e => <Text>{typeof e === 'string' ? e : e.message}</Text>,
      Loading: () => <Text size='24px'>...</Text>,
      NotAsked: () => <Text size='24px'>...</Text>
    })
  }
}

const mapStateToProps = (state, ownProps): LinkStatePropsType => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(WalletBalanceDropdown)
