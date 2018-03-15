import React from 'react'
import styled from 'styled-components'
import { Form as ReduxForm } from 'redux-form'

// eventually remove props.override
const BaseForm = styled(ReduxForm)`
  width: 100%;

  & > * {
    margin: ${props => props.override ? '' : '7px 0'};
  }
`

const Form = props => {
  const { children, ...rest } = props

  return (
    <BaseForm {...rest}>
      {children}
    </BaseForm>
  )
}

export default Form
