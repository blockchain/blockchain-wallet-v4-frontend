import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required, validEtherAddress } from 'services/FormHelper'
import { Button, ButtonGroup, Text, Tooltip } from 'blockchain-info-components'
import { FiatConvertor, Form, SelectBoxCoin, TextBox, TextArea } from 'components/Form'
import QRCodeCapture from 'components/QRCodeCapture'
import ComboDisplay from 'components/Display/ComboDisplay'

const Currency = styled.div`
  width: 30%;
`
const ButtonRow = styled(ButtonGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  & > button:first-child { width: 100%; }
  & > button:last-child: { width: 200px; }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const DescriptionText = styled.div`
  margin-top: 20px;
`

const AmountText = styled.div`
  margin-top: 20px;
`

const validAmount = (value, allValues, props) => parseFloat(value) <= props.effectiveBalance ? undefined : `Use total available minus fee: ${props.effectiveBalance}`

const emptyAmount = (value, allValues, props) => !isEmpty(props.coins) ? undefined : 'Invalid amount. Account is empty.'

const FirstStep = props => {
  const { invalid, submitting, fee, handleSubmit } = props

  return (
    <Form onSubmit={handleSubmit}>
      <Currency>
        <Text size='14px' weight={500}>
          <FormattedMessage id='modals.sendether.firststep.coin' defaultMessage='Currency:' />
        </Text>
        <Field name='coin' component={SelectBoxCoin} validate={[required]} />
      </Currency>
      <Text size='14px' weight={500}>
        <FormattedMessage id='modals.sendether.firststep.to' defaultMessage='To:' />
      </Text>
      <Row>
        <Field name='to' component={TextBox} validate={[required, validEtherAddress]} />
        <QRCodeCapture coin='ETH' />
      </Row>
      <AmountText>
        <Text size='14px' weight={500}>
          <FormattedMessage id='modals.sendether.firststep.amount' defaultMessage='Enter amount:' />
        </Text>
      </AmountText>
      <Field name='amount' component={FiatConvertor} validate={[required, validAmount, emptyAmount]} coin='ETH' maxAvailable={props.effectiveBalance} />
      <DescriptionText>
        <Text size='14px' weight={500}>
          <FormattedMessage id='modals.sendether.firststep.description' defaultMessage='Description:' />
          <Tooltip>
            <FormattedMessage id='modals.sendether.firststep.share_tooltip1' defaultMessage='Add a note to remind yourself what this transaction relates to.' />
            <FormattedMessage id='modals.sendether.firststep.share_tooltip2' defaultMessage='This note will be private and only seen by you.' />
          </Tooltip>
        </Text>
      </DescriptionText>
      <Field name='message' component={TextArea} placeholder="What's this transaction for?" fullwidth />
      <Text size='14px' weight={500}>
        <FormattedMessage id='modals.sendether.firststep.fee' defaultMessage='Transaction fee :' />
      </Text>
      <Text weight={300}>
        <ComboDisplay coin='ETH'>{fee}</ComboDisplay>
      </Text>
      <ButtonRow>
        <Button type='submit' nature='primary' uppercase disabled={submitting || invalid}>
          <FormattedMessage id='modals.sendether.firststep.continue' defaultMessage='Continue' />
        </Button>
      </ButtonRow>
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  fee: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'sendEther', destroyOnUnmount: false })(FirstStep)
