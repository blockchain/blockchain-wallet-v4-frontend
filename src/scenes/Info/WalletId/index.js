import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6' translate='UID' />
    <Translate className='d-flex' translate='UID_EXPLAIN' />
    <Translate className='d-flex text-danger' translate='UID_EXPLAIN_WARN' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <label className='d-flex h6'>29f92cab-4dba-90d5-8a68-ab9cd22c3582</label>
  </div>
)

export default {
  description, settings
}
