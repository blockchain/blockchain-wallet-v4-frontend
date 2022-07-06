import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled, { DefaultTheme } from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Analytics } from 'data/types'
import { media } from 'services/styles'

export const CardWrapper = styled.div<{ hideMargin?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 32rem;

  &:first-child {
    margin-right: ${(props) => (props.hideMargin ? '0' : '2.5rem')};
  }

  ${media.tabletL`
    &:first-child {
      margin-right: 0;
    }
  `}

  ${media.tablet`
    width: 100%;
  `}
`
export const PaddingWrapper = styled.div`
  padding: 2rem 2rem 0;
`
export const Card = styled.div`
  background: ${(props) => props.theme.white};
  border-radius: 0.75rem;
  box-sizing: border-box;

  ${media.tablet`
    width: 100%;
    padding: 1.5rem;
  `}
  ${media.mobile`
  padding: 0;
`}
`
export const CardHeader = styled.div`
  align-items: center;
  display: flex;
`
export const IconWrapper = styled.div<{ color: keyof DefaultTheme }>`
  display: flex;
  background: ${(props) => props.theme[props.color]};
  height: 3rem;
  width: 3rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 1.25rem;

  ${media.tablet`
    height: 2.5rem;
    width: 2.5rem;
    flex-shrink: 0;
  `}
`
export const CardsWrapper = styled.div`
  display: flex;

  ${media.tabletL`
    flex-direction: column;
    justify-content: center;
  `}

  ${media.tablet`
    width: 100%;
  `}
`
export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`
export const CardTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
export const InfoTitle = styled(Text)`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`
export const InfoItem = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  justify-content: flex-start;
  flex-wrap: wrap;

  > div:first-child {
    margin-right: 8px;

    ${media.tablet`
      margin-bottom: 4px;
    `}
  }
`
export const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
  margin-bottom: 2.5rem;
`
export const SignInText = styled(Text)`
  &:hover {
    color: ${(props) => props.theme.white};
    font-weight: 600;
  }
`
const LoginCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding-bottom: 1.5rem;
  ${media.tabletL`
  flex-direction: column;
  align-items: center;
`};
`
const LoginLinkText = styled(Text)`
  margin-top: 16px;
  cursor: pointer;
  ${media.mobile`
  margin-top: 0;
`};
  &:hover {
    font-weight: 600;
  }
`
const LoginLinkRow = styled.div`
  display: flex;
  align-items: center;
  ${media.mobile`
flex-direction: column;
align-items: center;
`}
`

export const LoginLink = (props: { analyticsActions; unified }) => (
  <LoginCard>
    <LinkContainer data-e2e='signupLink' to='/login'>
      <LoginLinkRow
        onClick={() =>
          props.analyticsActions.trackEvent({
            key: Analytics.LOGIN_CLICKED,
            properties: {
              origin: 'SIGN_UP_FLOW',
              unified: props.unified
            }
          })
        }
      >
        <Text
          size='16px'
          color='grey600'
          weight={500}
          style={{ cursor: 'pointer', marginTop: '16px' }}
        >
          <FormattedMessage
            id='scenes.register.account.link'
            defaultMessage='Already have a Blockchain.com Account?'
          />
        </Text>
        &nbsp;
        <LoginLinkText size='16px' color='blue600' weight={600}>
          <FormattedMessage id='scenes.login.wallet.exchange_login' defaultMessage='Log In ->' />
        </LoginLinkText>
      </LoginLinkRow>
    </LinkContainer>
  </LoginCard>
)
