import React from 'react'
import { SelectBox } from 'components/Form'

const elements = [
  {
    group: '',
    items: [
      {
        value: 'id',
        text: 'Memo_Id'
      },
      {
        value: 'text',
        text: 'Memo_Text'
      }
    ]
  }
]

export const SelectBoxMemo = props => (
  <SelectBox elements={elements} {...props} />
)
