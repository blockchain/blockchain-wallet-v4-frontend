import React from 'react'
import styled from 'styled-components'

import IntlTelInput from 'react-intl-tel-input'
import 'react-intl-tel-input/dist/libphonenumber.js'
import 'react-intl-tel-input/dist/main.css'

const Container = styled.div`
  > div {
    width: 100%;
  }
  .iti-arrow {
    right: -8px;
  }
  input {
    width: 100%;
    height: 40px;
    font-size: 14px;
  }
`

const PhoneNumberBox = (field) => {
  const handler = (status, value, countryData, number, id) => {
    field.input.onChange(number)
  }

  return (
    <Container>
      <IntlTelInput defaultValue={field.defaultValue || ''} onPhoneNumberChange={handler} format preferredCountries={['us', 'gb']} css={['intl-tel-input', 'form-control']} utilsScript={'libphonenumber.js'} />
    </Container>
  )
}

export default PhoneNumberBox
