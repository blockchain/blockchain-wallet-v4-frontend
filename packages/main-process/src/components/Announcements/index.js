import React from 'react'
import PropTypes from 'prop-types'

import StaticAnnouncement from './Static'
import ServiceAnnouncement from './Service'

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
