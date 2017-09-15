import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import MobileNumberChange from './template.js'

class MobileNumberChangeContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  handleUpdate () {
    const { guid, sharedKey, mobileNumber } = this.props
    this.props.settingsActions.updateMobile(guid, sharedKey, mobileNumber)
    this.props.modalActions.closeModal()
    this.props.modalActions.showModal('MobileNumberVerify', { mobileNumber })
  }

  render () {
    return (
      <MobileNumberChange
        {...this.props}
        handleUpdate={this.handleUpdate}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  mobileNumber: formValueSelector('mobileNumberChange')(state, 'mobileNumber')
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('MobileNumberChange'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(MobileNumberChangeContainer)
