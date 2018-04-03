import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import Create from './template'
import { actions, selectors } from 'data'
import ui from 'redux-ui'
import { path } from 'ramda'

class CreateContainer extends Component {
  componentDidMount () {
    if (this.props.emailVerified) {
      this.props.updateUI({ create: 'create_account' })
    } else {
      this.props.updateUI({ create: 'enter_email_code' })
      this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.oldEmail)
    }
  }

  render () {
    return <Create {...this.props} />
  }
}

CreateContainer.propTypes = {
  ui: PropTypes.object,
  updateUI: PropTypes.function,
  smsVerified: PropTypes.number.isRequired,
  emailVerified: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  oldEmail: selectors.core.settings.getEmail(state).data,
  emailVerified: selectors.core.settings.getEmailVerified(state).data,
  emailVerifiedError: path(['securityCenter', 'emailVerifiedError'], state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { create: '', uniqueEmail: true } })
)

export default enhance(CreateContainer)
