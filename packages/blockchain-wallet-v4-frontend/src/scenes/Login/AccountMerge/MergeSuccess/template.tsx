import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Button } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { MergeSteps, TwoFASetupSteps, UpgradeSteps } from 'data/types'

import { CenteredTitle, StyledTemporaryButton } from '../../AccountUpgrade/AccountUpgrade.models'

const MergeSuccess = (props) => {
  return (
    <>
      <Wrapper>
        <CenteredTitle color='black' variant='title-3'>
          MergeSuccess
        </CenteredTitle>
        <Button
          nature='primary'
          data-e2e='mergeAccount'
          fullwidth
          height='48px'
          onClick={() => props.authActions.mergeAccounts()}
        >
          Merge Account
        </Button>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', MergeSteps.MERGE_OR_SKIP)}
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', MergeSteps.AUTH_SECOND_ACCOUNT)}
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

export default connect(null, mapDispatchToProps)(MergeSuccess)
