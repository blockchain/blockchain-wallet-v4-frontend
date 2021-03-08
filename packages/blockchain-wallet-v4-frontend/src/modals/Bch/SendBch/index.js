import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'

import { actions, model, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import SendBch from './template'

class SendBchContainer extends React.PureComponent {
  componentDidMount () {
    const { actions, amount, description, from, payPro, to } = this.props
    actions.initialized({
      from,
      to,
      description,
      amount,
      payPro
    })
  }

  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    const {
      amount,
      closeAll,
      description,
      excludeHDWallets,
      payPro,
      position,
      step,
      to,
      total
    } = this.props

    return (
      <SendBch position={position} total={total} closeAll={closeAll}>
        {step === 1 && (
          <FirstStep
            amount={amount}
            description={description}
            excludeHDWallets={excludeHDWallets}
            payPro={payPro}
            to={to}
          />
        )}
        {step === 2 && <SecondStep payPro={payPro} />}
      </SendBch>
    )
  }
}

SendBchContainer.propTypes = {
  step: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  step: selectors.components.sendBch.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBch, dispatch)
})

const enhance = compose(
  modalEnhancer(model.components.sendBch.MODAL),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SendBchContainer)
