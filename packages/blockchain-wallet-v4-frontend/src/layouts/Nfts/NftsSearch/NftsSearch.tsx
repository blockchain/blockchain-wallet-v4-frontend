import React from 'react'
import { Field } from 'redux-form'

import { SelectBox } from 'components/Form'

const NftsSearch: React.FC<Props> = () => {
  return (
    <Field
      component={SelectBox}
      elements={[
        {
          group: '',
          items: []
        }
      ]}
      hideIndicator
      label='Collections or items'
      cursor='initial'
      noOptionsMessage={() => 'No collections or items'}
      placeholder='Collections or items'
    />
  )
}

type Props = {}

export default NftsSearch
