import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'

import SecondStep from './template'

class SecondStepContainer extends React.PureComponent {
  render() {
    const {
      address,
      closeAll,
      message,
      signMessageActions,
      signedMessage
    } = this.props

    return (
      <SecondStep
        address={address}
        message={message}
        signedMessage={signedMessage}
        closeAll={closeAll}
        resetForm={() => signMessageActions.resetFormClicked()}
      />
    )
  }
}

const mapStateToProps = state => ({
  message: formValueSelector('signMessage')(state, 'message'),
  signedMessage: selectors.components.signMessage.getSignedMessage(state)
})

const mapDispatchToProps = dispatch => ({
  signMessageActions: bindActionCreators(
    actions.components.signMessage,
    dispatch
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
