import React from 'react'

import { ProductAuthOptions } from 'data/types'

import { Props } from '../../index'
import Exchange from './exchange.success'
import Wallet from './wallet.success'

const UpgradeSuccess = (props: Props) => {
  const { designatedProduct } = props
  return (
    <>
      {designatedProduct === ProductAuthOptions.EXCHANGE && <Exchange {...props} />}
      {designatedProduct === ProductAuthOptions.WALLET && <Wallet {...props} />}
    </>
  )
}

export default UpgradeSuccess
