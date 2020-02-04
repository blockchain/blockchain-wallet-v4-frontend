import { connect } from 'react-redux'
import { Field } from 'redux-form'
import { getData } from './selectors'
import { Icon, Text } from 'blockchain-info-components'
import { RemoteDataType } from 'core/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import media from 'services/ResponsiveService'
import React, { Component } from 'react'
import SelectBox from 'components/Form/SelectBox'
import styled from 'styled-components'

// FIXME: TypeScript use CoinType and SupportedCoinType
export type OwnProps = {
  coin: 'BTC' | 'BCH' | 'ETH' | 'PAX' | 'XLM',
  coinModel: any
}

type LinkStatePropsType = {
  // FIXME: TypeScript use AccountTypes
  data: RemoteDataType<string | Error, { data: Array<any> }>
}

type Props = OwnProps & LinkStatePropsType

const Wrapper = styled.div`
  width: 300px;
  z-index: 2;
`
// FIXME: TypeScript use SupportedCoinsType
const DisplayContainer = styled.div<{ coinType: any, isItem: boolean }>`
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

export class WalletBalanceDropdown extends Component<Props> {
  state = {}

  // FIXME: TypeScript use value: { AccountTypes }
  renderDisplay = (props: { value }, children) => {
    const coinType = this.props.coinModel
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
              coin={this.props.coin}
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
                coin={this.props.coin}
                size='12px'
                weight={500}
                color='grey400'
                cursor='pointer'
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
          <Wrapper>
            <Field
              component={SelectBox}
              elements={values.data}
              grouped
              hideIndicator={values.data.length <= 1}
              openMenuOnClick={values.data.length > 1}
              options={values.data}
              name='source'
              searchEnabled={false}
              templateDisplay={this.renderDisplay}
              templateItem={this.renderDisplay}
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
