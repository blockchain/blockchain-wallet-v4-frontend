import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as bowser from 'bowser'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import QRCodeReact from 'qrcode.react'

import { required } from 'services/FormHelper'
import {
  Banner,
  Button,
  Separator,
  Text,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'
import {
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxBCHAddresses,
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
  margin: -8px 0 10px;
`
const RequestBch = props => {
  const { submitting, invalid, handleSubmit, receiveAddress, to } = props
  const disableLockboxReceive =
    to.type === 'LOCKBOX' &&
    !(bowser.name === 'Chrome' || bowser.name === 'Chromium')

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'20px'}>
        <FormItem>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.requestbch.coin'
              defaultMessage='Currency:'
            />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </FormItem>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.requestbch.firststep.to'
              defaultMessage='Receive to:'
            />
          </FormLabel>
          <Field
            name='to'
            coin='BCH'
            component={SelectBoxBCHAddresses}
            includeAll={false}
            validate={[required]}
          />
        </FormItem>
      </FormGroup>
      {disableLockboxReceive ? (
        <BannerContainer>
          <Banner type='warning'>
            <Text color='warning' size='12px'>
              <FormattedMessage
                id='modals.requestbch.firststep.lockboxwarn'
                defaultMessage='Requesting Bitcoin Cash to Lockbox can only be done while using the Chrome browser'
              />
            </Text>
          </Banner>
        </BannerContainer>
      ) : (
        <React.Fragment>
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
                <CopyClipboard address={receiveAddress} />
              </AddressContainer>
            </FormItem>
          </FormGroup>
          <Separator margin={'20px 0'}>
            <Text size='14px' weight={300} uppercase>
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
            <QRCodeReact value={receiveAddress} size={150} />
          </QRCodeContainer>
        </React.Fragment>
      )}
      <Button
        type='submit'
        nature='primary'
        fullwidth
        uppercase
        disabled={submitting || invalid || disableLockboxReceive}
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
