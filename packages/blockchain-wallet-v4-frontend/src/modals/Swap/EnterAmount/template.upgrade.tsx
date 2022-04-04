import React from 'react'

import { FlyoutWrapper } from 'components/Flyout'
import GetMoreAccess from 'components/Flyout/Banners/GetMoreAccess'
import UpgradeToGoldLine, { Flows } from 'components/Flyout/Banners/UpgradeToGoldLine'

import { Props } from '.'

const Upgrade: React.FC<Props> = (props) => {
  return (
    <FlyoutWrapper>
      {props.silverRevamp ? (
        <GetMoreAccess startProcess={props.verifyIdentity} />
      ) : (
        <UpgradeToGoldLine type={Flows.SWAP} verifyIdentity={props.verifyIdentity} />
      )}
    </FlyoutWrapper>
  )
}

export default Upgrade
