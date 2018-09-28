import React from 'react'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Remote } from 'blockchain-wallet-v4/src'

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
    return data.cata({
      Success: val => {
        const showAnnounce =
          val.showAnnounce ||
          val.announcements[alertArea].hideType === 'collapse'
        return (
          <Announcement
            announcement={val.announcements[alertArea]}
            language={val.language}
            collapsed={val.collapsed}
            handleDismiss={this.handleDismiss}
            toggleCollapse={this.toggleCollapse}
            visible={showAnnounce}
          />
        )
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
  alertArea: PropTypes.oneOf(['public', 'wallet']).isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceAnnouncement)
