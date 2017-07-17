import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { required, requiredNumber } from 'services/FormHelper'
import Modal from 'components/generic/Modal'
import { SecondaryButton } from 'components/generic/Button'
import { Form, TextBox, TextArea } from 'components/generic/Form'
import { Link } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Tooltip } from 'components/generic/Tooltip'
import { CoinConvertor, SelectBoxAddresses } from 'components/shared/Form'
import ComboDisplay from 'components/shared/ComboDisplay'
import SelectBoxFee from './SelectBoxFee'

const Aligned = styled.div`
  & > * { display: inline-block; margin-right: 5px; }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`
const ColLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
`
const ColRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: 40%;
`

const FirstStep = (props) => {
  const { show, next, submitting, invalid, editDisplayed, handleClickEdit, fee } = props

  return (
    <Modal icon='icon-send' title='Send' size='large' show={show}>
      <Form>
        <Text id='modals.sendbitcoin.firststep.from' text='From:' small medium />
        <Field name='from' component={SelectBoxAddresses} validate={[required]} includeAll={false} />
        <Text id='modals.sendbitcoin.firststep.to' text='To:' small medium />
        <Field name='to' component={SelectBoxAddresses} validate={[required]} includeAll={false} />
        <Text id='modals.sendbitcoin.firststep.amount' text='Enter amount:' small medium />
        <Field name='amount' component={CoinConvertor} validate={[requiredNumber]} />
        <Aligned>
          <Text id='modals.sendbitcoin.firststep.description' text='Description:' small medium />
          <Tooltip>
            <Text id='modals.sendbitcoin.firststep.share_tooltip1' text='Add a note to remind yourself what this transaction relates to.' smaller light />
            <Text id='modals.sendbitcoin.firststep.share_tooltip2' text='This note will be private and only seen by you.' smaller light />
          </Tooltip>
        </Aligned>
        <Field name='message' component={TextArea} validate={[required]} placeholder="What's this transaction for?" fullwidth />
        <Aligned>
          <Text id='modals.sendbitcoin.firststep.fee' text='Transaction fee:' small medium capitalize />
          <Tooltip>
            <Text id='modals.sendbitcoin.firststep.fee_tooltip' text='Estimated confirmation time 1+ hour.' smaller light />
          </Tooltip>
        </Aligned>
        <Row>
          <ColLeft>
            { editDisplayed
              ? <Field name='fee' component={TextBox} validate={[required]} />
              : <Field name='fee' component={SelectBoxFee} validate={[required]} />
            }
          </ColLeft>
          <ColRight>
            <ComboDisplay small light>{fee}</ComboDisplay>
            <Link fullWidth onClick={handleClickEdit}>
              { editDisplayed
                ? <Text id='modals.sendbitcoin.firststep.cancel' text='Cancel' smaller light cyan capitalize />
                : <Text id='modals.sendbitcoin.firststep.edit' text='Customize fee' smaller light cyan capitalize />
              }
            </Link>
          </ColRight>
        </Row>
        <SecondaryButton fullwidth onClick={next} disabled={submitting || invalid}>
          <Text id='modals.sendbitcoin.firststep.continue' text='Continue' small medium uppercase white />
        </SecondaryButton>
      </Form>
    </Modal>
  )
}

export default FirstStep
