import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { getEmail, getLastGuid } from 'data/cache/selectors'

import QRsModal, { QRModalType } from '../Signup/components/SignupForm/QRsModal'

const ContentWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const HeaderConainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .email-guid {
    display: flex;
    align-items: center;
  }
`

const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const IconWrapper = styled.div`
  display: flex;
  background: ${(props) => props.theme.blue600};
  height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`

const ButtonsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  width: 100%;
`
const Divider = styled.div`
  min-width: 8px;
`

type Props = {
  history: RouteComponentProps['history']
}

const VerifyEmail: React.FC<Props> = ({ history }) => {
  const email = useSelector(getEmail)
  const guid = useSelector(getLastGuid)

  const firstPartGuid = guid?.slice(0, 4)
  const lastPartGuid = guid?.slice(-4)

  const [showModal, setShowModal] = useState<QRModalType | null>()

  return (
    <>
      <Wrapper>
        <HeaderConainer>
          <BackArrow onClick={() => history.push('/login')}>
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
          <div className='email-guid'>
            <Text
              color='blue600'
              size='12px'
              weight={600}
              lineHeight='1.5'
              style={{ marginRight: '2px' }}
            >
              {email}
            </Text>
            {guid && (
              <Text size='12px' weight={500} color='grey400'>
                ({firstPartGuid}...{lastPartGuid})
              </Text>
            )}
          </div>
        </HeaderConainer>
        <ContentWrapper>
          <IconWrapper>
            <Icon color='white' name='mobile' size='24px' />
          </IconWrapper>
          <Text
            size='20px'
            weight={600}
            color='black'
            style={{ marginTop: '8px' }}
            lineHeight='30px'
          >
            Continue on your phone
          </Text>
          <Text
            color='grey900'
            style={{ marginTop: '0.5rem' }}
            size='16px'
            weight={500}
            lineHeight='1.5rem'
          >
            At this moment, the Blockchain.com Wallet is only available on mobile for your region.
          </Text>
          <Text
            color='grey900'
            style={{ marginTop: '1rem' }}
            size='16px'
            weight={500}
            lineHeight='1.5rem'
          >
            To keep enjoying your Blockchain.com experience, download the app.
          </Text>
        </ContentWrapper>
        <ButtonsContainer>
          <Button
            data-e2e='download-button-ios'
            nature='dark'
            height='3rem'
            fullwidth
            onClick={() => setShowModal('iOS')}
          >
            Download for iOS
          </Button>
          <Divider />
          <Button
            data-e2e='download-button-android'
            nature='dark'
            height='3rem'
            fullwidth
            onClick={() => setShowModal('Android')}
          >
            Download for Android
          </Button>
        </ButtonsContainer>
      </Wrapper>
      {!!showModal && <QRsModal onClose={() => setShowModal(null)} platform={showModal} />}
    </>
  )
}

export default VerifyEmail
