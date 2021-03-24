import React from 'react'
import { connect } from 'react-redux'
import { pathOr } from 'ramda'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { selectors } from 'data'

import SelectBox from '../SelectBox'
import { getCoins } from './selectors'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  & > :first-child {
    margin-right: 5px;
  }
`
const ItemIcon = styled(Icon)`
  color: ${props => props.theme[props.color]} !important;
  * {
    color: ${props => props.theme[props.color]} !important;
  }
`

class SelectBoxCoin extends React.PureComponent {
  renderItem = props => {
    const { supportedCoins } = this.props
    const { text, value, ...rest } = props
    return (
      <HeaderWrapper {...rest}>
        <ItemIcon
          name={pathOr('', [value, 'coinCode'], supportedCoins)}
          color={pathOr('textBlack', [value, 'coinCode'], supportedCoins)}
          size='20px'
        />
        <Text size='14px' cursor='pointer' data-e2e=''>
          {text}
        </Text>
      </HeaderWrapper>
    )
  }
  renderDisplay = (props, children) => {
    const { supportedCoins } = this.props
    const { value, ...rest } = props
    const e2eTag = value
      ? value.toLowerCase() + 'CurrencyOption'
      : 'currencyOption'
    return (
      <HeaderWrapper {...rest}>
        <ItemIcon
          name={pathOr('', [value, 'coinCode'], supportedCoins)}
          color={pathOr('textBlack', [value, 'coinCode'], supportedCoins)}
          size='20px'
        />
        <Text size='16px' cursor='pointer' data-e2e={e2eTag} weight={500}>
          {children}
        </Text>
      </HeaderWrapper>
    )
  }
  render() {
    const {
      additionalOptions = [],
      coins,
      limitTo = [],
      supportedCoins,
      ...rest
    } = this.props
    const items =
      limitTo.length > 0
        ? [...additionalOptions, ...limitTo]
        : [...additionalOptions, ...coins]

    return (
      <SelectBox
        supportedCoins={supportedCoins}
        elements={[{ group: '', items }]}
        templateDisplay={this.renderDisplay}
        templateItem={this.renderItem}
        zIndex={3}
        {...rest}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  coins: getCoins(state, ownProps),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

export default connect(mapStateToProps)(SelectBoxCoin)
