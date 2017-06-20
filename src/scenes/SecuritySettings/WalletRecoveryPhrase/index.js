import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='WALLET_RECOVERY_PHRASE' />
    <Translate className='d-flex' translate='RECOVERY_PHRASE_EXPLAIN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <Translate translate='CONFIRM_RECOVERY_PHRASE' />
    </button>
  </div>
)

export default {
  description, settings
}
