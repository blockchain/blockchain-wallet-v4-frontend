import React from 'react'

import { Navbar } from 'components/NavbarV2'
import { useMedia } from 'services/styles'

import Large from './template.large'
import Medium from './template.medium'
import Small from './template.small'

const Header = (props) => {
  const isLaptop = useMedia('laptop')
  const isTablet = useMedia('tablet')

  if (props.isRedesignEnabled) {
    return <Navbar />
  }
  return (
    <>{isTablet ? <Small {...props} /> : isLaptop ? <Medium {...props} /> : <Large {...props} />}</>
  )
}

export default Header
