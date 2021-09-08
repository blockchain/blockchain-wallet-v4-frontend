import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'

const ModalStyled = styled(Modal)`
  background: ${(props) =>
    `linear-gradient(321.54deg, ${props.theme.purple} -15.42%, ${props.theme.black} 54.12%)`};
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
  padding: 20px 15px;
`
const Status = styled.div`
  width: 100%;
  word-break: break-word;
  margin: 18px 0;
  & > :first-child {
    margin-bottom: 25px;
  }
`

const LinkToExchangeAccountSuccess = ({ close, onAccountLinkComplete }) => {
  return (
    <ModalStyled size='xsmall' dataE2e='infoModalLinkToExchangeAccountSuccess'>
      <ModalHeaderStyled onClose={() => close()} />
      <ModalBody>
        <Content>
          <Icon name='checkmark-in-circle-filled' color='success' size='62px' />
          <Status>
            <Text color='white' size='34px' weight={600}>
              <FormattedMessage
                id='modals.onboarding.linktoexchangeaccount.success.title'
                defaultMessage='Success!'
              />
            </Text>
            <Text color='white' size='18px' weight={500}>
              <FormattedMessage
                id='modals.onboarding.linktoexchangeaccount.success.subtitle-1'
                defaultMessage='Your Blockchain Wallet is now connected to Exchange!'
              />
            </Text>
          </Status>
          <Button nature='purple' height='56px' fullwidth onClick={onAccountLinkComplete}>
            <Text color='white' size='16px' weight={500}>
              <FormattedMessage id='buttons.done' defaultMessage='Done' />
            </Text>
          </Button>
        </Content>
      </ModalBody>
    </ModalStyled>
  )
}

export default LinkToExchangeAccountSuccess
