import React from 'react'

import { useMedia } from 'services/ResponsiveService'
import Announcements from 'components/Announcements'
import Large from './template.large'
import Medium from './template.medium'
import Small from './template.small'

const Header = props => {
  const isLaptop = useMedia('laptop')
  const isTablet = useMedia('tablet')

  return (
    <>
      {isTablet ? (
        <Small {...props} />
      ) : isLaptop ? (
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
