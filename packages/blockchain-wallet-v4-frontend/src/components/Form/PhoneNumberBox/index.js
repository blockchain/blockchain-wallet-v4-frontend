import React from 'react'
import styled from 'styled-components'
import { prop, toLower } from 'ramda'
import { PropTypes } from 'prop-types'

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
    ::-webkit-input-placeholder {
      opacity: 0.35;
    }
    ::-moz-placeholder {
      opacity: 0.35;
    }
  }
  * {
    color: ${props => props.theme['gray-5']};
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
  }
`

const PhoneNumberBox = field => {
  const handler = (status, value, countryData, number, id) => {
    field.input.onChange(number)
  }

  const upperCountryCode = prop('countryCode', field).getOrElse('US')
  const countryCode = upperCountryCode && toLower(upperCountryCode)

  return (
    <Container>
      <IntlTelInput
        defaultValue={field.defaultValue || ''}
        onPhoneNumberChange={handler}
        format
        defaultCountry={countryCode}
        preferredCountries={['us', 'gb']}
        css={['intl-tel-input', 'form-control']}
        utilsScript={'libphonenumber.js'}
        placeholder="555-555-5555"
      />
    </Container>
  )
}

PhoneNumberBox.propTypes = {
  countryCode: PropTypes.object.isRequired
}

export default PhoneNumberBox
