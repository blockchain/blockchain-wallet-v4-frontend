import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions, selectors } from 'data'
import SendBitcoin from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendBitcoinContainer extends React.PureComponent {
  componentDidMount () {
    const { to, message, amount } = this.props
    this.props.actions.initialized({ to, message, amount })
  }

  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    const { step, position, total, closeAll, to, message, amount } = this.props

    return (
      <SendBitcoin position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep to={to} message={message} amount={amount} />}
        {step === 2 && <SecondStep />}
      </SendBitcoin>
    )
  }
}

SendBitcoinContainer.propTypes = {
  step: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  step: selectors.components.sendBtc.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('SendBitcoin')
)

export default enhance(SendBitcoinContainer)
