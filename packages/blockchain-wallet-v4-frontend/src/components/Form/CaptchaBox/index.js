import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CaptchaBox from './template.js'
import { actions } from 'data'
import { api } from 'services/ApiService'

class CaptchaBoxContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { captchaUrl: '' }
    this.refreshUrl(props.timestamp)
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.captchaUrl === '' || this.props.timestamp !== nextProps.timestamp) {
      this.refreshUrl(nextProps.timestamp)
    }
  }

  generateUrl (blob) {
    return (window.URL || window.webkitURL).createObjectURL(blob)
  }

  refreshUrl (timestamp) {
    // TODO: Handle multilanguages
    api.getCaptchaImage(timestamp).then(
      data => this.setState({ captchaUrl: this.generateUrl(data) }),
      message => this.props.alertActions.displayError(message)
    )
  }

  render () {
    return <CaptchaBox captchaUrl={this.state.captchaUrl} {...this.props} />
  }
}

CaptchaBoxContainer.propTypes = {
  timestamp: PropTypes.number.isRequired
}

CaptchaBoxContainer.defaultProps = {
  timestamp: new Date().getTime()
}

const mapDispatchToProps = (dispatch) => {
  return {
    alertActions: bindActionCreators(actions.alerts, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(CaptchaBoxContainer)
