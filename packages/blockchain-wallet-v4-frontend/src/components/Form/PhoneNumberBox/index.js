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
  > :first-child {
    width: 100%;
  }
  .iti-arrow {
    right: -8px;
  }
  input {
    width: 100%;
    height: 40px;
    font-size: 14px;
    color: ${props => props.theme['gray-5']};
    ::-webkit-input-placeholder {
      opacity: 0.35;
    }
    ::-moz-placeholder {
      opacity: 0.35;
    }
  }
  * {
    outline: none;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 14px;
  }
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${props => (props.errorBottom ? '40px' : '-20px')};
  right: 0;
`

class PhoneNumberBox extends React.Component {
  componentDidMount () {
    if (this.tel) {
      this.tel.onfocus = this.props.input.onFocus
    }
  }

  changeHandler = (status, value, countryData, number, id) => {
    this.props.input.onChange(number)
  }

  blurHandler = (status, value, countryData, number, id) => {
    this.props.input.onBlur(number)
  }

  bindTel = ref => {
    const tel = prop('tel', ref)
    if (tel) this.tel = tel
  }

  render () {
    const field = this.props
    const { input, defaultValue, meta, errorBottom, disabled } = field
    const { touched, error, warning } = meta
    const countryCodeField = prop('countryCode', field)
    const upperCountryCode = Remote.is(countryCodeField)
      ? countryCodeField.getOrElse('US')
      : countryCodeField || 'US'
    const countryCode = upperCountryCode && toLower(upperCountryCode)

    return (
      <Container>
        <IntlTelInput
          ref={this.bindTel}
          disabled={disabled}
          defaultValue={defaultValue || input.value}
          onPhoneNumberChange={this.changeHandler}
          onPhoneNumberBlur={this.blurHandler}
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
}

PhoneNumberBox.propTypes = {
  countryCode: PropTypes.object.isRequired
}

export default PhoneNumberBox
