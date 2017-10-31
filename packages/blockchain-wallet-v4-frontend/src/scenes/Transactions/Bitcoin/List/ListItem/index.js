import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import ListItem from './template.js'

class ListItemContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { toggled: false }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleCoinToggle = this.handleCoinToggle.bind(this)
  }

  handleToggle () {
    const { transaction, transactionFiatAtTime } = this.props
    if (!this.state.toggled && !transactionFiatAtTime) {
      this.props.dataActions.getTransactionFiatAtTime('bitcoin', transaction.hash, transaction.amount, transaction.time * 1000)
    }

    this.setState({ toggled: !this.state.toggled })
  }

  handleCoinToggle () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }

  render () {
    return <ListItem toggled={this.state.toggled} handleToggle={this.handleToggle} handleClick={this.handleCoinToggle} {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  coinDisplayed: selectors.preferences.getCoinDisplayed(state),
  transactionFiatAtTime: selectors.core.data.bitcoin.getTransactionFiatAtTime(state, 'bitcoin', ownProps.transaction.hash, ownProps.currency)
})

const mapDispatchToProps = (dispatch) => ({
  dataActions: bindActionCreators(actions.data, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ListItemContainer)
