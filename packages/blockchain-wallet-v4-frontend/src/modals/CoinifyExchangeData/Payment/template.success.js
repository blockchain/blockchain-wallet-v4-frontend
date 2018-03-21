import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

const Payment = (props) => {
  const { ui, value, getAccounts, toConfirmStep } = props
  const { profile, limits, level, mediums } = value

  return (
    <div>
      <h3>Payment Medium Step</h3>
      <div>
        <p>Bank</p>
        {mediums.bank.name}
        <p>minimumInAmounts in EUR {mediums.bank.minimumInAmounts['EUR']}</p>
      </div>
      <div>
        <p>Card</p>
        {mediums.card.name}
        <p>minimumInAmounts in EUR {mediums.card.minimumInAmounts['EUR']}</p>
      </div>
      <button onClick={toConfirmStep}>To Confirm Step</button>
    </div>
  )
}

Payment.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  smsNumber: PropTypes.string
}

export default Payment
