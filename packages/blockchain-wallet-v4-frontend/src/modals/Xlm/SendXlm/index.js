import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions, model, selectors } from 'data'
import SendXlm from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendXlmContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized()
    this.props.fetchData()
  }

  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    const { step, position, total, closeAll } = this.props
    return (
      <SendXlm position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep />}
        {step === 2 && <SecondStep />}
      </SendXlm>
    )
  }
}

SendXlmContainer.propTypes = {
  step: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  step: selectors.components.sendXlm.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendXlm, dispatch),
  fetchData: bindActionCreators(actions.core.data.xlm.fetchData, dispatch)
})

const enhance = compose(
  modalEnhancer(model.components.sendXlm.MODAL),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(SendXlmContainer)
