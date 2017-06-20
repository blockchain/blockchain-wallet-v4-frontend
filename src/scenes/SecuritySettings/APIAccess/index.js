import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='API_ACCESS' />
    <Translate className='d-flex' translate='API_ACCESS_SUPPORT' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end' />
)

export default {
  description, settings
}
