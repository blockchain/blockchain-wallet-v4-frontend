import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form'
import {
  DEFAULT_CARD_FORMAT,
  DEFAULT_CARD_SVG_LOGO,
  getCardTypeByValue
} from './model'
import { FormattedMessage } from 'react-intl'
import { TextBox } from 'components/Form'
import React from 'react'
import styled from 'styled-components'

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

  if (value.replace(/[^\d]/g, '').length < cardType.minCardNumberLength) {
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

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`
const CardLogo = styled.img`
  position: absolute;
  height: 24px;
  right: 8px;
  top: 11px;
`

const CreditCardBox: React.FC<Props> = props => {
  const cardType = getCardTypeByValue(props.input.value)

  return (
    <Wrapper>
      <TextBox {...props} />
      <CardLogo src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO} />
    </Wrapper>
  )
}

type Props = {
  input: CommonFieldProps & { value: string }
  meta: WrappedFieldMetaProps
}

export default CreditCardBox
