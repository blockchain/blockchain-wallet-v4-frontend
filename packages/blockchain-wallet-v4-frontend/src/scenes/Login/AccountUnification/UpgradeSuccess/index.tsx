import React from 'react'

import { ProductAuthOptions } from 'data/types'

import { Props } from '../../index'
import Exchange from './exchange.success'
import Wallet from './wallet.success'

const UpgradeSuccess = (props: Props) => {
  const { product } = props.productAuthMetadata
  return (
    <>
      {product === ProductAuthOptions.EXCHANGE && <Exchange {...props} />}
      {product === ProductAuthOptions.WALLET && <Wallet {...props} />}
    </>
  )
}

export default UpgradeSuccess
