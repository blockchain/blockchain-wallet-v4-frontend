import React from 'react'

import { ProductAuthOptions } from 'data/types'

import { Props } from '..'
import Test from './test'
import Exchange from './exchange.template'
import Wallet from './wallet.template'

const EnterEmailOrGuid = (props: Props) => {
  const { designatedProduct } = props
  return (
    <>
      {designatedProduct === ProductAuthOptions.EXCHANGE && <Exchange {...props} />}
      {designatedProduct === ProductAuthOptions.WALLET && <Test {...props} />}
    </>
  )
}

export default EnterEmailOrGuid
