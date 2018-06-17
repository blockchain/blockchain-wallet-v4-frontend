import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Template from './template'

class EmailVerificationSteps extends React.PureComponent {
  componentWillUnmount () {
    this.props.coreSettingsActions.setEmailVerifiedFailedStatus(false)
    this.props.formActions.destroy('securityEmailAddress')
  }

  render () {
    return <Template {...this.props} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  coreSettingsActions: bindActionCreators(actions.core.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(null, mapDispatchToProps)(EmailVerificationSteps)
