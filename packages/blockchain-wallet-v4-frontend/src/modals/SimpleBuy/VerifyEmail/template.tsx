import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Props as OwnProps } from '.'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const IconWrapper = styled.div<{ color: keyof DefaultTheme }>`
  display: flex;
  background: ${props => props.theme[props.color]};
  height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 20px;
`

const CloseContainer = styled.div`
  display: flex;
  align-items: right;
  justify-content: flex-end;
`
const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  padding: 0 40px;
  flex: 1;
  justify-content: center;
  div {
    display: flex;
    text-align: center;
    align-items: center;
    flex-direction: column;
  }
`

const Template: React.FC<Props> = props => {
  return (
    <Wrapper>
      <FlyoutWrapper>
        <CloseContainer>
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={props.handleClose}
          />
        </CloseContainer>
      </FlyoutWrapper>

      <ContentWrapper>
        <div>
          <IconWrapper color='blue600'>
            <Icon color='white' name='email' size='24px' />
          </IconWrapper>
          <Text
            size='20px'
            weight={600}
            color='black'
            style={{ marginTop: '8px' }}
          >
            <FormattedMessage
              id='scenes.verifyemail.title'
              defaultMessage='Verify Your Email'
            />
          </Text>
          <Text
            color='grey900'
            style={{ marginTop: '8px' }}
            size='16px'
            weight={500}
          >
            <FormattedHTMLMessage
              id='scenes.verifyemail.description'
              defaultMessage='We sent a verification email to: <b>{email}</b>. Please click the link in the email to continue.'
              values={{
                email: props.email
              }}
            />
          </Text>

          <Button
            data-e2e='verifyEmail'
            fullwidth
            height='48px'
            nature='light'
            onClick={props.resendEmail}
            style={{
              marginTop: '32px',
              marginBottom: '5px',
              maxWidth: '343px'
            }}
          >
            <Text color='blue600' size='16px' weight={600}>
              <FormattedMessage
                id='scenes.verifyemail.button'
                defaultMessage='Email didn’t arrive?'
              />
            </Text>
          </Button>
        </div>
      </ContentWrapper>
    </Wrapper>
  )
}

type Props = OwnProps & {
  email: string
  resendEmail: () => void
}

export default Template
