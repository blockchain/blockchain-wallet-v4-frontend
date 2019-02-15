import React from 'react'

import { CreatableInput } from 'blockchain-info-components'

const CreatableInputField = props => {
  const { input, meta, ...rest } = props

  return <CreatableInput {...input} {...meta} {...rest} />
}

export default CreatableInputField
