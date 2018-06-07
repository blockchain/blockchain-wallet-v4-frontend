import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { getData } from './selectors'
import MobileNumberChange from './template.js'

class MobileNumberChangeContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    const { mobileNumber } = this.props
    this.props.settingsActions.updateMobile(mobileNumber)
    this.props.modalActions.closeModal()
    this.props.modalActions.showModal('MobileNumberVerify', { mobileNumber })
  }

  render () {
    const { countryCode, mobileNumber } = this.props
    return <MobileNumberChange
      {...this.props}
      countryCode={countryCode}
      mobileNumber={mobileNumber}
      onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => getData(state)

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('MobileNumberChange'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(MobileNumberChangeContainer)
