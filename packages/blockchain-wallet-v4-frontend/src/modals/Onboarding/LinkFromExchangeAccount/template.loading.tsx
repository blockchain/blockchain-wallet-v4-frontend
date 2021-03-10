import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  BlockchainLoader,
  Button,
  Icon,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { DisplayPaymentIcon } from 'components/SimpleBuy'

import { Props } from '.'
import { ActionsWrapper, Content, MainContent, Status } from './styles'

const DisplayIcon = styled(DisplayPaymentIcon)`
  margin-bottom: 30px;
`

const MainTitle = styled(Text)`
  margin-bottom: 20px;
`

const Loading: React.FC<Props & { close: () => void }> = props => {
  return (
    <Content>
      <ActionsWrapper>
        {!props.emailVerified && (
          <Icon
            cursor
            data-e2e='onboadingCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={props.close}
          />
        )}
      </ActionsWrapper>
      <MainContent>
        {props.emailVerified ? (
          <BlockchainLoader width='80px' height='80px' />
        ) : null}
        {!props.emailVerified && (
          <>
            <DisplayIcon showBackground>
              <Icon name='email' color='blue600' size='24px' />
            </DisplayIcon>
            <Status>
              <MainTitle color='grey800' size='24px' weight={600}>
                <FormattedMessage
                  id='modals.onboarding.linkfromexchange.unverified_email'
                  defaultMessage='Please Verify Your Email'
                />
              </MainTitle>
              {props.email ? (
                <TextGroup inline>
                  <Text color='grey600' weight={500}>
                    <FormattedMessage
                      id='modals.onboarding.linkfromexchange.need_to_verify'
                      defaultMessage="You'll need to verify"
                    />
                  </Text>
                  <Text color='grey600' weight={500}>
                    {props.email}
                  </Text>
                  <Text color='grey600' weight={500}>
                    <FormattedMessage
                      id='modals.onboarding.linkfromexchange.to_continue'
                      defaultMessage="to continue. We'll be waiting right here in the meantime."
                    />
                  </Text>
                </TextGroup>
              ) : (
                <Text color='grey600' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linkfromexchange.no_email'
                    defaultMessage='You do not have an email associated with this wallet. Please to Security Center to set your email.'
                  />
                </Text>
              )}
            </Status>
            {props.email && (
              <Button
                nature='empty-blue'
                height='56px'
                fullwidth
                onClick={props.actions.resendVerifyEmail}
                data-e2e='resendEmail'
                style={{ marginTop: '25px' }}
              >
                <Text color='blue600' size='16px' weight={500}>
                  <FormattedMessage
                    id='modals.onboarding.linkfromexchange.send_email'
                    defaultMessage='Resend Email'
                  />
                </Text>
              </Button>
            )}
          </>
        )}
      </MainContent>
    </Content>
  )
}

export default Loading
