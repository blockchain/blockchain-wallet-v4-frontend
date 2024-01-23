import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { isMobile } from 'services/styles'

import { SubviewProps } from '../../types'
import { Card, CardTitle, CardWrapper } from '..'
import QRsModal, { QRModalType } from '../SignupForm/QRsModal'
import SofiSignupForm from '../SofiSignupForm'

const Bottom = styled.div`
  margin: 2rem 0 0;
  > a {
    margin: 0 8px;
  }
`

const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0 8px 16px 0;
`

const PaddingWrapper = styled.div`
  padding: ${isMobile() ? '1.5rem 1.5rem 0' : '2rem 2rem 0'};
`

const SofiSignupCard = (props: InjectedFormProps<{}> & SubviewProps) => {
  const { routerActions } = props

  const [showModal, setShowModal] = useState<QRModalType | null>(null)
  const closeModal = () => setShowModal(null)

  return (
    <>
      {showModal && <QRsModal platform={showModal} onClose={closeModal} />}
      <CardWrapper hideMargin>
        <Card>
          <PaddingWrapper>
            <BackArrow onClick={() => routerActions.push('/sofi')}>
              <Icon
                data-e2e='signupBack'
                name='arrow-back'
                size='24px'
                color='blue600'
                style={{ marginRight: '8px' }}
                role='button'
              />

              <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
                <FormattedMessage id='copy.back' defaultMessage='Back' />
              </Text>
            </BackArrow>
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

            <SofiSignupForm {...props} />
          </PaddingWrapper>
          <Bottom />
        </Card>
      </CardWrapper>
    </>
  )
}

export default SofiSignupCard
