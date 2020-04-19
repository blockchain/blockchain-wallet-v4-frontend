import {
  AccountTypes,
  CoinType,
  RemoteDataType,
  SupportedCoinsType,
  SupportedCoinType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { Field } from 'redux-form'
import { getData } from './selectors'
import { Icon, Text } from 'blockchain-info-components'
import { RatesType } from 'data/types'
import { RootState } from 'data/rootReducer'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { PureComponent } from 'react'
import SelectBox from 'components/Form/SelectBox'
import styled from 'styled-components'

const DisplayContainer = styled.div<{
  coinType: SupportedCoinType
  isItem: boolean
}>`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: ${props => (props.isItem ? '6px 6px 0px 6px' : '16px 12px')};
  > span {
    color: ${props => props.theme[props.coinType.colorCode]} !important;
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

export class BorrowCoinDropdown extends PureComponent<Props> {
  state = {}

  renderElements = (values: SuccessStateType) => {
    return [
      {
        group: '',
        items: values.map(value => ({
          text: value.label,
          value
        }))
      }
    ]
  }

  renderDisplay = (props: { value: AccountTypes }, children) => {
    if (!props.value) return
    const coinType = this.props.supportedCoins[props.value.coin]
    const icon = coinType.icons.circleFilled
    const color = coinType.colorCode
    const isItem = !children

    return (
      <DisplayContainer coinType={coinType} isItem={isItem}>
        <Icon size='32px' color={color} name={icon} />
        <AccountContainer>
          {children || props.value.label}
          <AmountContainer>
            <CoinDisplay
              coin={props.value.coin}
              size='12px'
              weight={500}
              cursor='pointer'
              color='grey800'
            >
              {props.value.balance}
            </CoinDisplay>
            <div style={{ width: '8px' }} />
            <FiatContainer>
              (
              <FiatDisplay
                coin={props.value.coin}
                size='12px'
                weight={500}
                color='grey400'
                currency='USD'
                cursor='pointer'
                rates={this.props.rates}
              >
                {props.value.balance}
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
          <Field
            component={SelectBox}
            elements={this.renderElements(values)}
            templateDisplay={this.renderDisplay}
            templateItem={this.renderDisplay}
            hideIndicator={values.length <= 1}
            openMenuOnClick={values.length > 1}
            searchEnabled={false}
            name={this.props.name}
          />
        )
      },
      Failure: e => (
        <Text>
          {typeof e === 'string' ? e : typeof e === 'object' ? e.message : e}
        </Text>
      ),
      Loading: () => <Text size='24px'>...</Text>,
      NotAsked: () => <Text size='24px'>...</Text>
    })
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: OwnProps
): LinkStatePropsType => ({
  data: getData(state, ownProps)
})

const connector = connect(mapStateToProps)

export type OwnProps = {
  coin: CoinType
  name: 'collateral' | 'repay-principal'
  rates: RatesType
  supportedCoins: SupportedCoinsType
}
type SuccessStateType = Array<AccountTypes>
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(BorrowCoinDropdown)
