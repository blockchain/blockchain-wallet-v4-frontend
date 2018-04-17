import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Button, Modal, ModalHeader, ModalBody, Text } from 'blockchain-info-components'
// import Welcome from './template.js'

class TradeDetails extends React.Component {
  constructor (props) {
    super(props)
    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue () {
    this.props.modalActions.clickWelcomeContinue()
  }

  render () {
    console.log('trade details modal', this.props)
    return (
      <Modal size='large' position={this.props.position} total={this.props.total}>
        <ModalHeader onClose={this.props.close}>
          <FormattedMessage id='modals.welcome.title' defaultMessage='Welcome !' />
        </ModalHeader>
        <ModalBody>
          <div>Trade details modal</div>
        </ModalBody>
      </Modal>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('TradeDetails'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(TradeDetails)
