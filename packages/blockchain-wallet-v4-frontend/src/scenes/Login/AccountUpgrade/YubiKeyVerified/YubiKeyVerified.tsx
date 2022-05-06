import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCheckCircle } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/types'

import ScreenHeader from '../../components/ScreenHeader'
import { ButtonNext, StyledTemporaryButton } from '../AccountUpgrade.models'

const YubiKeyVerified = (props) => {
  const steps = {
    actualStep: 3,
    totalSteps: 3
  }
  const handlePrev = () => {
    props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.ERROR_ACCOUNT_UPGRADE)
  }
  const handleNext = () => {
    props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_SUCCESS)
  }

  return (
    <>
      <Wrapper>
        <ScreenHeader
          icon={
            <Icon label='checkmark-circle-filled' color='green600' size='lg'>
              <IconCheckCircle />
            </Icon>
          }
          hasBackArrow
          handleBack={handlePrev}
          steps={steps}
          title={
            <FormattedMessage
              id='scenes.login.upgrade.yubikeyVerify.header'
              defaultMessage='Yubikey Verified'
            />
          }
          description={
            <FormattedMessage
              id='scenes.login.upgrade.yubikeyVerify.text'
              defaultMessage='Make sure your Yubikey is plugged in next time you log into your Blockchain account.'
            />
          }
        />

        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={handleNext}
        >
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </ButtonNext>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.YUBIKEY_SETUP)}
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(YubiKeyVerified)
