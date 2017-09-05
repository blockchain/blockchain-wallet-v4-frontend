import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required, requiredNumber } from 'services/FormHelper'
import { Button, Modal, Separator, Text, Tooltip } from 'blockchain-info-components'
import { CoinConvertor, Form, SelectBoxAddresses, TextArea } from 'components/Form'
import CopyClipboard from './CopyClipboard'

const SeparatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;

  & > :first-child { width: 45%; }
  & > :last-child { width: 45%; }
`
const Aligned = styled.div`
  & > * { display: inline-block; margin-right: 5px; }
`

const FirstStep = (props) => {
  const { next, submitting, invalid, receiveAddress, handleClickCode, ...rest } = props

  return (
    <Modal {...rest} icon='receive' title='Request' size='large'>
      <Form>
        <Aligned>
          <Text size='14px' weight={500} capitalize>
            <FormattedMessage id='modals.requestbitcoin.firststep.share' defaultMessage='Copy & share address:' />
          </Text>
          <Tooltip>
            <FormattedMessage id='modals.requestbitcoin.firststep.share_tooltip1' defaultMessage='Share this address with others, and they can send you BTC directly to your wallet.' />
            <FormattedMessage id='modals.requestbitcoin.firststep.share_tooltip2' defaultMessage='Your address changes with every payment.' />
            <FormattedMessage id='modals.requestbitcoin.firststep.share_tooltip3' defaultMessage='You can also create a request by attaching an amount below.' />
          </Tooltip>
        </Aligned>
        <CopyClipboard handleClickCode={handleClickCode} address={receiveAddress} />
        <SeparatorContainer>
          <Separator />
          <Text size='14px' weight={300} uppercase>
            <FormattedMessage id='modals.requestbitcoin.firststep.or' defaultMessage='Or' />
          </Text>
          <Separator />
        </SeparatorContainer>
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
    </Modal>
  )
}

export default FirstStep
