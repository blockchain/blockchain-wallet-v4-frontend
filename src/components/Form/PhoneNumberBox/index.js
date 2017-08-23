import React from 'react'
import styled from 'styled-components'
import Phone from 'react-phone-number-input'
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'

import { DefaultColor, Text } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const PhoneInput = styled(Phone)`
  width: 100%;
  height: 40px;

  & > * {
    border: 1px solid ${props => props.borderColor}!important;
    height: 100%!important;
    padding: 6px 12px;
    box-sizing: border-box;

    & > * > button { border: 0!important; }
  }
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const selectBorderColor = (state) => {
  switch (state) {
    case 'initial': return DefaultColor.midgrey
    case 'invalid': return DefaultColor.invalidred
    case 'valid': return DefaultColor.green
    default: return DefaultColor.midgrey
  }
}

const PhoneNumberBox = (field) => {
  const errorState = getErrorState(field.meta)
  const borderColor = selectBorderColor(errorState)

  return (
    <Container>
      <PhoneInput {...field.input} borderColor={borderColor} />
      {field.meta.touched && field.meta.error && <Error size='13px' weight={300} color='mahogany'>{field.meta.error}</Error>}
    </Container>
  )
}

export default PhoneNumberBox
