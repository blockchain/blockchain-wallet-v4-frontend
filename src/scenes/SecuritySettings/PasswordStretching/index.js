import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='PBKDF2_ITERATIONS' />
    <Translate className='d-flex' translate='PBKDF2_ITERATIONS_EXPLAIN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <Translate translate='CHANGE' />
    </button>
  </div>
)

export default {
  description, settings
}
