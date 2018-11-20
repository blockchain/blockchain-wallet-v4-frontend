import React from 'react'

import StaticAnnouncement from './Static'
import ServiceAnnouncement from './Service'

class Announcement extends React.PureComponent {
  render () {
    return this.props.type === 'service' ? (
      <ServiceAnnouncement {...this.props} />
    ) : (
      <StaticAnnouncement {...this.props} />
    )
  }
}

export default Announcement
