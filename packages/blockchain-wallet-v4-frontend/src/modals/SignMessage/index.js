import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions, selectors } from 'data'
import SignMessage from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SignMessageContainer extends React.PureComponent {
  componentDidMount () {
    this.props.signMessageActions.signMessageInitialized()
  }

  componentWillUnmount () {
    this.props.formActions.destroy('signMessage')
  }

  render () {
    const { step, position, total, closeAll, ...rest } = this.props

    return (
      <SignMessage position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep closeAll={closeAll} {...rest} />}
        {step === 2 && <SecondStep closeAll={closeAll} {...rest} />}
      </SignMessage>
    )
  }
}

SignMessageContainer.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired
}

const mapStateToProps = state => ({
  step: selectors.components.signMessage.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  signMessageActions: bindActionCreators(
    actions.components.signMessage,
    dispatch
  )
})

const enhance = compose(
  modalEnhancer('SignMessage'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(SignMessageContainer)
