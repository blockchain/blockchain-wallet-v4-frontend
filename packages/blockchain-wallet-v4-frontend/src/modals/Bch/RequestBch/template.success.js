import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import Bowser from 'bowser'

import QRCodeWrapper from 'components/QRCodeWrapper'
import { required } from 'services/FormHelper'
import {
  Banner,
  Button,
  Separator,
  Text,
  TextGroup,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'
import {
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxBchAddresses,
  SelectBoxCoin
} from 'components/Form'
import CopyClipboard from 'components/CopyClipboard'

const AddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  margin-top: 5px;
  width: 100%;
`
const ScanMessage = styled.div`
  padding-bottom: 20px;
`
const BannerContainer = styled.div`
  margin-top: 8px;
`
const LockboxInstructions = styled.div`
  & > :last-child {
    margin-top: 4px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
  }
`
const LockboxOpen = styled(TextGroup)`
  font-size: 12px;
  color: ${props => props.theme['warning']};
  *.link {
    cursor: pointer;
    text-decoration: underline;
    color: ${props => props.theme['brand-primary']};
  }
`

const RequestBch = props => {
  const {
    submitting,
    invalid,
    handleSubmit,
    receiveAddress,
    handleOpenLockbox,
    legacyAddress,
    type,
    excludeLockbox
  } = props

  const isLockboxAcct = type === 'LOCKBOX'
  const browser = Bowser.getParser(window.navigator.userAgent)
  const warnLockboxReceive = !browser.satisfies({
    chrome: '>45',
    firefox: '>45',
    opera: '>20'
  })

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'20px'}>
        <FormItem data-e2e='currencySelectDropdown'>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.sendbch.coin'
              defaultMessage='Currency:'
            />
          </FormLabel>
          <Field
            name='coin'
            component={SelectBoxCoin}
            type='request'
            validate={[required]}
          />
        </FormItem>
        <FormItem data-e2e='receiveToWalletDropdown'>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.requestbch.firststep.to'
              defaultMessage='Receive to:'
            />
          </FormLabel>
          <Field
            name='to'
            coin='BCH'
            component={SelectBoxBchAddresses}
            excludeLockbox={excludeLockbox}
            includeAll={false}
            validate={[required]}
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.requestbch.share'
              defaultMessage='Copy & Share Address: '
            />
            <TooltipHost id='reqBchShare'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </FormLabel>
          <AddressContainer>
            <CopyClipboard address={receiveAddress} data-e2e='requestBch' />
          </AddressContainer>
        </FormItem>
      </FormGroup>
      {isLockboxAcct && (
        <BannerContainer>
          <Banner type='info'>
            {warnLockboxReceive ? (
              <Text color='warning' size='12px'>
                <FormattedHTMLMessage
                  id='modals.requestbch.firststep.lockbox.confirm.warn'
                  defaultMessage='You are not be able to confirm the receive address on your Lockbox without using the Chrome browser.  You may still continue without confirming the address if you so choose.'
                />
              </Text>
            ) : (
              <LockboxInstructions>
                <LockboxOpen inline>
                  <Text color='warning' size='12px'>
                    <FormattedHTMLMessage
                      id='modals.requestbch.firststep.lockbox.confirmfirst'
                      defaultMessage='Please confirm the legacy address below on your Lockbox by opening your Bitcoin Cash app now.'
                    />
                  </Text>
                  <Text size='12px' onClick={handleOpenLockbox}>
                    <span className='link'>
                      <FormattedHTMLMessage
                        id='modals.requestbch.firststep.lockbox.clickhere'
                        defaultMessage='Click here'
                      />
                    </span>
                  </Text>
                  <Text color='warning' size='12px'>
                    <FormattedHTMLMessage
                      id='modals.requestbch.firststep.lockbox.confirm2'
                      defaultMessage='once the app has been opened.'
                    />
                  </Text>
                </LockboxOpen>
                <Text color='warning'>{legacyAddress}</Text>
              </LockboxInstructions>
            )}
          </Banner>
        </BannerContainer>
      )}
      <Separator margin={'20px 0'}>
        <Text size='14px' weight={400} uppercase>
          <FormattedMessage id='modals.requestbch.or' defaultMessage='Or' />
        </Text>
      </Separator>
      <QRCodeContainer>
        <ScanMessage>
          <Text size='14px'>
            <FormattedMessage
              id='modals.requestbch.scan'
              defaultMessage='Scan QR Code:'
            />
            <TooltipHost id='reqBchQR'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </Text>
        </ScanMessage>
        <QRCodeWrapper
          value={receiveAddress}
          size={150}
          data-e2e='requestBchAddressQrCode'
        />
      </QRCodeContainer>
      <Button
        type='submit'
        nature='primary'
        fullwidth
        disabled={submitting || invalid}
        data-e2e='requestBchDoneButton'
      >
        <FormattedMessage id='modals.requestbch.done' defaultMessage='Done' />
      </Button>
    </Form>
  )
}

RequestBch.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  receiveAddress: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestBch', destroyOnUnmount: false })(
  RequestBch
)
