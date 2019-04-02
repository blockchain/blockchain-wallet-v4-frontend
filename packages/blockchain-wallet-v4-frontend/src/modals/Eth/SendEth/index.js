import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions, model, selectors } from 'data'
import SendEth from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

const { COIN_MODELS } = model.coins
class SendEthContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized(this.props.coin || 'ETH')
  }

  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    const { step, position, total, closeAll } = this.props
    const coin = COIN_MODELS[this.props.coin || 'ETH']
    return (
      <SendEth
        position={position}
        total={total}
        closeAll={closeAll}
        coin={coin}
      >
        {step === 1 && <FirstStep coin={coin} />}
        {step === 2 && <SecondStep coin={coin} />}
      </SendEth>
    )
  }
}

SendEthContainer.propTypes = {
  coin: PropTypes.string,
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
  modalEnhancer(model.components.sendEth.MODAL),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(SendEthContainer)
