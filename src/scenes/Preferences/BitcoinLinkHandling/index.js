import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='HANDLE_BITCOIN_LINKS' />
    <Translate className='d-flex' translate='HANDLE_BITCOIN_LINKS_EXPLAIN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <Translate translate='CHANGE' />
    </button>
    <Translate className='d-flex' translate='HANDLE_BITCOIN_LINKS_STATUS_UNKNOWN' />
  </div>
)

export default {
  description, settings
}
