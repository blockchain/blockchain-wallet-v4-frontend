import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import { TextArea } from 'components/Form'
import { RecoverSteps } from 'data/types'
import { required, validMnemonic } from 'services/forms'

import { Props } from '../..'
import {
  ContactSupportText,
  GoBackArrow,
  OuterWrapper,
  RECOVER_FORM,
  SubCard,
  TroubleLoggingInRow,
  WrapperWithPadding
} from '../../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
`

const FirstStep = (props: Props) => {
  const { formActions, invalid, nabuId, setStep, submitting } = props
  const resetAccountClicked = () => {
    formActions.change(RECOVER_FORM, 'step', RecoverSteps.RESET_ACCOUNT)
    props.authActions.analyticsResetAccountClicked('RECOVERY_PHRASE')
  }
  return (
    <OuterWrapper>
      <WrapperWithPadding>
        <GoBackArrow handleBackArrowClick={() => setStep(RecoverSteps.RECOVERY_OPTIONS)} />
        <FormBody>
          <Text
            color='grey900'
            size='16px'
            weight={600}
            lineHeight='1.5'
            style={{ marginBottom: '8px' }}
          >
            <FormattedMessage
              id='scenes.recovery.title'
              defaultMessage='Input your secret private key recovery phrase'
            />
          </Text>
          <Text
            color='grey600'
            size='12px'
            weight={500}
            lineHeight='1.5'
            style={{ marginBottom: '16px' }}
          >
            <FormattedMessage
              id='scenes.reovery.subtitle'
              defaultMessage='Your 12 word Secret Private Key Recovery Phrase grants access to your account. Please input it in the order specified.'
            />
          </Text>
          <Field
            bgColor='grey000'
            autoComplete='off'
            autoFocus
            component={TextArea}
            disableSpellcheck
            name='mnemonic'
            validate={[required, validMnemonic]}
            height='96px'
            placeholder='Enter your secret private key recovery phrase'
          />
        </FormBody>
        <Text
          size='14px'
          weight={500}
          color='grey600'
          lineHeight='1.5'
          style={{ margin: '8px 0 24px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.recover.firststep.space'
            defaultMessage='Separate each word with a space'
          />
        </Text>
        <Button
          type='submit'
          nature='primary'
          fullwidth
          height='48px'
          disabled={submitting || invalid}
          data-e2e='submitRecoveryPhrase'
          style={{ marginBottom: '16px' }}
        >
          {submitting ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <Text color='whiteFade900' size='16px' weight={600}>
              <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
            </Text>
          )}
        </Button>
      </WrapperWithPadding>
      <SubCard>
        <TroubleLoggingInRow>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ cursor: 'pointer', marginTop: '16px' }}
          >
            <FormattedMessage
              id='scenes.login.trouble_logging_in'
              defaultMessage='Trouble Logging In?'
            />
          </Text>
          &nbsp;
          {nabuId ? (
            <ContactSupportText
              size='16px'
              weight={600}
              color='blue600'
              data-e2e='troubleLoggingIn'
              onClick={resetAccountClicked}
              style={{ marginLeft: '4px' }}
            >
              <FormattedMessage
                id='scenes.login.reset_your_account.arrow'
                defaultMessage='Reset your account ->'
              />
            </ContactSupportText>
          ) : (
            <ContactSupportText
              weight={600}
              size='16px'
              target='_blank'
              href='https://support.blockchain.com/'
              style={{ marginLeft: '2px' }}
            >
              <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
            </ContactSupportText>
          )}
        </TroubleLoggingInRow>
      </SubCard>
    </OuterWrapper>
  )
}

export default FirstStep
