import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='BITCOIN_CURRENCY' />
    <Translate className='d-flex' translate='BITCOIN_CURRENCY_EXPLAIN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    [BitcoinUnit Dropdown]
  </div>
)

export default {
  description, settings
}
