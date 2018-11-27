import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from 'blockchain-info-components'
import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import { Row } from 'components/IdentityVerification'

const GoBackContainer = styled.div`
  position: absolute;
  top: 10px;
  cursor: pointer;
`

const Create = props => {
  const { handleSignup, oldEmail, signupError, ui, updateUI, country, onGoBack } = props

  const determineStep = () => {
    if (ui.create === 'change_email' || ui.create === 'enter_email_code') {
      return 'email'
    }
    return 'terms'
  }

  return (
    <Row>
      <GoBackContainer onClick={onGoBack}>
        <Icon
          name='left-arrow'
          size='20px'
        />
      </GoBackContainer>
      {determineStep() === 'email' && (
        <VerifyEmail oldEmail={oldEmail} updateUI={updateUI} ui={ui} />
      )}
      {determineStep() === 'terms' && (
        <AcceptTerms
          handleSignup={handleSignup}
          signupError={signupError}
          updateUI={updateUI}
          country={country}
        />
      )}
    </Row>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  smsNumber: PropTypes.string
}

export default Create
