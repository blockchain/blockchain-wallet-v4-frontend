import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import SignMessage from './template'

class SignMessageContainer extends React.PureComponent {
  componentDidMount() {
    this.props.signMessageActions.signMessageInitialized()
  }

  componentWillUnmount() {
    this.props.formActions.destroy('signMessage')
  }

  render() {
    const { closeAll, position, step, total, ...rest } = this.props

    return (
      <SignMessage position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep closeAll={closeAll} {...rest} />}
        {step === 2 && <SecondStep closeAll={closeAll} {...rest} />}
      </SignMessage>
    )
  }
}

SignMessageContainer.propTypes = {
  closeAll: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  step: selectors.components.signMessage.getStep(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  signMessageActions: bindActionCreators(actions.components.signMessage, dispatch)
})

const enhance = compose(
  modalEnhancer('SIGN_MESSAGE_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SignMessageContainer)
