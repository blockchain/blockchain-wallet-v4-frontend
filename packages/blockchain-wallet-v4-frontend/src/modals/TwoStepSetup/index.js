import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepSetup from './template.js'

class TwoStepSetupContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (value) {
    this.props.modalActions.showModal(value)
  }

  render () {
    return (
      <TwoStepSetup {...this.props} handleClick={this.handleClick} />
    )
  }
}

const mapStateToProps = (state) => ({
  enabled: false
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('TwoStepSetup'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TwoStepSetupContainer)
