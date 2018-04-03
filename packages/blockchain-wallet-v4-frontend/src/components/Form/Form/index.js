import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Form as ReduxForm } from 'redux-form'

const BaseForm = styled.form`
  width: 100%;

  & > * {
    margin: ${props => props.override ? '' : '7px 0'};
  }
`

const handleSubmit = (e, callback) => {
  e.preventDefault()
  callback()
}

const handleKeyDown = (e, callback) => {
  if (e.key === 'Enter' && e.shiftKey === false) {
    e.preventDefault()
    callback()
  }
}

const Form = props => {
  const { children, onSubmit, ...rest } = props

  return (
    <BaseForm onSubmit={e => handleSubmit(e, onSubmit)} onKeyDown={e => handleKeyDown(e, onSubmit)} {...rest}>
      {children}
    </BaseForm>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default Form
