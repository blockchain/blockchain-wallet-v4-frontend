import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Balance from './template.js'

class ActionsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleCoinDisplay = this.handleCoinDisplay.bind(this)
  }

  componentWillMount () {
    this.props.menuTopBalanceActions.initMenuTopBalance()
  }

  handleCoinDisplay () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }

  render () {
    const { bitcoinBalance, etherBalance } = this.props.menuTopBalance
    return <Balance handleCoinDisplay={this.handleCoinDisplay} bitcoinBalance={bitcoinBalance} etherBalance={etherBalance} />
  }
}

const mapStateToProps = (state) => ({
  menuTopBalance: selectors.modules.menuTopBalance.getMenuTopBalance(state)
})

const mapDispatchToProps = (dispatch) => ({
  menuTopBalanceActions: bindActionCreators(actions.modules.menuTopBalance, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer)
