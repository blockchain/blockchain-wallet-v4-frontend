import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'

import { getData } from './selectors'
import Announcement from './template.js'

class ServiceAnnouncement extends React.PureComponent {
  handleDismiss = id => {
    this.props.cacheActions.announcementDismissed(id)
  }

  toggleCollapse = (id, isCollapsed) => {
    this.props.cacheActions.announcementToggled(id, !isCollapsed)
  }

  render() {
    const { alertArea, data } = this.props
    return data.cata({
      Success: val => {
        return val.showAnnouncement ? (
          <Announcement
            announcement={val.announcements[alertArea]}
            lang={val.language}
            collapsed={val.collapsed}
            handleDismiss={this.handleDismiss}
            toggleCollapse={this.toggleCollapse}
          />
        ) : null
      },
      Loading: () => <div />,
      Failure: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: Remote.of(getData(state, ownProps))
})

const mapDispatchToProps = dispatch => ({
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

ServiceAnnouncement.propTypes = {
  alertArea: PropTypes.oneOf([
    'public',
    'request',
    'send',
    'swap',
    'wallet'
  ]).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAnnouncement)
