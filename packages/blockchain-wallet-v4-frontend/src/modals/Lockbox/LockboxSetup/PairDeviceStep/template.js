import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  Image,
  Link,
  Text,
  TextGroup,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { CheckBox, Form, FormGroup, FormItem } from 'components/Form'
import { required } from 'services/forms'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
const IntroWrapper = styled.div`
  margin: 16px 0 40px;
  text-align: center;
`
const ExportKeysText = styled(Text)`
  margin-top: 12px;
`

const ClickableText = styled(Text)`
  color: ${props => props.theme.blue600};
  cursor: pointer;
`
const AppManagerLink = styled(ClickableText)`
  margin: 0 -1px 0 -2px;
  font-weight: 500;
`
const TimeoutHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-bottom: 30px;
`
const SupportText = styled(Link)`
  margin: 35px 0 8px;
`
const ContactSupportText = styled(TextGroup)`
  margin: 32px 0 12px;
`
const SupportListItem = styled(FormItem)`
  display: flex;
  margin-bottom: 8px;
`
const CheckboxLabel = styled.label`
  margin-top: 3px;
  margin-left: 12px;
`
const Tooltip = styled(TooltipHost)`
  & > span {
    font-size: 12px;
  }
`
const PairDeviceStep = props => {
  const {
    btcOpenTimeout,
    deviceType,
    invalid,
    onGoToAppManager,
    onTimeoutAccept,
    showBtcWarning,
    supportLink
  } = props

  return btcOpenTimeout ? (
    <Wrapper>
      <TimeoutHeader>
        <Text size='20px' weight={500} style={{ marginTop: '10px' }}>
          <FormattedMessage
            id='modals.lockboxsetup.pairdevice.timeout.header'
            defaultMessage='Are you having issues?'
          />
        </Text>
        <Text size='15px' weight={400} style={{ marginTop: '4px' }}>
          <FormattedMessage
            id='modals.lockboxsetup.pairdevice.timeout.subheader'
            defaultMessage='Check the following errors:'
          />
        </Text>
      </TimeoutHeader>
      <Form>
        <FormGroup>
          <SupportListItem>
            <Field
              name='connected'
              validate={[required]}
              component={CheckBox}
              hideErrors
            />
            <CheckboxLabel>
              <Text size='12px' weight={400}>
                <FormattedMessage
                  id='modals.lockboxsetup.pairdevice.timeout.issue1'
                  defaultMessage='My device is connected with the supplied USB cable.'
                />
              </Text>
            </CheckboxLabel>
          </SupportListItem>
          <SupportListItem>
            <Field
              name='installed'
              validate={[required]}
              component={CheckBox}
              hideErrors
            />
            <CheckboxLabel>
              <TextGroup inline>
                <Text size='12px' weight={400}>
                  <FormattedMessage
                    id='modals.lockboxsetup.pairdevice.timeout.issue2.part1'
                    defaultMessage='I have installed the Bitcoin app. If you do not have the app installed, click'
                  />
                </Text>
                <AppManagerLink
                  size='12px'
                  weight={400}
                  onClick={onGoToAppManager}
                >
                  <FormattedMessage id='copy.here' defaultMessage='here' />
                </AppManagerLink>
                <Text size='12px' weight={400}>
                  <FormattedMessage
                    id='modals.lockboxsetup.pairdevice.timeout.issue2.part3'
                    defaultMessage='to install it.'
                  />
                </Text>
              </TextGroup>
            </CheckboxLabel>
          </SupportListItem>
          <SupportListItem>
            <Field
              name='opened'
              validate={[required]}
              component={CheckBox}
              hideErrors
            />
            <CheckboxLabel>
              <Text size='12px' weight={400}>
                <FormattedMessage
                  id='modals.lockboxsetup.pairdevice.timeout.issue3'
                  defaultMessage='The Bitcoin app is open on my device. Use the top buttons to scroll left or right to the Bitcoin app. Then press the top two buttons to open the app.'
                />
              </Text>
            </CheckboxLabel>
          </SupportListItem>
        </FormGroup>
      </Form>
      <ContactSupportText inline>
        <Text size='11px' weight={400}>
          <FormattedMessage
            id='modals.lockboxsetup.pairdevice.timeout.support'
            defaultMessage='Completed the above and still having issues?'
          />
        </Text>
        <SupportText
          href={supportLink}
          target='_blank'
          size='11px'
          weight={500}
        >
          <FormattedMessage
            id='buttons.contact_support'
            defaultMessage='Contact Support'
          />
        </SupportText>
      </ContactSupportText>
      <Button
        fullwidth
        type='submit'
        disabled={invalid}
        onClick={onTimeoutAccept}
        nature='primary'
      >
        <FormattedMessage
          id='modals.lockboxsetup.pairdevice.timeout.retry'
          defaultMessage='Retry Pairing'
        />
      </Button>
    </Wrapper>
  ) : (
    <Wrapper>
      <Image
        style={{ marginBottom: '18px' }}
        name='lockbox-onboard-pairdevice'
        width='95%'
      />
      <IntroWrapper>
        <Text size='12px' weight={400}>
          <FormattedMessage
            id='modals.lockboxsetup.pairdevice.intro'
            defaultMessage='Open the Bitcoin app on your {deviceType}. This will pair your device with your Blockchain wallet so that you can always view the balance of your Lockbox.'
            values={{ deviceType }}
          />
        </Text>
        {showBtcWarning && (
          <ExportKeysText size='12px' weight={500}>
            <FormattedMessage
              id='modals.lockboxsetup.pairdevice.exportkeyswarning'
              defaultMessage='Your version of the BTC app requires that you allow the export of your public keys on the device. You must allow the export of 6 keys.'
            />
            <Tooltip
              id='lockbox.exportkeyswarning'
              data-place='right'
              style={{ marginTop: '3px' }}
            >
              <TooltipIcon name='info' />
            </Tooltip>
          </ExportKeysText>
        )}
      </IntroWrapper>
      <TextGroup inline style={{ marginBottom: '14px' }}>
        <Text size='10px' weight={400}>
          <FormattedMessage
            id='modals.lockboxsetup.pairdevice.install'
            defaultMessage="Don't have the Bitcoin app on your {deviceType}? Install it"
            values={{ deviceType }}
          />
        </Text>
        <ClickableText
          style={{ marginLeft: '-2px' }}
          size='10px'
          onClick={onGoToAppManager}
        >
          <FormattedMessage
            id='modals.lockboxsetup.pairdevice.here'
            defaultMessage='here.'
          />
        </ClickableText>
      </TextGroup>
      <Button fullwidth disabled nature='dark'>
        <FormattedMessage
          id='modals.lockboxsetup.openbtcappstep.waiting'
          defaultMessage='Waiting...'
        />
      </Button>
    </Wrapper>
  )
}
export default reduxForm({ form: 'pairLockboxChecklist' })(PairDeviceStep)
