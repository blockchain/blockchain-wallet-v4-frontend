import {
  CommonFieldProps,
  Normalizer,
  Validator,
  WrappedFieldMetaProps
} from 'redux-form'
import { DEFAULT_CVC_LENGTH, getCardTypeByValue } from '../CreditCardBox/model'
import { FormattedMessage } from 'react-intl'
import { SBAddCardFormValuesType } from 'data/types'
import { TextBox } from 'components/Form'
import React from 'react'

export const normalizeCreditCardCVC: Normalizer = (
  value,
  previousValue,
  allValues: SBAddCardFormValuesType
) => {
  if (!value) return value

  const { cvcLength } = getCardTypeByValue(allValues['card-number']) || {
    cvcLength: DEFAULT_CVC_LENGTH
  }

  if (value.length > cvcLength) return previousValue

  const onlyNums = value.replace(/[^\d]/g, '')
  return onlyNums
}

export const validateCreditCardCVC: Validator = (
  value,
  allValues: SBAddCardFormValuesType
) => {
  const { cvcLength } = getCardTypeByValue(allValues['card-number']) || {
    cvcLength: DEFAULT_CVC_LENGTH
  }
  if (value.length < cvcLength) {
    return (
      <FormattedMessage
        id='formhelper.invalidnumber'
        defaultMessage='Invalid number'
      />
    )
  }
}

const CreditCardCVCBox: React.FC<Props> = props => {
  return <TextBox {...props} />
}

type Props = { input: CommonFieldProps; meta: WrappedFieldMetaProps }

export default CreditCardCVCBox
