import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import SelectBox from '../SelectBox'
import { Icon, Text } from 'blockchain-info-components'
import { prop } from 'ramda'

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

  & > * { margin-left: 5px; }
  & > :first-child { margin-right: 5px; }
`

const renderItem = (item) => (<HeaderWrapper>
  {prop('value', item) === 'BTC' && <Icon name='bitcoin-in-circle' size='14px' weight={300} />}
  {prop('value', item) === 'BCH' && <Icon name='bitcoin-cash' size='14px' weight={300} />}
  {prop('value', item) === 'ETH' && <Icon name='ethereum-filled' size='14px' weight={300} />}
  <Text size='13px' weight={300} cursor='pointer'>
    {item.text}
  </Text>
</HeaderWrapper>)

class SelectBoxCoin extends React.PureComponent {
  render () {
    const { coins, ...rest } = this.props
    const elements = [{ group: '', items: coins }]
    return <SelectBox elements={elements} templateDisplay={renderItem} templateItem={renderItem} {...rest} />
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
