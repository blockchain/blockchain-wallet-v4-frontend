import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6' translate='PAIRING_CODE' />
    <Translate className='d-flex' translate='PAIRING_CODE_EXPLAIN' />
    <Translate className='text-danger' translate='PAIRING_CODE_EXPLAIN_WARN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <Translate translate='SHOW_PAIRING_CODE' />
    </button>
  </div>
)

export default {
  description, settings
}
