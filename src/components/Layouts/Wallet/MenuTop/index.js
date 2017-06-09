import React from 'react'
import MenuTop from './template.js'
import { connect } from 'react-redux'
import { core } from 'data/rootSelectors'

class MenuTopContainer extends React.Component {
  render () {
    return (
      <MenuTop balance={this.props.balance} />
    )
  }
}

function mapStateToProps (state, ownProps) {

  return {
    balance: core.info.getBalance(state)
  }
}

export default connect(mapStateToProps)(MenuTopContainer)
