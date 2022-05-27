import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { PlatformTypes } from 'data/types'
import { media } from 'services/styles'

const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 0;
  ${media.tabletL`
    flex-direction: column;
    align-items: center;
  `};
`
const SignUpText = styled(Text)`
  margin-top: 16px;
  cursor: pointer;
  ${media.mobile`
    margin-top: 0;
  `};
  &:hover {
    font-weight: 600;
  }
`
const Row = styled.div`
  display: flex;
  align-items: center;
  ${media.mobile`
    flex-direction: column;
    align-items: center;
  `}
`

const SignUpLink = (props) => {
  const hideSignupLink =
    props.platform === PlatformTypes.ANDROID || props.platform === PlatformTypes.IOS
  return hideSignupLink ? null : (
    <SubCard>
      <LinkContainer data-e2e='signupLink' to='/signup'>
        <Row>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ cursor: 'pointer', marginTop: '16px' }}
          >
            <FormattedMessage
              id='scenes.login.account_signup'
              defaultMessage="Don't have a Blockchain Account?"
            />
          </Text>
          &nbsp;
          <SignUpText size='16px' color='blue600' weight={600}>
            <FormattedMessage id='buttons.signup_now' defaultMessage='Sign up Now ->' />
          </SignUpText>
        </Row>
      </LinkContainer>
    </SubCard>
  )
}

export default SignUpLink
