import React from 'react'

import { FlyoutWrapper } from 'components/Flyout'
import UpgradeToGoldLine, { Flows } from 'components/Flyout/Banners/UpgradeToGoldLine'

import { Props } from '.'

const Upgrade: React.FC<Props> = (props) => {
  return (
    <FlyoutWrapper>
      <UpgradeToGoldLine type={Flows.SWAP} verifyIdentity={props.verifyIdentity} />
    </FlyoutWrapper>
  )
}

export default Upgrade
