import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { SelectBoxBitcoinUnit } from 'components/Form'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
`
const Settings = (props) => {
  const { handleClick } = props

  return (
    <Wrapper>
      <Field name='unit' component={SelectBoxBitcoinUnit} callback={handleClick} />
    </Wrapper>
  )
}

Settings.propTypes = {
  unit: PropTypes.string.isRequired
}

export default Settings
