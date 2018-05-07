import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import Welcome from './template.js'

class WelcomeContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue () {
    this.props.modalActions.closeModal()
    this.props.modalActions.showModal('RequestBitcoin')
  }

  render () {
    return (
      <Welcome {...this.props} handleContinue={this.handleContinue} />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('Welcome'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(WelcomeContainer)
