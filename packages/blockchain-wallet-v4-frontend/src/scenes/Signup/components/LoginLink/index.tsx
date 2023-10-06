import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { trackEvent } from 'data/analytics/slice'
import { getUnifiedAccountStatus } from 'data/cache/selectors'
import { Analytics } from 'data/types'
import { media } from 'services/styles'

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

export const LoginLink = () => {
  const dispatch = useDispatch()

  const unified = useSelector(getUnifiedAccountStatus)

  return (
    <LoginCard>
      <LinkContainer data-e2e='signupLink' to='/login'>
        <LoginLinkRow
          onClick={() =>
            dispatch(
              trackEvent({
                key: Analytics.LOGIN_CLICKED,
                properties: {
                  origin: 'SIGN_UP_FLOW',
                  unified
                }
              })
            )
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
}
