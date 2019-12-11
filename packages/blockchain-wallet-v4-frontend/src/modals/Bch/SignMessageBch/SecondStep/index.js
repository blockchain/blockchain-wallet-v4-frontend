import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import React from 'react'

import { actions, selectors } from 'data'
import SecondStep from './template'

class SecondStepContainer extends React.PureComponent {
  render () {
    const {
      bchAddr,
      signedMessage,
      closeAll,
      message,
      signMessageActions
    } = this.props

    return (
      <SecondStep
        address={bchAddr}
        message={message}
        signedMessage={signedMessage}
        closeAll={closeAll}
        resetForm={() => signMessageActions.resetFormClicked()}
      />
    )
  }
}

const mapStateToProps = state => ({
  message: formValueSelector('signMessageBch')(state, 'message'),
  signedMessage: selectors.components.signMessageBch.getSignedMessage(state)
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
)(SecondStepContainer)
