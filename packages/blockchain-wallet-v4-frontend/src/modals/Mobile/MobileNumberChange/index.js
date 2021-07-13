import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'
import MobileNumberChange from './template.js'

class MobileNumberChangeContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    const { smsNumberNew } = this.props
    this.props.settingsActions.updateMobile(smsNumberNew)
    this.props.modalActions.closeModal()
    this.props.modalActions.showModal('MOBILE_NUMBER_VERIFY_MODAL', {
      mobileNumber: smsNumberNew
    })
  }

  render() {
    const { countryCode, smsNumber } = this.props
    return (
      <MobileNumberChange
        {...this.props}
        smsNumber={smsNumber}
        countryCode={countryCode}
        onSubmit={this.onSubmit}
      />
    )
  }
}

const mapStateToProps = (state) => getData(state)

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('MOBILE_NUMBER_CHANGE_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(MobileNumberChangeContainer)
