import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { text } from 'express'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Badge, Button, HeartbeatLoader, Text, TextGroup } from 'blockchain-info-components'
import { PlatformTypes } from 'data/types'
import { isMobile, media } from 'services/styles'

import { SubviewProps } from '../../types'
import { Card, CardInfo, CardTitle, CardWrapper, InfoItem, InfoTitle, PaddingWrapper } from '..'
import QRsModal, { QRModalType } from '../SignupForm/QRsModal'
import SofiSignupForm from '../SofiSignupForm'

const Bottom = styled.div`
  margin: 2rem 0 0;
  > a {
    margin: 0 8px;
  }
`

const LinkAccountSpacer = styled.div`
  height: 1rem;
`

const SofiSignupCard = (props: InjectedFormProps<{}> & SubviewProps) => {
  const {
    isFormSubmitting,
    onSignupSubmit,
    showForm,

    toggleSignupFormVisibility
  } = props
  const buttonSubmit = showForm ? onSignupSubmit : toggleSignupFormVisibility
  const showOnlySignup = showForm

  const [showModal, setShowModal] = useState<QRModalType | null>(null)
  const closeModal = () => setShowModal(null)

  return (
    <>
      {showModal && <QRsModal platform={showModal} onClose={closeModal} />}
      <CardWrapper hideMargin>
        <Card>
          <PaddingWrapper>
            <CardTitle>
              <Text
                size='24px'
                color='textBlack'
                weight={600}
                lineHeight='1.5'
                style={{ textAlign: 'center' }}
              >
                <FormattedMessage
                  id='scenes.signup.sofi.header'
                  defaultMessage='Let’s get your account setup.'
                />
              </Text>
              <Text
                color='textBlack'
                size='16px'
                weight={500}
                lineHeight='1.5'
                style={{ marginTop: '8px', textAlign: 'center' }}
              >
                <FormattedMessage
                  id='scenes.signup.sofi.subtitle'
                  defaultMessage='Create a password for your Blockchain.com account. Next, we’ll migrate your crypto from SoFi.'
                />
              </Text>
            </CardTitle>

            <SofiSignupForm {...props} setShowModal={setShowModal} />
          </PaddingWrapper>
          <Bottom />
        </Card>
      </CardWrapper>
    </>
  )
}

export default SofiSignupCard
