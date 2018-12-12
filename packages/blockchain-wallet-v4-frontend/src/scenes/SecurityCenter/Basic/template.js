import React from 'react'
import styled from 'styled-components'
import { Icon } from 'blockchain-info-components'

import EmailAddress from './EmailAddress'
import TwoStepVerification from './TwoStepVerification'
import WalletRecoveryPhrase from './WalletRecoveryPhrase'

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  & > * {
    margin-top: 20px;
  }
`
const IconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`

const SecurityCenter = props => {
  const { handleEnable, enabling, changeEmail, onClose } = props

  const renderSteps = () => {
    if (enabling === 'email') {
      return (
        <BodyContainer>
          <EmailAddress alone={1} goBackOnSuccess={onClose} />
        </BodyContainer>
      )
    }
    if (enabling === '2fa') {
      return (
        <BodyContainer>
          <TwoStepVerification alone={1} goBackOnSuccess={onClose} />
        </BodyContainer>
      )
    }
    if (enabling === 'recovery') {
      return (
        <BodyContainer>
          <WalletRecoveryPhrase alone={1} goBackOnSuccess={onClose} />
        </BodyContainer>
      )
    }
    return (
      <BodyContainer>
        <EmailAddress
          handleEnable={() => handleEnable('email')}
          goBackOnSuccess={onClose}
          changeEmail={changeEmail}
        />
        <TwoStepVerification
          handleEnable={() => handleEnable('2fa')}
          goBackOnSuccess={onClose}
        />
        <WalletRecoveryPhrase
          handleEnable={() => handleEnable('recovery')}
          goBackOnSuccess={onClose}
        />
      </BodyContainer>
    )
  }

  return (
    <React.Fragment>
      {enabling && (
        <IconContainer>
          <Icon
            name='close'
            size='20px'
            weight={300}
            color='gray-5'
            cursor
            onClick={onClose}
          />
        </IconContainer>
      )}
      {renderSteps()}
    </React.Fragment>
  )
}

export default SecurityCenter
