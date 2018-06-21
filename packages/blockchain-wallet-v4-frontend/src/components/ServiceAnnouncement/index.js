import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import Announcement from './template.js'

class ServiceAnnouncement extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleDismiss = this.handleDismiss.bind(this)
  }

  handleDismiss (id) {
    // TODO: write to local storage that user dismissed
    this.props.alertActions.dismissAlert(id)
  }

  render () {
    const { announcements, type } = this.props
    return <Announcement announcement={announcements.data[type]} handleDismiss={this.handleDismiss} />
  }
}

const mapStateToProps = (state) => ({
  announcements: selectors.core.walletOptions.getAnnouncements(state)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAnnouncement)
