import React from 'react'
import PropTypes from 'prop-types'

import ServiceAnnouncement from './Service'
import StaticAnnouncement from './Static'

const Announcements = props => {
  return props.type === 'service' ? (
    <ServiceAnnouncement {...props} />
  ) : (
    <StaticAnnouncement {...props} />
  )
}

Announcements.propTypes = {
  type: PropTypes.string.isRequired
}

export default Announcements
