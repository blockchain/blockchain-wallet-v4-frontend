import React from 'react'
import { FormattedMessage } from 'react-intl'
import { CommonFieldProps, Normalizer, Validator, WrappedFieldMetaProps } from 'redux-form'

import { TextBox } from 'components/Form'
import { BSAddCardFormValuesType } from 'data/types'

import { DEFAULT_CVC_LENGTH, getCardTypeByValue } from '../CreditCardBox/model'

export const normalizeCreditCardCVC: Normalizer = (
  value,
  previousValue,
  allValues: BSAddCardFormValuesType
) => {
  if (!value) return value

  const { cvcLength } = getCardTypeByValue(allValues['card-number']) || {
    cvcLength: DEFAULT_CVC_LENGTH
  }

  if (value.length > cvcLength) return previousValue

  const onlyNums = value.replace(/[^\d]/g, '')
  return onlyNums
}

export const validateCreditCardCVC: Validator = (value, allValues: BSAddCardFormValuesType) => {
  const { cvcLength } = getCardTypeByValue(allValues['card-number']) || {
    cvcLength: DEFAULT_CVC_LENGTH
  }
  if (value.length < cvcLength) {
    return <FormattedMessage id='formhelper.invalidnumber' defaultMessage='Invalid number' />
  }
}

const CreditCardCVCBox: React.FC<Props> = (props) => {
  return <TextBox {...props} />
}

type Props = { input: CommonFieldProps; meta: WrappedFieldMetaProps }

export default CreditCardCVCBox
