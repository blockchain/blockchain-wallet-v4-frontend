import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import { Button, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/modals/types'
import { RecoverSteps } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

const TwoFASkipWarning = (props) => {
  const skip = () => {
    props.closeAll()
    props.formActions.change('recover', 'step', RecoverSteps.NEW_PASSWORD)
  }
  return (
    <Modal size='medium'>
      <Text
        size='20px'
        weight={600}
        color='grey900'
        style={{ margin: '24px 8px 0', textAlign: 'center' }}
      >
        <FormattedMessage
          id='sceners.reset.2fa_skip_header'
          defaultMessage='Continue without 2FA?'
        />
      </Text>

      <ModalBody>
        <Text
          size='14px'
          weight={500}
          color='grey600'
          lineHeight='1.5'
          style={{ textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.reset.2fa_skip_copy'
            defaultMessage='Entering your 2FA code allows you to recover your account without having to verify your
    identity again. If you continue without your 2FA, you’ll may have to re-verify your identity.'
          />
        </Text>
        <Button
          type='submit'
          nature='primary'
          fullwidth
          height='48px'
          data-e2e='EnterTwoFA'
          style={{ margin: '16px 0' }}
          onClick={() => props.closeAll()}
        >
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage id='scenes.reset.2fa_continue' defaultMessage='Enter 2FA' />
          </Text>
        </Button>
        <Button
          data-e2e='show_private_key_button'
          width='262px'
          nature='empty-blue'
          fullwidth
          onClick={skip}
        >
          <Text color='blue600' size='16px' weight={600}>
            <FormattedMessage id='scenes.reset.without_2fa' defaultMessage='Continue without 2FA' />
          </Text>
        </Button>
      </ModalBody>
    </Modal>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose<React.ComponentType>(
  modalEnhancer('SKIP_TWOFA_CONFIRMATION_WARNING'),
  connect(null, mapDispatchToProps)
)

export default enhance(TwoFASkipWarning)
