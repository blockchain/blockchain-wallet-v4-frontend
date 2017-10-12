import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepYubico from './template.js'

class TwoStepYubicoContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    e.preventDefault()
    this.props.settingsActions.enableTwoStepYubikey(this.props.code)
  }

  render () {
    return <TwoStepYubico {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  code: formValueSelector('twoStepYubico')(state, 'code')
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('TwoStepYubico'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TwoStepYubicoContainer)
