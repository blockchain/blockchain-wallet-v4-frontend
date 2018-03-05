import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import ListItem from './template.js'

class ListItemContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { toggled: false }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleCoinToggle = this.handleCoinToggle.bind(this)
    this.handleEditDescription = this.handleEditDescription.bind(this)
  }

  handleToggle () {
    this.setState({ toggled: !this.state.toggled })
  }

  handleCoinToggle () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }
  handleEditDescription(value) {
    this.props.walletActions.setTransactionNote(this.props.transaction.hash, value)
  }

  render () {
    return <ListItem transaction={this.props.transaction} toggled={this.state.toggled} handleToggle={this.handleToggle} handleClick={this.handleCoinToggle} handleEditDescription={this.handleEditDescription} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ListItemContainer)
