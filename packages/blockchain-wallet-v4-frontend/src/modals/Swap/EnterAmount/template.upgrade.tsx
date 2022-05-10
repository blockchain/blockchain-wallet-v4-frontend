import React from 'react'

import { FlyoutWrapper } from 'components/Flyout'
import GetMoreAccess from 'components/Flyout/Banners/GetMoreAccess'

import { Props } from '.'

const Upgrade: React.FC<Props> = (props) => {
  return (
    <FlyoutWrapper>
      <GetMoreAccess startProcess={props.verifyIdentity} />
    </FlyoutWrapper>
  )
}

export default Upgrade
