import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form'
import { TextBox } from 'components/Form'
import React from 'react'

export const normalizeCreditCardExpiry = (value, previousValue) => {
  if (!value) return value
  if (value.length > 5) return previousValue

  const onlyNumsOrSlash = value.replace(/[^\d/]/g, '')

  return onlyNumsOrSlash
}

const CreditCardExpiryBox: React.FC<Props> = props => {
  return <TextBox {...props} />
}

type Props = { input: CommonFieldProps; meta: WrappedFieldMetaProps }

export default CreditCardExpiryBox
