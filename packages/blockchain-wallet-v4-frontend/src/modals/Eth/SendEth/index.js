import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { propOr } from 'ramda'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import SendEth from './template'

class SendEthContainer extends React.PureComponent {
  componentDidMount() {
    this.props.actions.initialized(propOr('ETH', 'coin', this.props))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.coin !== this.props.coin) {
      this.props.actions.initialized(propOr('ETH', 'coin', this.props))
    }
  }

  componentWillUnmount() {
    this.props.actions.destroyed()
  }

  render() {
    const { closeAll, coin, position, step, total } = this.props
    const { coinfig } = window.coins[coin]
    return (
      <SendEth
        position={position}
        total={total}
        closeAll={closeAll}
        coinDisplayName={coinfig.name}
        coin={coin}
      >
        {step === 1 && <FirstStep coin={coin} />}
        {step === 2 && <SecondStep coin={coin} coinDisplayName={coinfig.name} />}
      </SendEth>
    )
  }
}

SendEthContainer.propTypes = {
  closeAll: PropTypes.func.isRequired,
  coin: PropTypes.string,
  position: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  step: selectors.components.sendEth.getStep(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

const enhance = compose(
  modalEnhancer('SEND_ETH_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SendEthContainer)
