import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import Create from './template'
import { actions, selectors } from 'data'
import ui from 'redux-ui'
import { path } from 'ramda'

class CreateContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { editVerified: false }
  }
  componentDidMount () {
    if (this.props.emailVerified && this.props.smsVerified) this.props.updateUI({ create: 'create_account' })
    else if (this.props.emailVerified) this.props.updateUI({ create: 'change_mobile' })
    else this.props.updateUI({ create: 'enter_email_code' })
  }

  render () {
    return <Create
      editEmail={() => { this.props.updateUI({ create: 'change_email' }); this.setState({ editVerified: true }) }}
      editMobile={() => { this.props.updateUI({ create: 'change_mobile' }); this.setState({ editVerified: true }) }}
      editVerified={this.state.editVerified}
      {...this.props}
    />
  }
}

CreateContainer.propTypes = {
  ui: PropTypes.object,
  updateUI: PropTypes.function,
  smsVerified: PropTypes.number.isRequired,
  emailVerified: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  smsVerified: selectors.core.settings.getSmsVerified(state).data,
  emailVerified: selectors.core.settings.getEmailVerified(state).data,
  emailVerifiedError: path(['securityCenter', 'emailVerifiedError'], state),
  mobileVerifiedError: path(['securityCenter', 'mobileVerifiedError'], state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { create: '', uniqueEmail: true } })
)

export default enhance(CreateContainer)
