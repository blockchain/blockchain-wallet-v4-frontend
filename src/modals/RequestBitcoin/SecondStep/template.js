import React from 'react'
import PropTypes from 'prop-types'

import { SecondaryButton } from 'components/generic/Button'
import { Form } from 'components/generic/Form'

const SecondStep = (props) => {
  const { previous } = props

  return (
    <Form>
      <SecondaryButton onClick={previous}>BACK</SecondaryButton>
    </Form>
  )
}

SecondStep.defaultProps = {
  show: false
}

SecondStep.propTypes = {
  show: PropTypes.bool.isRequired
}

export default SecondStep
