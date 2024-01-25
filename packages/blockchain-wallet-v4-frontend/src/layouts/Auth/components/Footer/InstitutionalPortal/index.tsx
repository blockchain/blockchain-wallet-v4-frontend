import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { change } from 'redux-form'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { auth } from 'data/actions'
import { LOGIN_FORM } from 'data/auth/model'
import { AuthUserType, LoginSteps } from 'data/types'

const SubCard = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
`
const SignUpText = styled(Text)`
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.white};
    font-weight: 600;
  }
`

const InstitutionalPortal = () => {
  const dispatch = useDispatch()
  const institutionalPortalFooterClick = () => {
    dispatch(auth.setProductAuthMetadata({ userType: AuthUserType.INSTITUTIONAL }))
    dispatch(change(LOGIN_FORM, 'step', LoginSteps.INSTITUTIONAL_PORTAL))
  }
  return (
    <LinkContainer to='/login?product=exchange&userType=institutional'>
      <SubCard onClick={institutionalPortalFooterClick}>
        <Text size='16px' color='grey400' weight={500}>
          <FormattedMessage
            id='layouts.wallet.footer.institutional_link'
            defaultMessage='Are you an Institutional Exchange user?'
          />
        </Text>
        &nbsp;
        <SignUpText size='16px' color='white' weight={600}>
          <FormattedMessage id='scenes.login.wallet.exchange_login' defaultMessage='Log In ->' />
        </SignUpText>
      </SubCard>
    </LinkContainer>
  )
}

export default InstitutionalPortal
