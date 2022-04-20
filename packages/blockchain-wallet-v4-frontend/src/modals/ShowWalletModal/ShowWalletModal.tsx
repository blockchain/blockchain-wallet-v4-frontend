import React from 'react'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'

import { ShowWalletModalComponent } from './ShowWalletModal.types'

export const ShowWalletModal: ShowWalletModalComponent = () => {
  return (
    <Flyout isOpen position={0} onClose={() => null} total={1}>
      <div></div>
    </Flyout>
  )
}
