import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import SelectBox from '../SelectBox'
import { Icon, Text } from 'blockchain-info-components'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
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
      {value === 'BTC' && (
        <Icon name='bitcoin-in-circle' size='14px' weight={300} />
      )}
      {value === 'BCH' && <Icon name='bitcoin-cash' size='14px' weight={300} />}
      {value === 'ETH' && (
        <Icon name='ethereum-filled' size='14px' weight={300} />
      )}
      <Text size='13px' weight={300} cursor='pointer'>
        {text}
      </Text>
    </HeaderWrapper>
  )
}

const renderDisplay = (props, children) => {
  const { value, ...rest } = props
  return (
    <HeaderWrapper {...rest}>
      {value === 'BTC' && (
        <Icon name='bitcoin-in-circle' size='14px' weight={300} />
      )}
      {value === 'BCH' && <Icon name='bitcoin-cash' size='14px' weight={300} />}
      {value === 'ETH' && (
        <Icon name='ethereum-filled' size='14px' weight={300} />
      )}
      <Text size='13px' weight={300} cursor='pointer'>
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
  coins: [
    { text: 'Bitcoin', value: 'BTC' },
    { text: 'Ether', value: 'ETH' },
    { text: 'Bitcoin Cash', value: 'BCH' }
  ]
})

export default connect(mapStateToProps)(SelectBoxCoin)
