import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Create from './template'
import { actions, selectors } from 'data'
import { path } from 'ramda'
import { getData } from './selectors'

class CreateContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editVerifiedEmail: false,
      editVerifiedMobile: false,
      create: '',
      uniqueEmail: true
    }
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  componentDidMount () {
    if (this.props.emailVerified && this.props.smsVerified) {
      this.handleUpdate('create', 'create_account')
    } else if (this.props.emailVerified) {
      this.handleUpdate('create', 'change_mobile')
    } else this.props.updateUI('create', 'enter_email_code')
  }
  handleUpdate (key, value) {
    this.setState({
      [key]: value
    })
  }

  render () {
    return (
      <Create
        countryCode={this.props.data.countryCode}
        editEmail={() => {
          this.handleUpdate('create', 'change_email')
          this.setState({ editVerifiedEmail: true })
        }}
        editMobile={() => {
          this.handleUpdate('create', 'change_mobile')
          this.setState({ editVerifiedMobile: true })
        }}
        editVerifiedEmail={this.state.editVerifiedEmail}
        editVerifiedMobile={this.state.editVerifiedMobile}
        needsChangeEmail={() => {
          this.handleUpdate('uniqueEmail', false)
          this.handleUpdate('create', 'change_email')
        }}
        ui={this.state}
        handleUpdate={this.handleUpdate}
        {...this.props}
      />
    )
  }
}

CreateContainer.propTypes = {
  ui: PropTypes.object,
  updateUI: PropTypes.func,
  smsVerified: PropTypes.number.isRequired,
  emailVerified: PropTypes.number.isRequired
}

const mapStateToProps = state => ({
  data: getData(state),
  smsVerified: selectors.core.settings.getSmsVerified(state).getOrElse(0),
  emailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(0),
  emailVerifiedError: path(['securityCenter', 'emailVerifiedError'], state),
  mobileVerifiedError: path(['securityCenter', 'mobileVerifiedError'], state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateContainer)
