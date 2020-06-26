import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { TextBox } from 'components/Form'
import moment from 'moment'
import React from 'react'

export const normalizeCreditCardExpiry = (value, previousValue) => {
  if (!value) return value
  if (value.length > 5) return previousValue

  const onlyNumsOrSlash = value.replace(/[^\d/]/g, '').replace(/\/{1,}/, '/')
  const prevOnlyNumsOrSlash = previousValue || ''

  if (!prevOnlyNumsOrSlash && onlyNumsOrSlash === '/') return ''

  if (
    prevOnlyNumsOrSlash.length === 1 &&
    onlyNumsOrSlash[onlyNumsOrSlash.length - 1] === '/'
  ) {
    return '0' + prevOnlyNumsOrSlash + '/'
  }

  if (onlyNumsOrSlash.length < prevOnlyNumsOrSlash.length) {
    return onlyNumsOrSlash
  } else {
    if (onlyNumsOrSlash.length === 2) {
      return onlyNumsOrSlash + '/'
    } else {
      return onlyNumsOrSlash
    }
  }
}

export const validateCreditCardExpiry = (value: string) => {
  const regex = /\d{2}\/\d{2}/

  if (!value.match(regex)) {
    return (
      <FormattedMessage
        id='formhelper.invalid_expiry_date'
        defaultMessage='Invalid Expiry Date'
      />
    )
  }

  if (Number(value.split('/')[0]) > 12) {
    return (
      <FormattedMessage
        id='formhelper.invalid_expiry_date'
        defaultMessage='Invalid Expiry Date'
      />
    )
  }

  if (moment(value, 'MM/YY') < moment()) {
    return (
      <FormattedMessage
        id='formhelper.card_expired'
        defaultMessage='Card Expired'
      />
    )
  }
}

const CreditCardExpiryBox: React.FC<Props> = props => {
  return <TextBox {...props} />
}

type Props = { input: CommonFieldProps; meta: WrappedFieldMetaProps }

export default CreditCardExpiryBox
