import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form'
import { DEFAULT_CARD_FORMAT, getCardTypeByValue } from './model'
import { FormattedMessage } from 'react-intl'
import { TextBox } from 'components/Form'
import React from 'react'

export const normalizeCreditCard = (value, previousValue) => {
  if (!value) return value

  const { format, maxCardNumberLength } = getCardTypeByValue(value) || {
    format: DEFAULT_CARD_FORMAT,
    maxCardNumberLength: 16
  }

  if (value.replace(/[^\d]/g, '').length > maxCardNumberLength) {
    return previousValue
  }

  if (format.global) {
    const match = value.match(format)
    return match ? match.join(' ') : ''
  }

  const execResult = format.exec(value.split(' ').join(''))
  if (execResult) {
    return execResult
      .splice(1, 3)
      .filter(x => x)
      .join(' ')
  }

  return value
}

export const validateCreditCard = value => {
  const cardType = getCardTypeByValue(value)

  if (!cardType) {
    return (
      <FormattedMessage
        id='formhelper.invalid_card_number'
        defaultMessage='Invalid card number'
      />
    )
  }

  if (!cardType.supported) {
    return (
      <FormattedMessage
        id='formhelper.card_type_unsupported'
        defaultMessage='Card type not supported'
      />
    )
  }
}

const CreditCardBox: React.FC<Props> = props => {
  return <TextBox {...props} />
}

type Props = { input: CommonFieldProps; meta: WrappedFieldMetaProps }

export default CreditCardBox
