import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form as ReduxForm } from 'redux-form'

const BaseForm = styled(ReduxForm)`
  width: 100%;
`

const Form = props => {
  const { children, handleSubmit } = props

  return (
    <BaseForm onSubmit={handleSubmit}>
      {children}
    </BaseForm>
  )
}

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default Form
