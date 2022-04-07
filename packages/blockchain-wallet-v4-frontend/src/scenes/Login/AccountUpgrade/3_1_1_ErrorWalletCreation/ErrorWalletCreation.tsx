import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Icon, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { UpgradeSteps } from 'data/auth/types'

import {
  ButtonNext,
  CenteredMsgWrapper,
  CenteredTitle,
  StyledTemporaryButton,
  TextToRightWrapper
} from '../AccountUpgrade.models'

const ErrorWalletCreation = (props) => {
  return (
    <>
      <Wrapper>
        <TextToRightWrapper>
          <Text color='blue600' size='10px' weight={500} lineHeight='16px'>
            <FormattedMessage
              id='scenes.login.upgrade.unable_retry.steps'
              defaultMessage='Steps {actualStep} of {totalSteps}'
              values={{
                actualStep: 3,
                totalSteps: 3
              }}
            />
          </Text>
        </TextToRightWrapper>
        <CenteredTitle
          size='20px'
          weight={600}
          color='black'
          style={{ marginTop: '8px' }}
          lineHeight='1.5'
        >
          <Icon name='close-circle' color='red600' size='40px' />
          <FormattedMessage
            id='scenes.login.upgrade.unable_retry.header'
            defaultMessage='Something Didn´t Work'
          />
          <CenteredMsgWrapper color='textBlack' lineHeight='24px' size='16px' weight={500}>
            <FormattedMessage
              id='scenes.login.upgrade.unable_retry.text'
              defaultMessage='Don’t worry, you can still login with original credentials. You can retry the upgrade the next time you login.'
            />
          </CenteredMsgWrapper>
        </CenteredTitle>
        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={() => {}}
        >
          <FormattedMessage
            id='scenes.login.upgrade.unable_retry.button'
            defaultMessage='Open Exchange'
          />
        </ButtonNext>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.CREATE_WALLET)}
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.ERROR_ACCOUNT_UPGRADE)
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

export default connect(null, mapDispatchToProps)(ErrorWalletCreation)
