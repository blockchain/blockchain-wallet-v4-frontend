import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import SendXlm from './template'

class SendXlmContainer extends React.PureComponent {
  componentDidMount() {
    const { amount, memo, to } = this.props
    this.props.actions.initialized({ amount, memo, to })
  }

  componentWillUnmount() {
    this.props.actions.destroyed()
  }

  render() {
    const { closeAll, position, step, total } = this.props
    return (
      <SendXlm position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep />}
        {step === 2 && <SecondStep />}
      </SendXlm>
    )
  }
}

SendXlmContainer.propTypes = {
  closeAll: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  step: selectors.components.sendXlm.getStep(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.sendXlm, dispatch),
  fetchData: bindActionCreators(actions.core.data.xlm.fetchData, dispatch)
})

const enhance = compose(
  modalEnhancer('SEND_XLM_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SendXlmContainer)
