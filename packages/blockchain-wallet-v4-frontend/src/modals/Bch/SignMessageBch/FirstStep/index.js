import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import React from 'react'

import { actions } from 'data'
import FirstStep from './template'

class FirstStepContainer extends React.PureComponent {
  render () {
    const {
      address,
      bchAddr,
      closeAll,
      message,
      signMessageActions,
      privKey
    } = this.props

    return (
      <FirstStep
        address={bchAddr}
        closeAll={closeAll}
        handleSubmit={e => {
          e.preventDefault()
          signMessageActions.signMessageSubmitted(address, message, privKey)
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  message: formValueSelector('signMessageBch')(state, 'message')
})

const mapDispatchToProps = dispatch => ({
  signMessageActions: bindActionCreators(
    actions.components.signMessageBch,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStepContainer)
