import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6' translate='EMAIL_ADDRESS' />
    <Translate className='d-flex' translate='EMAIL_ADDRESS_EXPLAIN' />
    <Translate className='d-flex text-danger' translate='CHANGE_EMAIL_NOT_EXCHANGE' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <span className='d-flex h6'>test@example.com</span>
    <button className='d-flex button-secondary'>
      <Translate translate='CHANGE' />
    </button>
  </div>
)

export default {
  description, settings
}
