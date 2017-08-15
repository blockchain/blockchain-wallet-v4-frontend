import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { required, requiredNumber } from 'services/FormHelper'
import { Form, Modal, SecondaryButton, Text, TextArea, Tooltip } from 'blockchain-components'
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
    <Modal {...rest} icon='icon-receive' title='Request' size='large'>
      <Form>
        <Aligned>
          <Text id='modals.requestbitcoin.firststep.share' text='Copy & share address:' small medium />
          <Tooltip>
            <Text id='modals.requestbitcoin.firststep.share_tooltip1' text='Share this address with others, and they can send you BTC directly to your wallet.' smaller light />
            <Text id='modals.requestbitcoin.firststep.share_tooltip2' text='Your address changes with every payment.' smaller light />
            <Text id='modals.requestbitcoin.firststep.share_tooltip3' text='You can also create a request by attaching an amount below.' smaller light />
          </Tooltip>
        </Aligned>
        <CopyClipboard handleClickCode={handleClickCode} address={receiveAddress} />
        <SeparatorContainer>
          <Separator />
          <Text id='modals.requestbitcoin.firststep.or' text='Or' small light uppercase />
          <Separator />
        </SeparatorContainer>
        <Text id='modals.requestbitcoin.firststep.amount' text='Enter amount:' small medium />
        <Field name='amount' component={CoinConvertor} validate={[requiredNumber]} />
        <Text id='modals.requestbitcoin.firststep.to' text='Receive to:' small medium />
        <Field name='to' component={SelectBoxAddresses} validate={[required]} props={{ includeAll: false }} />
        <Text id='modals.requestbitcoin.firststep.description' text='Description:' small medium />
        <Field name='message' component={TextArea} validate={[required]} placeholder="What's this transaction for?" fullwidth />
        <SecondaryButton fullwidth onClick={next} disabled={submitting || invalid}>
          <Text id='modals.requestbitcoin.firststep.next' text='Next' small medium uppercase white />
        </SecondaryButton>
      </Form>
    </Modal>
  )
}

export default FirstStep
