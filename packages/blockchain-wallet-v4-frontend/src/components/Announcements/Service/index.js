import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { Remote } from '@core'
import { actions } from 'data'

import { getData } from './selectors.js'
import Announcement from './template.js'

class ServiceAnnouncement extends React.PureComponent {
  handleDismiss = (id) => {
    this.props.cacheActions.announcementDismissed(id)
  }

  toggleCollapse = (id, isCollapsed) => {
    this.props.cacheActions.announcementToggled(id, !isCollapsed)
  }

  render() {
    const { alertArea, data } = this.props
    return data.cata({
      Failure: () => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />,
      Success: (val) => {
        return val.showAnnouncement ? (
          <Announcement
            announcement={val.announcements[alertArea]}
            lang={val.language}
            collapsed={val.collapsed}
            handleDismiss={this.handleDismiss}
            toggleCollapse={this.toggleCollapse}
          />
        ) : null
      }
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: Remote.of(getData(state, ownProps))
})

const mapDispatchToProps = (dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

ServiceAnnouncement.propTypes = {
  alertArea: PropTypes.oneOf(['public', 'request', 'send', 'swap', 'wallet']).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  currentCoin: PropTypes.string // - used in selector.js
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAnnouncement)
