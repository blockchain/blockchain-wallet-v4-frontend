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
    this.handleDismiss = this.handleDismiss.bind(this)
    this.toggleCollapse = this.toggleCollapse.bind(this)
  }

  handleDismiss (id) {
    this.props.cacheActions.announcementDismissed(id)
  }

  toggleCollapse (id) {
    this.props.cacheActions.announcementToggled(id, !this.props.data.collapsed)
  }

  render () {
    const { alertArea, data } = this.props
    return data &&
      (data.visible ||
        data.announcements[alertArea].hideType === 'collapse') ? (
      <Announcement
        announcement={data.announcements[alertArea]}
        language={data.language}
        collapsed={data.collapsed}
        handleDismiss={this.handleDismiss}
        toggleCollapse={this.toggleCollapse}
      />
    ) : null
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = dispatch => ({
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

ServiceAnnouncement.propTypes = {
  alertArea: PropTypes.oneOf(['public', 'wallet']).isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceAnnouncement)
