import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Icon,
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
  min-height: 350px;
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
  padding: 25px;
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
  padding: 6px 10px;

  & > :first-child {
    margin-right: 15px;
  }
`
const ConnectNowButton = styled(Button)`
  height: 56px;
  width: 170px;
  max-width: 170px;
`

const LinkToPitAccount = ({ close }) => {
  return (
    <Modal size='large'>
      <ModalHeaderStyled onClose={close} />
      <ModalBodyStyled>
        <ContentWrapper>
          <LeftColumn>
            <PointRow>
              <Icon name='the-pit' color='white' size='32px' />
              <Text color='white' size='36px' weight={800}>
                <FormattedMessage
                  id='modals.onboarding.linktopitaccount.title'
                  defaultMessage='The Pit'
                />
              </Text>
            </PointRow>
            <Text color='white' size='18px' weight={400}>
              <FormattedMessage
                id='modals.onboarding.linktopitaccount.subtitle'
                defaultMessage='The only Exchange that connects to your Wallet.'
              />
            </Text>
            <LeftColumnPoints>
              <PointRow>
                <Icon name='alert-filled' color='white' size='32px' />
                <Text color='white' size='15px' weight={400}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.left.point1'
                    defaultMessage='Lightning Fast Trades'
                  />
                </Text>
              </PointRow>
              <PointRow>
                <Icon name='alert-filled' color='white' size='32px' />
                <Text color='white' size='15px' weight={400}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.left.point2'
                    defaultMessage='Liquid & Reliable'
                  />
                </Text>
              </PointRow>
              <PointRow>
                <Icon name='alert-filled' color='white' size='32px' />
                <Text color='white' size='15px' weight={400}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.left.point3'
                    defaultMessage='Built by Blockchain.com'
                  />
                </Text>
              </PointRow>
              <PointRow>
                <Icon name='alert-filled' color='white' size='32px' />
                <Text color='white' size='15px' weight={400}>
                  <FormattedMessage
                    id='modals.onboarding.linktopitaccount.left.point4'
                    defaultMessage='Low Fees'
                  />
                </Text>
              </PointRow>
            </LeftColumnPoints>
          </LeftColumn>
          <RightColumn>
            <div>
              <Text size='16px' weight={300}>
                <FormattedMessage
                  id='modals.onboarding.linktopitaccount.right.totitle'
                  defaultMessage='The Pit will be able to:'
                />
              </Text>
              <Text size='16px' weight={300}>
                <FormattedMessage
                  id='modals.onboarding.linktopitaccount.right.topoint1'
                  defaultMessage='Share your Gold & Silver Level status'
                />
              </Text>
              <Text size='16px' weight={300}>
                <FormattedMessage
                  id='modals.onboarding.linktopitaccount.right.topoint2'
                  defaultMessage="Exchange crypto addresses so you don't have to copy and paste"
                />
              </Text>
              <Text size='16px' weight={300}>
                <FormattedMessage
                  id='modals.onboarding.linktopitaccount.right.nottitle'
                  defaultMessage='The Pit will not be able to:'
                />
              </Text>
              <Text size='16px' weight={300}>
                <FormattedMessage
                  id='modals.onboarding.linktopitaccount.right.notpoint1'
                  defaultMessage='View you wallet password'
                />
              </Text>
            </div>
            <ConnectNowButton nature='purple' onClick={close}>
              <Text color='white' size='16px' weight={500}>
                <FormattedMessage
                  id='modals.onboarding.linktopitaccount.connectnow'
                  defaultMessage='Connect Now'
                />
              </Text>
            </ConnectNowButton>
          </RightColumn>
        </ContentWrapper>
      </ModalBodyStyled>
    </Modal>
  )
}

export default LinkToPitAccount
