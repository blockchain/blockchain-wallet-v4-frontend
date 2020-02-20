import { useMedia } from 'services/ResponsiveService'
import Announcements from 'components/Announcements'
import Large from './template.large'
import PropTypes from 'prop-types'
import React from 'react'
import Small from './template.small'

const Header = props => {
  const isTabletL = useMedia('tabletL')
  const { handleToggle, ...rest } = props

  return (
    <>
      {isTabletL ? <Small {...rest} /> : <Large {...rest} />}
      <Announcements type='service' alertArea='wallet' />
      <Announcements type='static' />
    </>
  )
}

Header.propTypes = {
  handleToggle: PropTypes.func.isRequired
}

export default Header
