import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import React from 'react'

import { actions } from 'data'
import { fromCashAddr } from 'blockchain-wallet-v4/src/utils/bch'
import FirstStep from './template'

class FirstStepContainer extends React.PureComponent {
  render () {
    const {
      address,
      closeAll,
      message,
      signMessageActions,
      privKey
    } = this.props

    return (
      <FirstStep
        address={address}
        closeAll={closeAll}
        handleSubmit={e => {
          e.preventDefault()
          signMessageActions.signMessageSubmitted(
            fromCashAddr(address),
            message,
            privKey
          )
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
