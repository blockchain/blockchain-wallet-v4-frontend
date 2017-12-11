import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CaptchaBox from './template.js'
import { actions, selectors } from 'data'

class CaptchaBoxContainer extends React.Component {
  componentWillMount () {
    this.props.componentsActions.initCaptcha()
  }

  render () {
    return <CaptchaBox captchaUrl={this.props.data.url} {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  data: selectors.modules.captcha.getCaptcha(state)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  componentsActions: bindActionCreators(actions.modules.captcha, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CaptchaBoxContainer)
