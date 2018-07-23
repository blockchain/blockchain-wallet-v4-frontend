import React from 'react'
import styled from 'styled-components'
import { prop, toLower } from 'ramda'
import PropTypes from 'prop-types'

import IntlTelInput from 'react-intl-tel-input'
import 'react-intl-tel-input/dist/libphonenumber.js'
import 'react-intl-tel-input/dist/main.css'
import { Text } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4'

const Container = styled.div`
  position: relative;
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
    outline: none;
    color: ${props => props.theme['gray-5']};
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
  }
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${props => (props.errorBottom ? '40px' : '-20px')};
  right: 0;
`

const PhoneNumberBox = field => {
  const { input, defaultValue, meta, errorBottom, disabled } = field
  const { touched, error, warning } = meta
  const changeHandler = (status, value, countryData, number, id) => {
    input.onChange(number)
  }
  const blurHandler = (status, value, countryData, number, id) => {
    input.onBlur(number)
  }

  const countryCodeField = prop('countryCode', field)
  const upperCountryCode = Remote.is(countryCodeField)
    ? countryCodeField.getOrElse('US')
    : countryCodeField || 'US'
  const countryCode = upperCountryCode && toLower(upperCountryCode)

  return (
    <Container>
      <IntlTelInput
        disabled={disabled}
        defaultValue={defaultValue || input.value}
        onPhoneNumberChange={changeHandler}
        onPhoneNumberBlur={blurHandler}
        format
        defaultCountry={countryCode}
        preferredCountries={['us', 'gb']}
        css={['intl-tel-input', 'form-control']}
        utilsScript={'libphonenumber.js'}
        placeholder='555-555-5555'
      />
      {touched &&
        error && (
          <Error
            size='12px'
            weight={300}
            color='error'
            errorBottom={errorBottom}
          >
            {error}
          </Error>
        )}
      {touched &&
        !error &&
        warning && (
          <Error
            size='12px'
            weight={300}
            color='sent'
            errorBottom={errorBottom}
          >
            {warning}
          </Error>
        )}
    </Container>
  )
}

PhoneNumberBox.propTypes = {
  countryCode: PropTypes.object.isRequired
}

export default PhoneNumberBox
