import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Remote } from '@core'
import { Text } from 'blockchain-info-components'

import 'react-intl-tel-input/dist/main.css'

const IntlTelInput = React.lazy(() => import('react-intl-tel-input'))

const Container = styled.div`
  position: relative;
  > :first-child {
    width: 100%;
  }

  input {
    width: 100%;
    height: 48px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.grey100};
    color: ${(props) => props.theme.grey800};
    ::-webkit-input-placeholder {
      opacity: 0.35;
    }
    ::-moz-placeholder {
      opacity: 0.35;
    }
  }
  * {
    outline: none;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
    font-size: 14px;
  }
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${(props) => (props.errorBottom ? '48px' : '-20px')};
  right: 0;
`

class PhoneNumberBox extends React.Component {
  componentDidMount() {
    if (this.tel) {
      this.tel.onfocus = this.props.input.onFocus
    }
  }

  changeHandler = (status, value, countryData, number) => {
    this.props.input.onChange(number)
  }

  blurHandler = (status, value, countryData, number) => {
    this.props.input.onBlur(number)
  }

  bindTel = (ref) => {
    if (ref?.tel) this.tel = ref.tel
  }

  render() {
    const field = this.props
    const {
      countryCode: countryCodeField,
      defaultValue,
      disabled,
      errorBottom,
      input,
      meta
    } = field
    const { error, touched, warning } = meta
    const upperCountryCode = Remote.is(countryCodeField)
      ? countryCodeField.getOrElse('US')
      : countryCodeField || 'US'
    const countryCode = upperCountryCode?.toLowerCase()

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
        />
        {touched && error && (
          <Error size='12px' weight={500} color='error' errorBottom={errorBottom}>
            {error}
          </Error>
        )}
        {touched && !error && warning && (
          <Error size='12px' weight={500} color='error' errorBottom={errorBottom}>
            {warning}
          </Error>
        )}
      </Container>
    )
  }
}

PhoneNumberBox.propTypes = {
  countryCode: PropTypes.string
}

export default PhoneNumberBox
