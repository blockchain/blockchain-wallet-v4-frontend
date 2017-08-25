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
  const currencies = ['U.S. Dollar', 'Euro', 'Swiss Franc']
  return (
    <Wrapper>
      <Field name='currency' component={SelectBox} elements={[{ group: '', items: currencies.map(c => ({text: c, value: c})) }]}
        input={{ onBlur: function () { }, onChange: handleClick, onFocus: function () { }, value: currency }}
        label={currency} />
    </Wrapper>
  )
}

Settings.propTypes = {
  currency: PropTypes.string.isRequired
}

export default Settings
