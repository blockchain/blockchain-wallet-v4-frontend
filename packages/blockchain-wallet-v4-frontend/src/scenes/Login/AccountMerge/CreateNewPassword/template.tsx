import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'

import { Button } from 'blockchain-info-components'
import PasswordBox from 'components/Form/PasswordBox'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { MergeSteps, TwoFASetupSteps, UpgradeSteps } from 'data/types'
import { required } from 'services/forms'

import { CenteredTitle, StyledTemporaryButton } from '../../AccountUpgrade/AccountUpgrade.models'

const CreateNewPassword = (props) => {
  const createNewMergePassword = () => {
    props.authActions.mergeChangePassword()
    props.formActions.change(LOGIN_FORM, 'step', MergeSteps.MERGE_SUCCESS)
  }
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
          Create New Password
        </CenteredTitle>
        <Field
          autoFocus
          component={PasswordBox}
          data-e2e='mergePassword'
          name='mergePassword'
          placeholder='Enter your password'
          validate={[required]}
        />
        <Button
          nature='primary'
          data-e2e='changePasswordOnMerge'
          fullwidth
          height='48px'
          onClick={() => createNewMergePassword()}
        >
          Next
        </Button>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.ERROR_ACCOUNT_UPGRADE)
        }
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.GOOGLE_AUTH_SETUP)
        }
        type='button'
      >
        Next Step
      </StyledTemporaryButton>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(CreateNewPassword)
