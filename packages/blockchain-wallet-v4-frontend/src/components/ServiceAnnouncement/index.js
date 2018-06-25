import React from 'react'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors'
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
    const { alertArea, data } = this.props
    console.info(alertArea)
    console.info(data.announcements[alertArea])

    return this.state.visible
      ? (<Announcement
        announcement={data.announcements[alertArea]}
        language={data.language}
        collapsed={this.state.collapsed}
        handleDismiss={this.handleDismiss}
        toggleCollapse={this.toggleCollapse} />)
      : null
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

ServiceAnnouncement.propTypes = {
  alertArea: PropTypes.oneOf(['global', 'wallet']).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAnnouncement)
