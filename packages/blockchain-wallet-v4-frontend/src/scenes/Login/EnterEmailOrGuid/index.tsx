import React from 'react'

import { ProductAuthOptions } from 'data/types'

import { Props } from '..'
import Exchange from './exchange.template'
import Wallet from './wallet.template'

const EnterEmailOrGuid = (props: Props) => {
  const { designatedProduct } = props
  return (
    <>
      {designatedProduct === ProductAuthOptions.EXCHANGE && <Exchange {...props} />}
      {designatedProduct === ProductAuthOptions.WALLET && <Wallet {...props} />}
    </>
  )
}

export default EnterEmailOrGuid
