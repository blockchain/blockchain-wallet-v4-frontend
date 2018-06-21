import React from 'react'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import Announcement from './template.js'

class ServiceAnnouncement extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { collapsed: false, visible: true }
    this.handleDismiss = this.handleDismiss.bind(this)
    this.toggleCollapse = this.toggleCollapse.bind(this)
  }

  componentWillMount () {}

  componentWillUnmount () {}

  handleDismiss (id) {
    this.setState({ visible: false })
    // TODO: write to local storage that user dismissed
    this.props.alertActions.dismissAlert(id)
  }

  toggleCollapse () {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render () {
    const { announcements, type } = this.props

    return this.state.visible && <Announcement announcement={announcements.data[type]} collapsed={this.state.collapsed} handleDismiss={this.handleDismiss} toggleCollapse={this.toggleCollapse} />
  }
}

const mapStateToProps = (state) => ({
  announcements: selectors.core.walletOptions.getAnnouncements(state)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

ServiceAnnouncement.propTypes = {
  type: PropTypes.oneOf(['global', 'wallet']).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAnnouncement)
