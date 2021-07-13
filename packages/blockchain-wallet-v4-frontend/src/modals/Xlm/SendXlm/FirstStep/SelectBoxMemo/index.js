import React from 'react'

import { SelectBox } from 'components/Form'

const elements = [
  {
    group: '',
    items: [
      {
        value: 'id',
        text: 'Id'
      },
      {
        value: 'text',
        text: 'Text'
      }
    ]
  }
]

export const SelectBoxMemo = props => (
  <SelectBox elements={elements} {...props} />
)
