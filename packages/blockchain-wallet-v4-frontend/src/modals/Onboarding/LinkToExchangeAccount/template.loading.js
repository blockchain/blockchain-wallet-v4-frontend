import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  BlockchainLoader,
  Button,
  Link,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'

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
  padding: 50px 20px 20px 20px;
`
const Status = styled.div`
  width: 100%;
  word-break: break-word;
  margin-top: 16px;
  & > :first-child {
    margin-bottom: 25px;
  }
`
const OpenNowButton = styled(Button)`
  margin-top: 30px;
`

const LinkToExchangeAccountLoading = ({ close, deeplinkToExchange }) => {
  return (
    <ModalStyled size='small' dataE2e='infoModalLinkToExchangeAccountLoading'>
      <ModalHeaderStyled onClose={() => close()} />
      <ModalBody>
        <Content>
          <BlockchainLoader height='80px' width='80px' />
          {deeplinkToExchange ? (
            <Status style={{ marginTop: '40px ' }}>
              <Text color='white' size='26px' weight={600}>
                <FormattedMessage
                  id='modals.onboarding.linktoexchangeaccount.loading.waiting'
                  defaultMessage='Waiting for account link'
                />
              </Text>
              <Text color='white' size='18px' weight={500}>
                <FormattedMessage
                  id='modals.onboarding.linktoexchangeaccount.loading.waitingbody'
                  defaultMessage='If a new browser tab did not open, try clicking the button below.'
                />
              </Text>
              <OpenNowButton nature='purple' height='56px' fullwidth>
                <Link href={deeplinkToExchange} target='_blank' rel='noopener noreferrer'>
                  <Text color='white' size='16px' weight={500}>
                    <FormattedMessage
                      id='modals.onboarding.linktoexchangeaccount.loading.openhere-1'
                      defaultMessage='Open the Exchange'
                    />
                  </Text>
                </Link>
              </OpenNowButton>
            </Status>
          ) : (
            <Status>
              <Text color='white' size='26px' weight={600}>
                <FormattedMessage
                  id='modals.onboarding.linktoexchangeaccount.loading.title-1'
                  defaultMessage='Taking you to the Exchange'
                />
              </Text>
              <Text color='white' size='18px' weight={500}>
                <FormattedMessage
                  id='modals.onboarding.linktoexchangeaccount.loading.sub'
                  defaultMessage='A new browser tab will open shortly where you can complete account linking.'
                />
              </Text>
            </Status>
          )}
        </Content>
      </ModalBody>
    </ModalStyled>
  )
}

export default LinkToExchangeAccountLoading
