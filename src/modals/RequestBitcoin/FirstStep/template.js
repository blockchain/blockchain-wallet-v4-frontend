import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required, requiredNumber } from 'services/FormHelper'
import { Button, Form, Modal, TextArea, Tooltip } from 'blockchain-info-components'
import { CoinConvertor, SelectBoxAddresses } from 'components/shared/Form'
import CopyClipboard from './CopyClipboard'

const Separator = styled.div`
  flex-grow: 10;
  height: 1px;
  width: 100%;
  background-color: #EFEFEF;
`
const SeparatorContainer = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
  padding: 15px 0;
  & :first-child { margin-right: 5px; }
  & :last-child { margin-left: 5px; }
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
          <FormattedMessage id='modals.requestbitcoin.firststep.share' defaultMessage='Copy & share address:' />
          <Tooltip>
            <FormattedMessage id='modals.requestbitcoin.firststep.share_tooltip1' defaultMessage='Share this address with others, and they can send you BTC directly to your wallet.' />
            <FormattedMessage id='modals.requestbitcoin.firststep.share_tooltip2' defaultMessage='Your address changes with every payment.' />
            <FormattedMessage id='modals.requestbitcoin.firststep.share_tooltip3' defaultMessage='You can also create a request by attaching an amount below.' />
          </Tooltip>
        </Aligned>
        <CopyClipboard handleClickCode={handleClickCode} address={receiveAddress} />
        <SeparatorContainer>
          <Separator />
          <FormattedMessage id='modals.requestbitcoin.firststep.or' defaultMessage='Or' />
          <Separator />
        </SeparatorContainer>
        <FormattedMessage id='modals.requestbitcoin.firststep.amount' defaultMessage='Enter amount:' />
        <Field name='amount' component={CoinConvertor} validate={[requiredNumber]} />
        <FormattedMessage id='modals.requestbitcoin.firststep.to' defaultMessage='Receive to:' />
        <Field name='to' component={SelectBoxAddresses} validate={[required]} props={{ includeAll: false }} />
        <FormattedMessage id='modals.requestbitcoin.firststep.description' defaultMessage='Description:' />
        <Field name='message' component={TextArea} validate={[required]} placeholder="What's this transaction for?" fullwidth />
        <Button type='secondary' fullwidth onClick={next} disabled={submitting || invalid}>
          <FormattedMessage id='modals.requestbitcoin.firststep.next' defaultMessage='Next' />
        </Button>
      </Form>
    </Modal>
  )
}

export default FirstStep
