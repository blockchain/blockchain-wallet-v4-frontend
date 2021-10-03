import React from 'react'
import PropTypes from 'prop-types'
import { prop, toLower } from 'ramda'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'

import 'react-intl-tel-input/dist/libphonenumber.js'
import 'react-intl-tel-input/dist/main.css'

const IntlTelInput = React.lazy(() => import('react-intl-tel-input'))

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
    height: 48px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.grey100};
    color: ${props => props.theme['grey800']};
    ::-webkit-input-placeholder {
      opacity: 0.35;
    }
    ::-moz-placeholder {
      opacity: 0.35;
    }
  }
  * {
    outline: none;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
    font-size: 14px;
  }
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${props => (props.errorBottom ? '48px' : '-20px')};
  right: 0;
`

class PhoneNumberBox extends React.Component {
  componentDidMount() {
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

  render() {
    const field = this.props
    const { defaultValue, disabled, errorBottom, input, meta } = field
    const { error, touched, warning } = meta
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
        {touched && error && (
          <Error
            size='12px'
            weight={500}
            color='error'
            errorBottom={errorBottom}
          >
            {error}
          </Error>
        )}
        {touched && !error && warning && (
          <Error
            size='12px'
            weight={500}
            color='error'
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
