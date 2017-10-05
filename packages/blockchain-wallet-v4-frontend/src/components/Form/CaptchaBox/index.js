import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CaptchaBox from './template.js'
import { actions, selectors } from 'data'

class CaptchaBoxContainer extends React.Component {
  componentWillMount () {
    this.props.captchaActions.fetchCaptcha()
  }

  render () {
    const { data } = this.props
    const { url } = data
    return <CaptchaBox captchaUrl={url} {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  data: selectors.core.captcha.getCaptcha(state)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  captchaActions: bindActionCreators(actions.core.captcha, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CaptchaBoxContainer)
