import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='IP_WHITELIST_RESTRICT' />
    <Translate className='d-flex' translate='IP_WHITELIST_RESTRICT_EXPLAIN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <Translate translate='ENABLE' />
    </button>
  </div>
)

export default {
  description, settings
}
