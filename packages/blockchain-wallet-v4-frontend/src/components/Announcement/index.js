import React from 'react'
import PropTypes from 'prop-types'

import StaticAnnouncement from './Static'
import ServiceAnnouncement from './Service'

const Announcement = props => {
  return props.type === 'service' ? (
    <ServiceAnnouncement {...props} />
  ) : (
    <StaticAnnouncement {...props} />
  )
}

Announcement.propTypes = {
  type: PropTypes.string.isRequired
}

export default Announcement
