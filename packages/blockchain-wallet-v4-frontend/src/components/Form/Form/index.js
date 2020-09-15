import { Form as ReduxForm } from 'redux-form'
import React from 'react'
import styled from 'styled-components'

const BaseForm = styled(ReduxForm)`
  width: 100%;
`

const Form = props => {
  const { children, onSubmit, className } = props

  return (
    <BaseForm className={className} onSubmit={onSubmit}>
      {children}
    </BaseForm>
  )
}

export default Form
