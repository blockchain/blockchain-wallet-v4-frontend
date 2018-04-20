import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions, selectors } from 'data'
import SendBitcoin from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendEtherContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.sendEthInitialized()
  }

  render () {
    const { step, position, total, closeAll } = this.props
    return (
      <SendBitcoin position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep />}
        {step === 2 && <SecondStep />}
      </SendBitcoin>
    )
  }
}

SendEtherContainer.propTypes = {
  step: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  step: selectors.components.sendEth.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('SendEther')
)

export default enhance(SendEtherContainer)
