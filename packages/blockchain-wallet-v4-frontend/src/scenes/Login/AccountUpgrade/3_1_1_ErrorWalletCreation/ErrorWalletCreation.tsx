import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon, Text } from '@blockchain-com/constellation'
import { IconCloseCircle } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { UpgradeSteps } from 'data/auth/types'

import {
  ButtonNext,
  CenteredMsgWrapper,
  CenteredTitle,
  HeadingIcon,
  StyledTemporaryButton,
  TextToRightWrapper
} from '../AccountUpgrade.models'

const ErrorWalletCreation = (props) => {
  return (
    <>
      <Wrapper>
        <TextToRightWrapper>
          <Text color='blue600' variant='micro'>
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
        <CenteredTitle color='black' variant='title-3'>
          <HeadingIcon>
            <Icon label='close-circle' color='red600' size='lg'>
              <IconCloseCircle />
            </Icon>
          </HeadingIcon>
          <FormattedMessage
            id='scenes.login.upgrade.unable_retry.header'
            defaultMessage='Something Didn´t Work'
          />
          <CenteredMsgWrapper color='grey900' variant='body-1'>
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
