import { Field, reduxForm } from 'redux-form'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { includes } from 'ramda'
import Bowser from 'bowser'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Banner, Button, Text, TextGroup } from 'blockchain-info-components'
import {
  FiatConverter,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxBtcAddresses,
  SelectBoxCoin,
  TextArea
} from 'components/Form'
import { invalidAmountMax, invalidAmountMin } from './validation'
import { model } from 'data'
import { required } from 'services/FormHelper'
import CopyClipboard from 'components/CopyClipboard'
import QRCodeWrapper from 'components/QRCodeWrapper'

const AddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const BannerContainer = styled.div`
  margin-top: 8px;
  *.link {
    cursor: pointer;
    text-decoration: underline;
    color: ${props => props.theme.blue900};
  }
`
const ContinueButton = styled(Button)`
  margin-top: 16px;
`
const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 25px;
  width: 100%;
`
const ChangeViewContainer = styled(TextGroup)`
  margin-top: 16px;
  text-align: center;
`
const MakeRequestLinkText = styled(Text)`
  cursor: pointer;
  color: ${props => props.theme.blue900};
`

const FirstStep = props => {
  const {
    closeAll,
    excludeLockbox,
    handleOpenLockbox,
    handleSubmit,
    invalid,
    importedAddresses,
    onToggleMakeRequestLink,
    receiveAddress,
    showRequestLinkBuilder,
    submitting,
    type
  } = props

  const isLockboxAcct = type === 'LOCKBOX'
  const browser = Bowser.getParser(window.navigator.userAgent)
  const warnLockboxReceive = !browser.satisfies(
    model.components.lockbox.supportedBrowsers
  )

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormItem data-e2e='currencySelectDropdown'>
          <FormLabel htmlFor='coin'>
            <FormattedMessage
              id='modals.sendbitcoin.firststep.coin'
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
      </FormGroup>
      <FormGroup>
        <FormItem data-e2e='receiveToWalletDropdown'>
          <FormLabel htmlFor='to'>
            <FormattedMessage
              id='modals.requestbtc.to'
              defaultMessage='Receive To:'
            />
          </FormLabel>
          <Field
            name='to'
            component={SelectBoxBtcAddresses}
            excludeLockbox={excludeLockbox}
            includeAll={false}
            validate={[required]}
          />
          {includes(receiveAddress, importedAddresses) && (
            <BannerContainer>
              <Banner type='warning'>
                <FormattedMessage
                  id='modals.requestbtc.importedwarning'
                  defaultMessage='You are about to receive to a watch-only address. You can only spend these funds if you have access to the private key.'
                />
              </Banner>
            </BannerContainer>
          )}
        </FormItem>
      </FormGroup>
      {showRequestLinkBuilder ? (
        <React.Fragment>
          <FormGroup>
            <FormItem>
              <FormLabel htmlFor='amount'>
                <FormattedMessage
                  id='modals.requestbtc.requestlink.amount'
                  defaultMessage='Amount:'
                />
              </FormLabel>
              <Field
                name='amount'
                component={FiatConverter}
                validate={[required, invalidAmountMin, invalidAmountMax]}
                coin='BTC'
                data-e2e='requestBtc'
              />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItem>
              <FormLabel htmlFor='message'>
                <FormattedMessage
                  id='modals.requestbtc.requestlink.description'
                  defaultMessage='Description:'
                />
              </FormLabel>
              <Field
                name='message'
                component={TextArea}
                validate={[required]}
                placeholder="What's this transaction for? (optional)"
                data-e2e='requestBtcDescription'
              />
            </FormItem>
          </FormGroup>
          <ContinueButton
            type='submit'
            nature='primary'
            fullwidth
            data-e2e='requestBtcLinkNextButton'
            disabled={submitting || invalid}
          >
            <FormattedMessage
              id='modals.requestbtc.requestlink.next'
              defaultMessage='Next'
            />
          </ContinueButton>
          <ChangeViewContainer inline>
            <MakeRequestLinkText
              size='13px'
              weight={500}
              onClick={onToggleMakeRequestLink}
            >
              <FormattedHTMLMessage
                id='modals.requestbtc.requestlink.showaddress'
                defaultMessage='Show BTC Address'
              />
            </MakeRequestLinkText>
          </ChangeViewContainer>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <QRCodeContainer>
            <QRCodeWrapper
              value={receiveAddress}
              size={125}
              data-e2e='requestBtcAddressQrCode'
            />
          </QRCodeContainer>
          <FormGroup>
            <FormItem>
              <FormLabel>
                <FormattedMessage
                  id='modals.requestbtc.address'
                  defaultMessage='Address:'
                />
              </FormLabel>
              <AddressContainer>
                <CopyClipboard
                  address={receiveAddress}
                  data-e2e='requestBtc'
                  coin='BTC'
                />
              </AddressContainer>
            </FormItem>
          </FormGroup>
          {isLockboxAcct && (
            <BannerContainer>
              <Banner type='info'>
                {warnLockboxReceive ? (
                  <Text color='warning' size='12px'>
                    <FormattedHTMLMessage
                      id='modals.requestbtc.lockbox.confirm.warnbrowser'
                      defaultMessage='Unsupported browser to confirm the receive address on your Lockbox.  Please use the Brave, Chrome, Firefox or Opera browsers to confirm or continue without confirming the address at your own risk.'
                    />
                  </Text>
                ) : (
                  <TextGroup inline>
                    <Text color='warning' size='12px'>
                      <FormattedHTMLMessage
                        id='modals.requestbtc.lockbox.confirm1'
                        defaultMessage='Please confirm the address above on your Lockbox by opening your Bitcoin app now.'
                      />
                    </Text>
                    <Text size='12px' onClick={handleOpenLockbox}>
                      <span className='link'>
                        <FormattedHTMLMessage
                          id='modals.requestbtc.lockbox.clickhere'
                          defaultMessage='Click here'
                        />
                      </span>
                    </Text>
                    <Text color='warning' size='12px'>
                      <FormattedHTMLMessage
                        id='modals.requestbtc.lockbox.confirm2'
                        defaultMessage='once the app has been opened.'
                      />
                    </Text>
                  </TextGroup>
                )}
              </Banner>
            </BannerContainer>
          )}
          <ContinueButton
            onClick={closeAll}
            fullwidth
            nature='primary'
            data-e2e='requestBtcDoneButton'
          >
            <FormattedMessage id='buttons.done' defaultMessage='Done' />
          </ContinueButton>
          <ChangeViewContainer inline>
            <MakeRequestLinkText
              size='13px'
              weight={500}
              onClick={onToggleMakeRequestLink}
              data-e2e='shareableRequestLink'
            >
              <FormattedHTMLMessage
                id='modals.requestbtc.makerequestlink'
                defaultMessage='Create Shareable Request Link'
              />
            </MakeRequestLinkText>
          </ChangeViewContainer>
        </React.Fragment>
      )}
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  receiveAddress: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestBtc', destroyOnUnmount: false })(
  FirstStep
)
