import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

const Payment = (props) => {
  const { ui, value, mediums } = props
  const { profile, limits, level } = value
  console.log('payment template', props)

  return (
    <div>
      <h3>Payment Medium Step</h3>
    </div>
  )
}

Payment.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  smsNumber: PropTypes.string
}

export default Payment
