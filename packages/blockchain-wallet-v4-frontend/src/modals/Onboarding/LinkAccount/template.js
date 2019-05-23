import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import {
  BlockchainLoader,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'

const ModalStyled = styled(Modal)`
  background: ${props =>
    `linear-gradient(321.54deg, ${props.theme.purple} -15.42%, ${
      props.theme.black
    } 54.12%)`};
`
const ModalHeaderStyled = styled(ModalHeader)`
  position: absolute;
  border: none;
  > span {
    &:hover {
      cursor: pointer;
    }
  }
  z-index: 99;
`
const Content = styled.div`
  display: flex;
  min-height: 300px;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  padding: 40px 20px 20px 20px;
`
const Status = styled.div`
  > div:not(:first-child) {
    margin-top: 8px;
  }
`

const LinkAccount = props => {
  const { status, close } = props
  return (
    <ModalStyled size='small'>
      <ModalHeaderStyled onClose={close} />
      <ModalBody>
        {status.cata({
          Success: msg => (
            <Content>
              <Image name='checkmark-green' size='50px' />
              <Status>
                <Text color='white'>
                  <FormattedMessage
                    id='modals.onboarding.linkaccount.success'
                    defaultMessage='You have connected your Blockchain Wallet to The Pit. Go back and finish signing up!'
                  />
                </Text>
              </Status>
              <Button nature='purple' height='56px' fullwidth onClick={close}>
                <Text color='white' size='16px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linkaccount.successdone'
                    defaultMessage='Done'
                  />
                </Text>
              </Button>
            </Content>
          ),
          Failure: e => (
            <Content>
              <Image name='close-error' size='50px' />
              <Status>
                <Text color='white' size='24px' weight={600}>
                  <FormattedMessage
                    id='modals.onboarding.linkaccount.failureheader'
                    defaultMessage='Connection Error'
                  />
                </Text>
                <Text color='white' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linkaccount.failure'
                    defaultMessage='We could not connect your Wallet to The Pit. Please go back to The Pit and try again.'
                  />
                </Text>
                <TextGroup inline>
                  <Text size='13px' color='white'>
                    Err:{' '}
                  </Text>
                  <Text size='13px' color='white'>
                    {e.description}
                  </Text>
                </TextGroup>
              </Status>
              <Button nature='purple' height='56px' fullwidth onClick={close}>
                <Text color='white' size='16px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linkaccount.failuredone'
                    defaultMessage='Done'
                  />
                </Text>
              </Button>
            </Content>
          ),
          Loading: () => (
            <Content>
              <BlockchainLoader height='50px' width='50px' />
            </Content>
          ),
          NotAsked: () => (
            <Content>
              <BlockchainLoader height='50px' width='50px' />
            </Content>
          )
        })}
      </ModalBody>
    </ModalStyled>
  )
}

export default LinkAccount
