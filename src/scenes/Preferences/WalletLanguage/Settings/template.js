import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { SelectBoxLanguages } from 'components/Form'

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
      <Field name='language' component={SelectBoxLanguages} callback={handleClick} />
    </Wrapper>
  )
}

export default Settings
