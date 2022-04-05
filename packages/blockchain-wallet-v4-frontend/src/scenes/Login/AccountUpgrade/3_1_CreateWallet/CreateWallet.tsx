import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Button } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { UpgradeSteps } from 'data/auth/types'

import { CenteredTitle, StyledTemporaryButton } from '../AccountUpgrade.models'

const CreateWallet = (props) => {
  return (
    <>
      <Wrapper>
        <CenteredTitle
          size='20px'
          weight={600}
          color='black'
          style={{ marginTop: '8px' }}
          lineHeight='1.5'
        >
          <FormattedMessage
            id='scenes.login.upgrade.newpassword'
            defaultMessage='Create a New Password'
          />
        </CenteredTitle>
        <Button
          nature='primary'
          data-e2e='createWalletUpgradeAccount'
          fullwidth
          height='48px'
          onClick={() =>
            props.signupActions.createWalletForExchangeAccountUpgrade({
              captchaToken: '',
              password: 'blockchain'
            })
          }
        >
          Next
        </Button>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_OVERVIEW)}
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.ERROR_WALLET_CREATION)
        }
        type='button'
      >
        Next Step
      </StyledTemporaryButton>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  signupActions: bindActionCreators(actions.signup, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(CreateWallet)
