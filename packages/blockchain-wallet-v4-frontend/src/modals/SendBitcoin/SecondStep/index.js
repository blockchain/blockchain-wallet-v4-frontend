import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'
import SendConfirm from 'components/SendConfirm'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    const { selection } = this.props.data
    this.props.sendBitcoinActions.sendBitcoin(selection)
  }

  render () {
    const { data, modalActions, ...rest } = this.props
    return <SendConfirm {...rest} {...data} handleSubmit={this.handleSubmit} coin='BTC' closeAll={modalActions.closeAllModals} />
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  sendBitcoinActions: bindActionCreators(actions.modules.sendBitcoin, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
