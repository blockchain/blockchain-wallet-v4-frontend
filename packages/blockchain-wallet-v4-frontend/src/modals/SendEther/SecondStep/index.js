import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import settings from 'config'
import { getData } from './selectors'
import SendConfirm from 'components/SendConfirm'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    // TODO: See how to use the message for the transaction
    const { from, to, message, amount, gasPrice, gasLimit, nonce } = this.props.data
    const network = settings.NETWORK_ETHEREUM
    const data = { from, to, message, amount, gasPrice, gasLimit, nonce }
    this.props.sendEtherActions.sendEther(network, data)
  }
  
  render () {
    const { data, modalActions, ...rest } = this.props
    return <SendConfirm {...data} {...rest} handleSubmit={this.handleSubmit} coin='ETH' closeAll={modalActions.closeAllModals} />
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  sendEtherActions: bindActionCreators(actions.modules.sendEther, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
