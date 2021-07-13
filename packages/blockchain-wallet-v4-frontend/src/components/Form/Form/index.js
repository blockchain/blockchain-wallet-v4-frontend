import React from 'react'
import { Form as ReduxForm } from 'redux-form'
import styled from 'styled-components'

const BaseForm = styled(ReduxForm)`
  width: 100%;
`

const Form = props => {
  const { children, className, onSubmit } = props

  return (
    <BaseForm className={className} onSubmit={onSubmit}>
      {children}
    </BaseForm>
  )
}

export default Form
