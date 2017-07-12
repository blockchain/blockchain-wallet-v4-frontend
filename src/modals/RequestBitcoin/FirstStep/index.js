import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import FirstStep from './template.js'

class RequestBitcoinContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleClickCode = this.handleClickCode.bind(this)
  }

  handleClick (event) {
    event.preventDefault()
    this.props.actions.showModalRequestBitcoinStep2()
  }

  handleClickCode (event) {
    event.preventDefault()
    this.props.actions.showModalRequestBitcoinQRCode()
  }

  render () {
    return <FirstStep
      show={this.props.show}
      nextAddress={this.props.nextAddress}
      handleClick={this.handleClick}
      handleClickCode={this.handleClickCode}
    />
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(RequestBitcoinContainer)
