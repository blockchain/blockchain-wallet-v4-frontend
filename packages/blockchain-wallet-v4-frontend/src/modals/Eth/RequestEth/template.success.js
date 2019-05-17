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
  SelectBoxCoin,
  SelectBoxEthAddresses
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

const RequestEth = props => {
  const {
    address,
    coin,
    excludeLockbox,
    handleSubmit,
    handleOpenLockbox,
    isErc20,
    type
  } = props
  const isLockboxAcct = type === 'LOCKBOX'
  const browser = Bowser.getParser(window.navigator.userAgent)
  const warnLockboxReceive = !browser.satisfies({
    chrome: '>45',
    chromium: '>45',
    firefox: '>45',
    opera: '>20'
  })

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'20px'}>
        <FormItem data-e2e='currencySelectDropdown'>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.requesteth.coin'
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
              id='modals.requesteth.firststep.to'
              defaultMessage='Receive to:'
            />
          </FormLabel>
          <Field
            name='to'
            component={SelectBoxEthAddresses}
            includeAll={false}
            validate={[required]}
            excludeLockbox={excludeLockbox}
            coin={coin}
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.requesteth.share'
              defaultMessage='Copy & Share Address:'
            />
            {isErc20 ? (
              <TooltipHost id='requestpax.shareaddress'>
                <TooltipIcon name='question-in-circle' />
              </TooltipHost>
            ) : (
              <TooltipHost id='requesteth.shareaddress'>
                <TooltipIcon name='question-in-circle' />
              </TooltipHost>
            )}
          </FormLabel>
        </FormItem>
        <AddressContainer>
          <CopyClipboard address={address} data-e2e='requestEth' />
        </AddressContainer>
      </FormGroup>
      {isLockboxAcct && (
        <BannerContainer>
          <Banner type='info'>
            {warnLockboxReceive ? (
              <Text color='warning' size='12px'>
                <FormattedHTMLMessage
                  id='modals.requesteth.firststep.lockbox.confirm.warnbrowser'
                  defaultMessage='Unsupported browser to confirm the receive address on your Lockbox.  Please use the Brave, Chrome, Firefox or Opera browsers to confirm or continue without confirming the address at your own risk.'
                />
              </Text>
            ) : (
              <TextGroup inline>
                <Text color='warning' size='12px'>
                  <FormattedHTMLMessage
                    id='modals.requesteth.firststep.lockbox.confirm1'
                    defaultMessage='Please confirm the address above on your Lockbox by opening your Ethereum app now.'
                  />
                </Text>
                <Text size='12px' onClick={handleOpenLockbox}>
                  <span className='link'>
                    <FormattedHTMLMessage
                      id='modals.requesteth.firststep.lockbox.clickhere'
                      defaultMessage='Click here'
                    />
                  </span>
                </Text>
                <Text color='warning' size='12px'>
                  <FormattedHTMLMessage
                    id='modals.requesteth.firststep.lockbox.confirm2'
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
          <FormattedMessage id='modals.requesteth.or' defaultMessage='Or' />
        </Text>
      </Separator>
      <QRCodeContainer>
        <ScanMessage>
          <Text size='14px'>
            <FormattedMessage
              id='modals.requesteth.scan'
              defaultMessage='Scan QR Code:'
            />
            {isErc20 ? (
              <TooltipHost id='requestpax.qrcode'>
                <TooltipIcon name='question-in-circle' />
              </TooltipHost>
            ) : (
              <TooltipHost id='requesteth.qrcode'>
                <TooltipIcon name='question-in-circle' />
              </TooltipHost>
            )}
          </Text>
        </ScanMessage>
        <QRCodeWrapper
          value={address}
          size={150}
          data-e2e='requestEthAddressQrCode'
        />
      </QRCodeContainer>
      <Button
        type='submit'
        nature='primary'
        data-e2e='requestEthDoneButton'
        fullwidth
      >
        <FormattedMessage id='modals.requesteth.done' defaultMessage='Done' />
      </Button>
    </Form>
  )
}

RequestEth.propTypes = {
  address: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestEth', destroyOnUnmount: false })(
  RequestEth
)
