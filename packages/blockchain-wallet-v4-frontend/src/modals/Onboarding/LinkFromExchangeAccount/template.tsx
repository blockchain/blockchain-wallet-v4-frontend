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
import { FormattedMessage } from 'react-intl'
import { Props } from '.'
import React from 'react'
import styled from 'styled-components'

const ModalStyled = styled(Modal)`
  background: ${props =>
    `linear-gradient(321.54deg, ${props.theme.blue900} -15.42%, ${props.theme.black} 54.12%)`};
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
  width: 100%;
  word-break: break-word;
  > div:not(:first-child) {
    margin-top: 8px;
  }
`

const getIcon = tier => {
  switch (tier) {
    case 1:
      return 'silver-approved'
    case 2:
      return 'gold-approved'
    default:
      return 'checkmark-green'
  }
}

const LinkFromExchangeAccount = ({
  actions,
  close,
  email,
  emailVerified,
  linkFromExchangeAccountStatus,
  userTiers
}: Props) => {
  // @ts-ignore
  const { current } = userTiers.getOrElse({}) || {}
  return (
    <ModalStyled size='small' dataE2e='infoModalLinkFromExchangeAccount'>
      <ModalHeaderStyled onClose={close} />
      <ModalBody>
        {linkFromExchangeAccountStatus.cata({
          Success: () => (
            <Content>
              <Image name={getIcon(current)} size='50px' />
              <Status>
                <Text color='white' size='24px' weight={600}>
                  <FormattedMessage
                    id='modals.onboarding.linkfromexchange.successheader'
                    defaultMessage='Success!'
                  />
                </Text>
                <Text color='white' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linkfromexchange.success'
                    defaultMessage='You have connected your Blockchain Wallet to Exchange. Go back and finish signing up!'
                  />
                </Text>
              </Status>
              <Button
                nature='purple'
                height='56px'
                fullwidth
                onClick={close}
                data-e2e='linkDone'
              >
                <Text color='white' size='16px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linkfromexchange.successdone'
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
                    id='modals.onboarding.linkfromexchange.failureheader'
                    defaultMessage='Connection Error'
                  />
                </Text>
                <Text color='white' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linkfromexchange.failure'
                    defaultMessage='We could not connect your Wallet to Exchange. Please go back to Exchange and try again.'
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
              <Button
                nature='purple'
                height='56px'
                fullwidth
                onClick={close}
                data-e2e='linkDone'
              >
                <Text color='white' size='16px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linkfromexchange.failuredone'
                    defaultMessage='Done'
                  />
                </Text>
              </Button>
            </Content>
          ),
          Loading: () => (
            <Content>
              <BlockchainLoader height='50px' width='50px' />
              {!emailVerified && (
                <React.Fragment>
                  <Status>
                    <Text color='white' size='24px' weight={600}>
                      <FormattedMessage
                        id='modals.onboarding.linkfromexchange.unverified_email'
                        defaultMessage='Please Verify Email'
                      />
                    </Text>
                    {email ? (
                      <TextGroup inline>
                        <Text color='white' weight={500}>
                          <FormattedMessage
                            id='modals.onboarding.linkfromexchange.need_to_verify'
                            defaultMessage="You'll need to verify"
                          />
                        </Text>
                        <Text color='white' weight={500}>
                          {email}
                        </Text>
                        <Text color='white' weight={500}>
                          <FormattedMessage
                            id='modals.onboarding.linkfromexchange.to_continue'
                            defaultMessage="to continue. We'll be waiting right here in the meantime."
                          />
                        </Text>
                      </TextGroup>
                    ) : (
                      <Text color='white' weight={500}>
                        <FormattedMessage
                          id='modals.onboarding.linkfromexchange.no_email'
                          defaultMessage='You do not have an email associated with this wallet. Please to Security Center to set your email.'
                        />
                      </Text>
                    )}
                  </Status>
                  {email && (
                    <Button
                      nature='purple'
                      height='56px'
                      fullwidth
                      onClick={actions.resendVerifyEmail}
                      data-e2e='resendEmail'
                    >
                      <Text color='white' size='16px' weight={500}>
                        <FormattedMessage
                          id='modals.onboarding.linkfromexchange.send_email'
                          defaultMessage='Resend Email'
                        />
                      </Text>
                    </Button>
                  )}
                </React.Fragment>
              )}
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

export default LinkFromExchangeAccount
