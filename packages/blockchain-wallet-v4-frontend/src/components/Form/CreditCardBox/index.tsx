import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form'
import styled from 'styled-components'

import { TextBox } from 'components/Form'

import { Props as AddCardProps } from '../../../modals/SimpleBuy/AddCard/template.success'
import {
  DEFAULT_CARD_FORMAT,
  DEFAULT_CARD_SVG_LOGO,
  getCardTypeByValue
} from './model'

const duration = 250

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

export const validateCreditCard = (value, allValues, props: AddCardProps) => {
  const cardType = getCardTypeByValue(value)
  const cardMethod = props.paymentMethods.methods.find(
    method => method.type === 'PAYMENT_CARD'
  )

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

  if (
    !(
      cardMethod &&
      cardMethod.subTypes &&
      cardMethod.subTypes.find(subType => subType === cardType.type)
    )
  ) {
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
  transform: rotateX(0deg);
  transition: all ${duration}ms linear;
  &.active {
    transform: rotateX(-90deg);
  }
`

const CreditCardBox: React.FC<Props> = props => {
  const [isActive, setIsActive] = useState(false)
  const [cardType, setCardType] = useState({ logo: DEFAULT_CARD_SVG_LOGO })
  const newCardType = getCardTypeByValue(props.input.value) || {
    logo: DEFAULT_CARD_SVG_LOGO
  }

  useEffect(() => {
    if (cardType.logo !== newCardType.logo) {
      setIsActive(true)
      setTimeout(() => {
        setIsActive(false)
        setCardType(newCardType)
      }, duration)
    }
  }, [cardType, newCardType])

  return (
    <Wrapper>
      <TextBox {...props} />
      <CardLogo
        src={cardType.logo || DEFAULT_CARD_SVG_LOGO}
        className={isActive ? 'active' : ''}
      />
    </Wrapper>
  )
}

type Props = {
  input: CommonFieldProps & { value: string }
  meta: WrappedFieldMetaProps
}

export default CreditCardBox
