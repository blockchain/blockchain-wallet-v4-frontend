import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import * as bowser from 'bowser'

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
  SelectBoxCoin,
  SelectBoxXlmAddresses
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
  *.link {
    cursor: pointer;
    text-decoration: underline;
    color: ${props => props.theme['brand-primary']};
  }
`

const RequestXlm = ({
  excludeLockbox,
  handleSubmit,
  handleOpenLockbox,
  address,
  xlmURI,
  type
}) => {
  const isLockboxAcct = type === 'LOCKBOX'
  const warnLockboxReceive = !(
    bowser.name === 'Chrome' || bowser.name === 'Chromium'
  )
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'20px'}>
        <FormItem data-e2e='currencySelectDropdown'>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.requestxlm.coin'
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
              id='modals.requestxlm.firststep.to'
              defaultMessage='Receive to:'
            />
          </FormLabel>
          <Field
            name='to'
            component={SelectBoxXlmAddresses}
            includeAll={false}
            validate={[required]}
            excludeLockbox={excludeLockbox}
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.requestxlm.share'
              defaultMessage='Copy & Share Address:'
            />
            <TooltipHost id='reqXlmShare'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </FormLabel>
        </FormItem>
        <AddressContainer>
          <CopyClipboard address={address} data-e2e='requestXlm' />
        </AddressContainer>
      </FormGroup>
      {isLockboxAcct && (
        <BannerContainer>
          <Banner type='info'>
            {warnLockboxReceive ? (
              <Text color='warning' size='12px'>
                <FormattedHTMLMessage
                  id='modals.requestxlm.lockbox.confirm.warn'
                  defaultMessage='You are not be able to confirm the receive address on your Lockbox without using the Chrome browser.  You may still continue without confirming the address if you so choose.'
                />
              </Text>
            ) : (
              <TextGroup inline>
                <Text color='warning' size='12px'>
                  <FormattedHTMLMessage
                    id='modals.requestxlm.firststep.lockbox.confirm1'
                    defaultMessage='Please confirm the address above on your Lockbox by opening your Stellar app now.'
                  />
                </Text>
                <Text size='12px' onClick={handleOpenLockbox}>
                  <span className='link'>
                    <FormattedHTMLMessage
                      id='modals.requestxlm.firststep.lockbox.clickhere'
                      defaultMessage='Click here'
                    />
                  </span>
                </Text>
                <Text color='warning' size='12px'>
                  <FormattedHTMLMessage
                    id='modals.requestxlm.firststep.lockbox.confirm2'
                    defaultMessage='once the app has been opened.'
                  />
                </Text>
              </TextGroup>
            )}
          </Banner>
        </BannerContainer>
      )}
      <Separator margin={'20px 0'}>
        <Text size='14px' weight={400} uppercase>
          <FormattedMessage id='modals.requestxlm.or' defaultMessage='Or' />
        </Text>
      </Separator>
      <QRCodeContainer>
        <ScanMessage>
          <Text size='14px'>
            <FormattedMessage
              id='modals.requestxlm.scan'
              defaultMessage='Scan QR Code:'
            />
            <TooltipHost id='reqXlmScan'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </Text>
        </ScanMessage>
        <QRCodeWrapper
          value={xlmURI}
          size={150}
          data-e2e='requestXlmAddressQrCode'
        />
      </QRCodeContainer>
      <Button
        type='submit'
        nature='primary'
        fullwidth
        data-e2e='requestXlmDoneButton'
      >
        <FormattedMessage id='modals.requestxlm.done' defaultMessage='Done' />
      </Button>
    </Form>
  )
}

RequestXlm.propTypes = {
  address: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestXlm', destroyOnUnmount: false })(
  RequestXlm
)
