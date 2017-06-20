import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='NOTIFICATIONS' />
    <Translate className='d-flex' translate='NOTIFICATIONS_EXPLAIN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    [Notification Configuration]
  </div>
)

export default {
  description, settings
}
