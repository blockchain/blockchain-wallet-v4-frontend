import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form as ReduxForm } from 'redux-form'

const BaseForm = styled(ReduxForm)`
  width: 100%;
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
