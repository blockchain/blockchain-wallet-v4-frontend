import { SelectBox } from 'components/Form'
import React from 'react'

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
