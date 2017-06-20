import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='MOBILE_NUMBER' />
    <Translate className='d-flex' translate='MOBILE_NUMBER_EXPLAIN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <span className='d-flex h6'>+447800000000</span>
    <button className='d-flex button-secondary'>
      <Translate translate='CHANGE' />
    </button>
  </div>
)

export default {
  description, settings
}
