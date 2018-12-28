import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import QRCodeWrapper from 'components/QRCodeWrapper'

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
  margin-top: 5px;
  .link {
    cursor: pointer;
    text-decoration: underline;
    color: ${props => props.theme['brrand-primary']};
  }
`

const RequestEth = props => {
  const {
    handleSubmit,
    handleOpenLockbox,
    address,
    type,
    excludeLockbox
  } = props

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'20px'}>
        <FormItem>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.requestether.coin'
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
        <FormItem>
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
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.requestether.share'
              defaultMessage='Copy & Share Address:'
            />
            <TooltipHost id='reqEthShare'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </FormLabel>
        </FormItem>
        <AddressContainer>
          <CopyClipboard address={address} data-e2e='requestEth' />
        </AddressContainer>
      </FormGroup>
      {type === 'LOCKBOX' && (
        <BannerContainer onClick={handleOpenLockbox}>
          <Banner type='alert'>
            <FormattedHTMLMessage
              id='modals.requestether.firststep.lockbox'
              defaultMessage='Please confirm this address on your lockbox device by opening your Ethereum app. <span class="link">Click here</span> once the Ethereum app has been opened.'
            />
          </Banner>
        </BannerContainer>
      )}
      <Separator margin={'20px 0'}>
        <Text size='14px' weight={300} uppercase>
          <FormattedMessage id='modals.requestether.or' defaultMessage='Or' />
        </Text>
      </Separator>
      <QRCodeContainer>
        <ScanMessage>
          <Text size='14px'>
            <FormattedMessage
              id='modals.requestether.scan'
              defaultMessage='Scan QR Code:'
            />
            <TooltipHost id='reqEthScan'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </Text>
        </ScanMessage>
        <QRCodeWrapper value={address} size={150} />
      </QRCodeContainer>
      <Button
        type='submit'
        nature='primary'
        data-e2e='requestEthDoneButton'
        fullwidth
      >
        <FormattedMessage id='modals.requestether.done' defaultMessage='Done' />
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
