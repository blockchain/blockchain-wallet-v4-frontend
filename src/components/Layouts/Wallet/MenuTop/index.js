import React from 'react'
import MenuTop from './template.js'
import { connect } from 'react-redux'
import selectors from 'data/rootSelectors.js'

class MenuTopContainer extends React.Component {
  render () {
    return (
      <MenuTop balance={this.props.balance} />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    balance: selectors.core.getBalance(state)
  }
}

export default connect(mapStateToProps)(MenuTopContainer)
