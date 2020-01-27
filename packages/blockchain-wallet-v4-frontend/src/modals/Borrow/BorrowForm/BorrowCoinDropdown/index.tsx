import {
  AccountTypes,
  CoinType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { connect } from 'react-redux'
import { Field } from 'redux-form'
import { getData } from './selectors'
import { Icon, Text } from 'blockchain-info-components'
import { RatesType } from 'data/types'
import { RootState } from 'data/rootReducer'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { Component } from 'react'
import SelectBox from 'components/Form/SelectBox'
import styled from 'styled-components'

export type OwnProps = {
  coin: CoinType
  rates: RatesType
  supportedCoins: SupportedCoinsType
}

type SuccessStateType = {
  elements: Array<any>
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & LinkStatePropsType

const DisplayContainer = styled.div`
  display: flex;
  padding: 16px 12px;
`

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`

const AmountContainer = styled.div`
  margin-top: 6px;
`

export class BorrowCoinDropdown extends Component<Props> {
  state = {}

  renderElements = values => {
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
    const coinType = this.props.supportedCoins[props.value.coin]
    const icon = coinType.icons.circleFilled
    const color = coinType.colorCode

    return (
      <DisplayContainer>
        <Icon size='32px' color={color} name={icon} />
        <AccountContainer>
          <Text size='16px' weight={500} color='grey800'>
            {children}
          </Text>
          <AmountContainer>
            <CoinDisplay coin={props.value.coin}>
              {props.value.balance}
            </CoinDisplay>
            <FiatDisplay coin={props.value.coin}>
              {props.value.balance}
            </FiatDisplay>
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
            searchEnabled={false}
            includeAll={false}
            name='collateral'
          />
        )
      },
      Failure: e => <Text>{typeof e === 'string' ? e : e.message}</Text>,
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

export default connect(mapStateToProps)(BorrowCoinDropdown)
