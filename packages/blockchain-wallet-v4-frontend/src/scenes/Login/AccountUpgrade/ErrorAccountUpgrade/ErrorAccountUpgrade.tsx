import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCloseCircle } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/auth/types'

import ScreenHeader from '../../components/ScreenHeader'
import { ButtonLater, ButtonNext, StyledTemporaryButton } from '../AccountUpgrade.models'

const ErrorAccountUpgrade = (props) => {
  const steps = {
    actualStep: 3,
    totalSteps: 3
  }

  const handlePrev = () => {
    props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.ERROR_WALLET_CREATION)
  }

  const handleNext = () =>
    props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.SELECT_2FA_TYPE)

  return (
    <>
      <Wrapper>
        <ScreenHeader
          icon={
            <Icon label='close-circle' color='red600' size='lg'>
              <IconCloseCircle />
            </Icon>
          }
          handleBack={handlePrev}
          steps={steps}
          title={
            <FormattedMessage
              id='scenes.login.upgrade.able_retry.header'
              defaultMessage='Something Didn´t Work'
            />
          }
          description={
            <FormattedMessage
              id='scenes.login.upgrade.able_retry.text'
              defaultMessage='Don’t worry, you can still login with original credentials. You can retry the upgrade the next time you login.'
            />
          }
        />

        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={() => {}}
        >
          <FormattedMessage
            id='scenes.login.upgrade.able_retry.button_1'
            defaultMessage='Retry Upgrade'
          />
        </ButtonNext>
        <ButtonLater
          data-e2e='LaterButton'
          color='blue600'
          fullwidth
          height='48px'
          onClick={() => {}}
        >
          <FormattedMessage
            id='scenes.login.upgrade.able_retry.button_2'
            defaultMessage='I’ll Try Again Later'
          />
        </ButtonLater>
      </Wrapper>
      <StyledTemporaryButton onClick={handlePrev} type='button'>
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton onClick={handleNext} type='button'>
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

export default connect(null, mapDispatchToProps)(ErrorAccountUpgrade)
