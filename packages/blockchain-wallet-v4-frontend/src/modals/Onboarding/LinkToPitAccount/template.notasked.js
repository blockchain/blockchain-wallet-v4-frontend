import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const ModalHeaderStyled = styled(ModalHeader)`
  background: white;
  border-radius: 8px 8px 0 0;
  position: absolute;
  border: none;
  z-index: 99;
  > span {
    &:hover {
      cursor: pointer;
    }
  }
`
const ModalBodyStyled = styled(ModalBody)`
  padding: 0;
  background: white;
  border-radius: 8px;
`
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 375px;
  width: 100%;
  border-radius: 8px;
`
const LeftColumn = styled.div`
  background: ${props =>
    `linear-gradient(312.54deg, ${props.theme.purple} -25.42%, ${
      props.theme.black
    } 70.12%)`};
  border-radius: 8px 10px 10px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 25px 15px 25px 25px;
  width: 100%;
  z-index: 999;
`
const LeftColumnPoints = styled.div`
  margin-top: 20px;
`
const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding: 10px 25px;
  width: 100%;
  background: white;
  border-radius: 0 8px 8px 0;
  z-index: 999;
`
const PointRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  padding: 12px 10px;

  & > :first-child {
    margin-right: 15px;
  }
`
const RightColumnGroup = styled.div`
  margin-bottom: 20px;
`
const RightPointRow = styled(PointRow)`
  align-items: flex-start;
  padding: 6px 10px;
  max-width: 220px;
`
const Circle = styled.div`
  height: 6px;
  width: 6px;
  min-width: 6px;
  display: block;
  background-color: ${props => props.theme['gray-6']};
  border: 1px solid ${props => props.theme['gray-6']};
  border-radius: 6px;
  margin-top: 5px;
`
const ConnectNowButton = styled(Button)`
  height: 56px;
  width: 210px;
  max-width: 210px;
  margin: 8px 0 12px 0;
`
const EmailRequiredContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  & > :first-child {
    margin-bottom: 20px;
  }
  & > div {
    margin-bottom: 12px;
  }
`
const PitLogo = styled(Image)`
  margin-bottom: 5px;
`

const LinkToPitNotAsked = ({
  close,
  isEmailVerified,
  onConnectStart,
  onResendEmail
}) => {
  return (
    <Modal size='large'>
      <ModalHeaderStyled onClose={close} />
      <ModalBodyStyled>
        <ContentWrapper>
          <LeftColumn>
            <div>
              <PitLogo name='the-pit-word' height='50px' />
              <Text color='white' size='18px' weight={400}>
                <FormattedMessage
                  id='modals.onboarding.linktopitaccount.na.subtitle-1'
                  defaultMessage="There's a new way to trade. Link your Wallet for instant access. "
                />
              </Text>
            </div>
            <LeftColumnPoints>
              <PointRow>
                <Icon
                  name='lightning-bolt'
                  color='white'
                  size='26px'
                  style={{ marginLeft: '7px' }}
                />
                <Text
                  color='white'
                  size='15px'
                  weight={400}
                  style={{ marginLeft: '3px' }}
                >
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.na.left.point1-1'
                    defaultMessage='Lightning Fast Trading'
                  />
                </Text>
              </PointRow>
              <PointRow>
                <Icon name='shield-half' color='white' size='27px' />
                <Text color='white' size='15px' weight={400}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.na.left.point3-1'
                    defaultMessage='Liquid & Reliable'
                  />
                </Text>
              </PointRow>
              <PointRow>
                <Icon name='usd-square' color='white' size='32px' />
                <Text color='white' size='15px' weight={400}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.na.left.point4'
                    defaultMessage='Extra Low Fees'
                  />
                </Text>
              </PointRow>
              <PointRow>
                <Icon name='users' color='white' size='23px' />
                <Text color='white' size='15px' weight={400}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.na.left.point2-1'
                    defaultMessage='Built by the Pros'
                  />
                </Text>
              </PointRow>
            </LeftColumnPoints>
          </LeftColumn>
          {isEmailVerified ? (
            <RightColumn>
              <div>
                <RightColumnGroup>
                  <RightPointRow>
                    <Text size='16px' weight={500} color='green400'>
                      <FormattedMessage
                        id='modals.onboarding.linktopitaccount.na.right.totitle'
                        defaultMessage='The PIT will be able to:'
                      />
                    </Text>
                  </RightPointRow>
                  <RightPointRow>
                    <Circle />
                    <Text color='grey800' size='14px' weight={500}>
                      <FormattedMessage
                        id='modals.onboarding.linktopitaccount.na.right.topoint'
                        defaultMessage='Share your Gold or Silver Level status'
                      />
                    </Text>
                  </RightPointRow>
                  <RightPointRow>
                    <Circle />
                    <Text color='grey800' size='14px' weight={500}>
                      <FormattedMessage
                        id='modals.onboarding.linktopitaccount.na.right.topoint2-1'
                        defaultMessage="Exchange crypto addresses so you don't have to copy and paste"
                      />
                    </Text>
                  </RightPointRow>
                </RightColumnGroup>
                <RightColumnGroup>
                  <RightPointRow>
                    <Text size='16px' weight={500} color='red500'>
                      <FormattedMessage
                        id='modals.onboarding.linktopitaccount.na.right.nottitle'
                        defaultMessage='The PIT will not be able to:'
                      />
                    </Text>
                  </RightPointRow>
                  <RightPointRow>
                    <Circle />
                    <Text color='grey800' size='14px' weight={500}>
                      <FormattedMessage
                        id='modals.onboarding.linktopitaccount.na.right.notpoint1-1'
                        defaultMessage='View your wallet password'
                      />
                    </Text>
                  </RightPointRow>
                </RightColumnGroup>
              </div>
              <ConnectNowButton nature='purple' onClick={onConnectStart}>
                <Text color='white' size='16px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.na.connectnow'
                    defaultMessage='Connect Now'
                  />
                </Text>
              </ConnectNowButton>
            </RightColumn>
          ) : (
            <RightColumn>
              <EmailRequiredContent>
                <Icon name='alert-filled' color='error' size='62px' />
                <Text size='15px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.na.right.verifyemailrequired'
                    defaultMessage='A verified email address is required to connect your wallet to The PIT.'
                  />
                </Text>
                <Text size='15px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.na.right.checkemail'
                    defaultMessage='Please verify your email address to continue with the signup process.'
                  />
                </Text>
              </EmailRequiredContent>
              <ConnectNowButton nature='purple' onClick={onResendEmail}>
                <Text color='white' size='16px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.na.resendemail'
                    defaultMessage='Resend Email'
                  />
                </Text>
              </ConnectNowButton>
            </RightColumn>
          )}
        </ContentWrapper>
      </ModalBodyStyled>
    </Modal>
  )
}

export default LinkToPitNotAsked
