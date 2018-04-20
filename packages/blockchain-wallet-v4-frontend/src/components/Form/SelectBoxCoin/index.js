import React from 'react'
import { connect } from 'react-redux'

import SelectBox from '../SelectBox'

class SelectBoxCoin extends React.PureComponent {
  render () {
    const { coins, ...rest } = this.props
    const elements = [{ group: '', items: coins }]
    return <SelectBox elements={elements} {...rest} />
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
