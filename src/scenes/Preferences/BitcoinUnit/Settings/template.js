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
  const { handleClick, unit } = props
  const units = ['BTC (1 BTC)', 'mBTC (0.001 BTC)', 'bits (0.000001 BTC)']
  return (
    <Wrapper>
      <Field name='unit' component={SelectBox} elements={[{ group: '', items: units.map((u, i) => ({ text: u, value: i })) }]}
        input={{ onBlur: function () { }, onChange: handleClick, onFocus: function () { }, value: 1 }}
        label={unit} />
    </Wrapper>
  )
}

Settings.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired
}

Settings.defaultProps = {
  toggled: false
}

export default Settings
