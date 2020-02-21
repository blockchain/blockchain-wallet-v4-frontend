import { useMedia } from 'services/ResponsiveService'
import Announcements from 'components/Announcements'
import Large from './template.large'
import Medium from './template.medium'
import React from 'react'
import Small from './template.small'

const Header = props => {
  const isTabletL = useMedia('tabletL')
  const isTablet = useMedia('tablet')

  return (
    <>
      {isTablet ? (
        <Small {...props} />
      ) : isTabletL ? (
        <Medium {...props} />
      ) : (
        <Large {...props} />
      )}
      <Announcements type='service' alertArea='wallet' />
      <Announcements type='static' />
    </>
  )
}

export default Header
