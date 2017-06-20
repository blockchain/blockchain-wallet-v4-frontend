import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='LANGUAGE' />
    <Translate className='d-flex' translate='LANGUAGE_EXPLAIN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    [Language Dropdown]
  </div>
)

export default {
  description, settings
}
