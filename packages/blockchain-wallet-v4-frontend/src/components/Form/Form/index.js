import { Form as ReduxForm } from 'redux-form'
import PropTypes from 'prop-types'
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

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default Form
