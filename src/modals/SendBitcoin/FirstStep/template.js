import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { required } from 'services/FormHelper'
import Modal from 'components/generic/Modal'
import { SecondaryButton } from 'components/generic/Button'
import { Form, TextArea } from 'components/generic/Form'
import { Text } from 'components/generic/Text'
import { Tooltip } from 'components/generic/Tooltip'
import { CoinConvertor, DropdownAddresses } from 'components/shared/Form'

const Aligned = styled.div`
  & > * { display: inline-block; margin-right: 5px; }
`

const FirstStep = (props) => {
  const { show, next, submitting, invalid } = props

  return (
    <Modal icon='icon-send' title='Send' size='large' show={show}>
      <Form>
        <Text id='modals.sendbitcoin.firststep.from' text='From:' small medium />
        <Field name='from' component={DropdownAddresses} validate={[required]} includeAll={false} />
        <Text id='modals.sendbitcoin.firststep.to' text='To:' small medium />
        <Field name='to' component={DropdownAddresses} validate={[required]} includeAll={false} />
        <Text id='modals.sendbitcoin.firststep.amount' text='Enter amount:' small medium />
        <Field name='amount' component={CoinConvertor} validate={[required]} />
        <Aligned>
          <Text id='modals.drnfbitcoin.firststep.description' text='Description:' small medium />
          <Tooltip>
            <Text id='modals.requestbitcoin.firststep.share_tooltip1' text='Add a note to remind yourself what this transaction relates to.' smaller light />
            <Text id='modals.requestbitcoin.firststep.share_tooltip2' text='This note will be private and only seen by you.' smaller light />
          </Tooltip>
        </Aligned>
        <Field name='message' component={TextArea} validate={[required]} placeholder="What's this transaction for?" fullwidth />
        <SecondaryButton fullwidth onClick={next} disabled={submitting || invalid}>
          <Text id='modals.sendbitcoin.firststep.continue' text='Continue' small medium uppercase white />
        </SecondaryButton>
      </Form>
    </Modal>
  )
}

export default FirstStep
