import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import Announcement from './template.js'

class ServiceAnnouncement extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose (id) {
    this.props.alertActions.dismissAlert(id)
  }

  render () {
    return <Announcement alerts={this.props.alerts} handleClose={this.handleClose} />
  }
}

const mapStateToProps = (state) => ({
  alerts: selectors.alerts.selectAlerts(state)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAnnouncement)
