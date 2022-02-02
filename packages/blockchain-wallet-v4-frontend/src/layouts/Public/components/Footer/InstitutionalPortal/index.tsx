import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { LoginSteps } from 'data/types'

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

const InstitutionalPortal = (props) => (
  <LinkContainer to='/login?product=exchange&userType=institutional'>
    <SubCard
      onClick={() => props.formActions.change(LOGIN_FORM, 'step', LoginSteps.INSTITUTIONAL_PORTAL)}
    >
      <Text size='16px' color='grey400' weight={500}>
        <FormattedMessage
          id='layouts.wallet.footer.institutional_portal'
          defaultMessage='Looking for the Institutional Portal?'
        />
      </Text>
      &nbsp;
      <SignUpText size='16px' color='white' weight={600}>
        <FormattedMessage id='scenes.login.wallet.exchange_login' defaultMessage='Log In ->' />
      </SignUpText>
    </SubCard>
  </LinkContainer>
)

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(null, mapDispatchToProps)(InstitutionalPortal)
