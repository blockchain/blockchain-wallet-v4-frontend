import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form'
import { TextBox } from 'components/Form'
import React from 'react'

export const normalizeCreditCardCVC = (value, previousValue) => {
  if (!value) return value
  if (value.length > 3) return previousValue

  const onlyNums = value.replace(/[^\d]/g, '')

  return onlyNums
}

const CreditCardCVCBox: React.FC<Props> = props => {
  return <TextBox {...props} />
}

type Props = { input: CommonFieldProps; meta: WrappedFieldMetaProps }

export default CreditCardCVCBox
