import React from 'react'
import Notifications from './template.js'

class NotificationsContainer extends React.PureComponent {
  render () {
    return <Notifications {...this.props} />
  }
}

export default NotificationsContainer
