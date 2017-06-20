import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='CURRENCY' />
    <Translate className='d-flex' translate='CURRENCY_EXPLAIN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    [Currency Dropdown]
  </div>
)

export default {
  description, settings
}
