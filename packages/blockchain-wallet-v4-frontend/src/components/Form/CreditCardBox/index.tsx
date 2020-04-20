import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form'
import { TextBox } from 'components/Form'
import React from 'react'

export const normalizeCreditCard = (value, previousValue) => {
  if (!value) return value

  const onlyNums = value.replace(/[^\d]/g, '')

  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 4) {
      return onlyNums + ' '
    }
    if (onlyNums.length === 8) {
      return onlyNums.slice(0, 4) + ' ' + onlyNums.slice(4) + ' '
    }
    if (onlyNums.length === 12) {
      return (
        onlyNums.slice(0, 4) +
        ' ' +
        onlyNums.slice(4, 8) +
        ' ' +
        onlyNums.slice(8, 12) +
        ' '
      )
    }
  }

  if (onlyNums.length <= 4) {
    return onlyNums
  }
  if (onlyNums.length <= 8) {
    return onlyNums.slice(0, 4) + ' ' + onlyNums.slice(4)
  }
  if (onlyNums.length <= 12) {
    return (
      onlyNums.slice(0, 4) +
      ' ' +
      onlyNums.slice(4, 8) +
      ' ' +
      onlyNums.slice(8, 12)
    )
  }
  return (
    onlyNums.slice(0, 4) +
    ' ' +
    onlyNums.slice(4, 8) +
    ' ' +
    onlyNums.slice(8, 12) +
    ' ' +
    onlyNums.slice(12, 16)
  )
}

const CreditCardBox: React.FC<Props> = props => {
  return <TextBox {...props} />
}

type Props = { input: CommonFieldProps; meta: WrappedFieldMetaProps }

export default CreditCardBox
