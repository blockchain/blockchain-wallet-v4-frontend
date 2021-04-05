import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'

import FirstStep from './template'

class FirstStepContainer extends React.PureComponent {
  render() {
    const { address, closeAll, message, signMessageActions } = this.props

    return (
      <FirstStep
        address={address}
        closeAll={closeAll}
        handleSubmit={e => {
          e.preventDefault()
          signMessageActions.signMessageSubmitted(address, message)
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  message: formValueSelector('signMessage')(state, 'message')
})

const mapDispatchToProps = dispatch => ({
  signMessageActions: bindActionCreators(
    actions.components.signMessage,
    dispatch
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
