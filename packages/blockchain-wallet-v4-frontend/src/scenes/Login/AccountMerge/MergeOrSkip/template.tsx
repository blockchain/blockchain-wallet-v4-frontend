import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { MergeSteps, TwoFASetupSteps, UpgradeSteps } from 'data/types'

import { CenteredTitle, StyledTemporaryButton } from '../../AccountUpgrade/AccountUpgrade.models'

const MergeOrSkip = (props) => {
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
          MergeOrSkip
        </CenteredTitle>
      </Wrapper>
      <StyledTemporaryButton type='button'>Prev Step</StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', MergeSteps.MERGE_WHATS_NEXT)}
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

export default connect(null, mapDispatchToProps)(MergeOrSkip)
