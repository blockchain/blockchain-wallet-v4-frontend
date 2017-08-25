import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { SelectBox } from 'components/Form'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
`
const Settings = (props) => {
  const { handleClick, currency } = props
  const currencies = ['U.S. Dollar', 'Euro', 'Icelandic Krona', 'Hong Kong Dollar', 'New Taiwan Dollar', 'Swiss Franc', 'Danish Krone', 'Chilean Peso']
  return (
    <Wrapper>
      <Field name='currency' component={SelectBox} elements={[{ group: '', items: currencies.map((x, i) => ({ text: x, value: i })) }]}
        input={{ onBlur: function () { }, onChange: handleClick, onFocus: function () { }, value: 0 }}
        label={currency} />
    </Wrapper>
  )
}

Settings.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired
}

Settings.defaultProps = {
  toggled: false
}

export default Settings
