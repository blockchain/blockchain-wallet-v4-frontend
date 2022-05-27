import React from 'react'
import { FormattedMessage } from 'react-intl'
import { isBefore } from 'date-fns'
import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form'

import TextBox from 'components/Form/TextBox'

export { normalizeCreditCardExpiry } from './utils'

export const validateCreditCardExpiry = (value: string) => {
  const regex = /\d{2}\/\d{2}/

  if (!value.match(regex)) {
    return (
      <FormattedMessage id='formhelper.invalid_expiry_date' defaultMessage='Invalid Expiry Date' />
    )
  }

  if (Number(value.split('/')[0]) > 12) {
    return (
      <FormattedMessage id='formhelper.invalid_expiry_date' defaultMessage='Invalid Expiry Date' />
    )
  }

  if (isBefore(new Date(), new Date(value))) {
    return <FormattedMessage id='formhelper.card_expired' defaultMessage='Card Expired' />
  }
}

const CreditCardExpiryBox: React.FC<Props> = (props) => {
  return <TextBox {...props} />
}

type Props = { input: CommonFieldProps; meta: WrappedFieldMetaProps }

export default CreditCardExpiryBox
