import React from 'react'

import Translate from 'components/Shared/Translate'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <Translate className='d-flex h6 padding-bottom-10' translate='Themes' />
    <Translate className='d-flex' translate='Try out different themes for the wallet.' />
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    [Themes Dropdown]
  </div>
)

export default {
  description, settings
}
