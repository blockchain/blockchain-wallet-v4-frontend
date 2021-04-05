import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

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
    `linear-gradient(312.54deg, ${props.theme.purple} -25.42%, ${props.theme.black} 70.12%)`};
  border-radius: 8px 10px 10px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 25px 15px 25px 25px;
  width: 100%;
  z-index: 999;
`

const LeftContent = styled(Text)`
  line-height: 22px;
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
  margin-bottom: 8px;

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
  background-color: ${props => props.theme['grey800']};
  border: 1px solid ${props => props.theme['grey800']};
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
const ExchangeLogo = styled(Image)`
  margin-bottom: 5px;
`

const LinkToExchangeAccountNotAsked = ({
  close,
  isEmailVerified,
  onConnectStart,
  onResendEmail
}) => {
  return (
    <Modal size='large' data-e2e='infoModalLinkToExchangeAccountNotAsked'>
      <ModalHeaderStyled onClose={close} />
      <ModalBodyStyled>
        <ContentWrapper>
          <LeftColumn>
            <div>
              <ExchangeLogo
                name='blockchain-logo'
                height='24px'
                width='240px'
              />
              <LeftContent color='white' size='18px' weight={400}>
                <FormattedMessage
                  id='modals.onboarding.linktoexchangeaccount.na.subtitle-1'
                  defaultMessage="There's a new way to trade. Link your Wallet for instant access. "
                />
              </LeftContent>
            </div>
            <LeftColumnPoints>
              <PointRow>
                <Image name='coins' width='24px' height='24px' />
                <Text color='white' size='15px' weight={400}>
                  <FormattedMessage
                    id='modals.onboarding.linktoexchangeaccount.na.left.point1-2'
                    defaultMessage='Access More Cryptos'
                  />
                </Text>
              </PointRow>
              <PointRow>
                <Image name='money' width='26px' />
                <Text color='white' size='15px' weight={400}>
                  <FormattedMessage
                    id='modals.onboarding.linktoexchangeaccount.na.left.point2-1'
                    defaultMessage='Deposit & Withdraw Euros/Dollars'
                  />
                </Text>
              </PointRow>
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
                    id='modals.onboarding.linktoexchangeaccount.na.left.point3-1'
                    defaultMessage='Lightning Fast Trading'
                  />
                </Text>
              </PointRow>
              <PointRow>
                <Icon name='users' color='white' size='23px' />
                <Text color='white' size='15px' weight={400}>
                  <FormattedMessage
                    id='modals.onboarding.linktoexchangeaccount.na.left.point4-1'
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
                        id='modals.onboarding.linktoexchangeaccount.na.right.totitle-1'
                        defaultMessage='The Exchange will be able to:'
                      />
                    </Text>
                  </RightPointRow>
                  <RightPointRow>
                    <Circle />
                    <Text color='grey800' size='14px' weight={500}>
                      <FormattedMessage
                        id='modals.onboarding.linktoexchangeaccount.na.right.topoint'
                        defaultMessage='Share your Gold or Silver Level status'
                      />
                    </Text>
                  </RightPointRow>
                  <RightPointRow>
                    <Circle />
                    <Text color='grey800' size='14px' weight={500}>
                      <FormattedMessage
                        id='modals.onboarding.linktoexchangeaccount.na.right.topoint2-2'
                        defaultMessage='Sync addresses with your Wallet so you can securely sweep crypto between accounts'
                      />
                    </Text>
                  </RightPointRow>
                </RightColumnGroup>
                <RightColumnGroup>
                  <RightPointRow>
                    <Text size='16px' weight={500} color='red500'>
                      <FormattedMessage
                        id='modals.onboarding.linktoexchangeaccount.na.right.nottitle-1'
                        defaultMessage='The Exchange will not be able to:'
                      />
                    </Text>
                  </RightPointRow>
                  <RightPointRow>
                    <Circle />
                    <Text color='grey800' size='14px' weight={500}>
                      <FormattedMessage
                        id='modals.onboarding.linktoexchangeaccount.na.right.notpoint1-3'
                        defaultMessage='Access the crypto in your wallet, access your keys, or view your password'
                      />
                    </Text>
                  </RightPointRow>
                </RightColumnGroup>
              </div>
              <ConnectNowButton nature='purple' onClick={onConnectStart}>
                <Text color='white' size='16px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linktoexchangeaccount.na.connectnow'
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
                    id='modals.onboarding.linktoexchangeaccount.na.right.verifyemailrequired-1'
                    defaultMessage='A verified email address is required to connect your wallet to the Exchange.'
                  />
                </Text>
                <Text size='15px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linktoexchangeaccount.na.right.checkemail'
                    defaultMessage='Please verify your email address to continue with the signup process.'
                  />
                </Text>
              </EmailRequiredContent>
              <ConnectNowButton nature='purple' onClick={onResendEmail}>
                <Text color='white' size='16px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linktoexchangeaccount.na.resendemail'
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

export default LinkToExchangeAccountNotAsked
