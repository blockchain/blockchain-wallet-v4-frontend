import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import EtherWelcome from './template.js'

class EtherWelcomeContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleRequest = this.handleRequest.bind(this)
  }

  handleClick () {
    this.props.preferencesActions.setEtherWelcome(false)
  }

  handleRequest () {
    this.props.modalActions.showModal('RequestEther')
  }

  render () {
    const { showEtherWelcome, bchBalanceR, btcBalanceR } = this.props
    const exchange = btcBalanceR.getOrElse(0) + bchBalanceR.getOrElse(0) > 0
    return <EtherWelcome displayed={showEtherWelcome} handleClick={this.handleClick} handleRequest={this.handleRequest} exchange={exchange} />
  }
}

const mapStateToProps = state => ({
  bchBalanceR: selectors.core.data.bch.getBalance(state),
  btcBalanceR: selectors.core.data.bitcoin.getBalance(state),
  showEtherWelcome: selectors.preferences.getShowEtherWelcome(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EtherWelcomeContainer)
