import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required, requiredNumber } from 'services/FormHelper'
import { Button, Modal, ModalHeader, ModalBody, Separator, Text, Tooltip } from 'blockchain-info-components'
import { CoinConvertor, Form, SelectBoxAddresses, TextArea } from 'components/Form'
import CopyClipboard from './CopyClipboard'

const FirstStep = (props) => {
  const { next, submitting, invalid, receiveAddress, handleClickCode, position, total, closeAll } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='request' onClose={closeAll}>
        <FormattedMessage id='modals.requestbitcoin.firststep.title' defaultMessage='Request' />
      </ModalHeader>
      <ModalBody>
        <Form>
          <Text size='14px' weight={500} capitalize>
            <FormattedMessage id='modals.requestbitcoin.firststep.share' defaultMessage='Copy & share address:' />
            <Tooltip>
              <FormattedMessage id='modals.requestbitcoin.firststep.share_tooltip1' defaultMessage='Share this address with others, and they can send you BTC directly to your wallet.' />
              <FormattedMessage id='modals.requestbitcoin.firststep.share_tooltip2' defaultMessage='Your address changes with every payment.' />
              <FormattedMessage id='modals.requestbitcoin.firststep.share_tooltip3' defaultMessage='You can also create a request by attaching an amount below.' />
            </Tooltip>
          </Text>
          <CopyClipboard handleClickCode={handleClickCode} address={receiveAddress} />
          <Separator>
            <Text size='14px' weight={300} uppercase>
              <FormattedMessage id='modals.requestbitcoin.firststep.or' defaultMessage='Or' />
            </Text>
          </Separator>
          <Text size='14px' weight={500} capitalize>
            <FormattedMessage id='modals.requestbitcoin.firststep.amount' defaultMessage='Enter amount:' />
          </Text>
          <Field name='amount' component={CoinConvertor} validate={[requiredNumber]} />
          <Text size='14px' weight={500} capitalize>
            <FormattedMessage id='modals.requestbitcoin.firststep.to' defaultMessage='Receive to:' />
          </Text>
          <Field name='to' component={SelectBoxAddresses} validate={[required]} props={{ includeAll: false }} />
          <Text size='14px' weight={500} capitalize>
            <FormattedMessage id='modals.requestbitcoin.firststep.description' defaultMessage='Description:' />
          </Text>
          <Field name='message' component={TextArea} validate={[required]} placeholder="What's this transaction for?" />
          <Button nature='secondary' fullwidth uppercase onClick={next} disabled={submitting || invalid}>
            <FormattedMessage id='modals.requestbitcoin.firststep.next' defaultMessage='Next' />
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default FirstStep
