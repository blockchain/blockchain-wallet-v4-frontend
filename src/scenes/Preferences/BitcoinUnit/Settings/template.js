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
  width: 100%;
`
const Settings = (props) => {
  const { handleClick, unit } = props
  const units = ['BTC (1 BTC)', 'mBTC (0.001 BTC)', 'bits (0.000001 BTC)']
  console.log(`Unit is ${unit}`)
  return (
    <Wrapper>
      <Field name='unit' component={SelectBox} elements={[{ group: '', items: units.map(u => ({ text: u, value: u })) }]}
        input={{ onBlur: function () { }, onChange: handleClick, onFocus: function () { }, value: unit }} />
    </Wrapper>
  )
}

Settings.propTypes = {
  unit: PropTypes.string.isRequired
}

export default Settings
