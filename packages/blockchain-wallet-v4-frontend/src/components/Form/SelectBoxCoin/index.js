import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import SelectBox from '../SelectBox'
import { Icon, Text } from 'blockchain-info-components'

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

  & > * {
    margin-left: 5px;
  }
  & > :first-child {
    margin-right: 5px;
  }
`

const renderItem = props => {
  const { value, text, ...rest } = props
  return (
    <HeaderWrapper {...rest}>
      {value === 'BTC' && <Icon name='btc-circle' size='22px' weight={300} />}
      {value === 'BCH' && <Icon name='bch-circle' size='22px' weight={300} />}
      {value === 'ETH' && <Icon name='eth-circle' size='22px' weight={300} />}
      {value === 'XLM' && <Icon name='xlm-circle' size='22px' weight={300} />}
      <Text size='14px' weight={300} cursor='pointer'>
        {text}
      </Text>
    </HeaderWrapper>
  )
}

const renderDisplay = (props, children) => {
  const { value, ...rest } = props
  return (
    <HeaderWrapper {...rest}>
      {value === 'BTC' && <Icon name='btc-circle' size='22px' weight={300} />}
      {value === 'BCH' && <Icon name='bch-circle' size='22px' weight={300} />}
      {value === 'ETH' && <Icon name='eth-circle' size='22px' weight={300} />}
      {value === 'XLM' && <Icon name='xlm-circle' size='22px' weight={300} />}
      <Text size='14px' weight={300} cursor='pointer'>
        {children}
      </Text>
    </HeaderWrapper>
  )
}

class SelectBoxCoin extends React.PureComponent {
  render () {
    const { coins, ...rest } = this.props
    const elements = [{ group: '', items: coins }]
    return (
      <SelectBox
        elements={elements}
        templateDisplay={renderDisplay}
        templateItem={renderItem}
        {...rest}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  coins: getCoins(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxCoin)
