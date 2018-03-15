import React, { Component } from 'react'
import Template from './template'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

class SfoxAddBankManuallyContainer extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      fullName: '',
      routingNumber: '',
      accountNumber: '',
      accountType: ''
    }
  }

  handleSubmit () {
    const { fullName, routingNumber, accountNumber, accountType } = this.state
    this.props.sfoxFrontendActions.setBankManually(routingNumber, accountNumber, fullName, accountType)
  }

  render () {
    console.log('add bank manually render', this.props)
    return (
      <Template
        {...this.props}
        handleFullName={(e) => this.setState({ fullName: e.target.value })}
        handleRoutingNumber={(e) => this.setState({ routingNumber: e.target.value })}
        handleAccountNumber={(e) => this.setState({ accountNumber: e.target.value })}
        handleAccountType={(e, val) => this.setState({ accountType: val })}
        handleSubmit={this.handleSubmit}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  connect(undefined, mapDispatchToProps),
  modalEnhancer('SfoxAddBankManually')
)

export default enhance(SfoxAddBankManuallyContainer)
