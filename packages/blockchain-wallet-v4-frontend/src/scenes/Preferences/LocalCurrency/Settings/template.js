import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxCurrency } from 'components/Form'

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
      <Field name='currency' component={SelectBoxCurrency} callback={handleClick} />
    </Wrapper>
  )
}

export default reduxForm({ form: 'settingCurrency' })(Settings)
