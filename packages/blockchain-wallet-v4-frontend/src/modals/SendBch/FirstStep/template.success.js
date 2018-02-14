import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, ButtonGroup, Icon, Text, Tooltip } from 'blockchain-info-components'
import { FiatConvertor, Form, SelectBoxBitcoinAddresses, SelectBoxCoin, TextBox, TextArea } from 'components/Form'
import ComboDisplay from 'components/Display/ComboDisplay'
import QRCodeCapture from 'components/QRCodeCapture'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const ColOne = styled.div`
  width: 50%;
  margin-right: 5px;
  @media(min-width: 992px) { width: 30%; }
`
const ColTwo = styled.div`
  width: 50%;
  @media(min-width: 992px) { width: 70%; }
`
const ColLeft = styled.div`
  width: 50%;
`
const ColRight = ColLeft.extend`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`
const AddressButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};

  &:hover { background-color: ${props => props.theme['gray-1']}; }
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

const DescriptionText = styled.div`
  margin-top: 20px;
`

const AmountText = styled.div`
  margin-top: 20px;
`

const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
  if (initialRender) { return true }
  return initialRender || !structure.deepEqual(values, nextProps.values) || props.effectiveBalance !== nextProps.effectiveBalance
}

const validAmount = (value, allValues, props) => parseFloat(value) <= props.effectiveBalance ? undefined : `Use total available minus fee: ${props.effectiveBalance}`

const emptyAmount = (value, allValues, props) => !isEmpty(props.coins) ? undefined : 'Invalid amount. Account is empty.'

const FirstStep = props => {
  const { invalid, submitting, addressSelectToggled, addressSelectOpened, selection, fee, ...rest } = props
  const { handleSubmit, handleClickAddressToggler } = rest

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <ColOne>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendbch.firststep.coin' defaultMessage='Currency:' />
          </Text>
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </ColOne>
        <ColTwo>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendbch.firststep.from' defaultMessage='From:' />
          </Text>
          <Field name='from' component={SelectBoxBitcoinAddresses} validate={[required]} props={{ includeAll: false }} />
        </ColTwo>
      </Row>
      <Text size='14px' weight={500}>
        <FormattedMessage id='modals.sendbch.firststep.to' defaultMessage='To:' />
      </Text>
      <Row>
        {addressSelectToggled
          ? <Field name='to' component={SelectBoxBitcoinAddresses} validate={[required]} props={{ opened: addressSelectOpened, includeAll: false }} />
          : <Field name='to2' component={TextBox} validate={[required]} />
        }
        <QRCodeCapture coin='BCH' />
        {addressSelectToggled
          ? <AddressButton onClick={handleClickAddressToggler}><Icon name='pencil' size='16px' cursor /></AddressButton>
          : <AddressButton onClick={handleClickAddressToggler}><Icon name='down-arrow' size='10px' cursor /></AddressButton>
        }
      </Row>
      <AmountText>
        <Text size='14px' weight={500}>
          <FormattedMessage id='modals.sendbch.firststep.amount' defaultMessage='Enter amount:' />
        </Text>
      </AmountText>
      <Field name='amount' component={FiatConvertor} validate={[required, validAmount, emptyAmount]} coin='BCH' maxAvailable={props.effectiveBalance} />
      <DescriptionText>
        <Text size='14px' weight={500}>
          <FormattedMessage id='modals.sendbch.firststep.description' defaultMessage='Description:' />
          <Tooltip>
            <FormattedMessage id='modals.sendbch.firststep.share_tooltip1' defaultMessage='Add a note to remind yourself what this transaction relates to.' />
            <FormattedMessage id='modals.sendbch.firststep.share_tooltip2' defaultMessage='This note will be private and only seen by you.' />
          </Tooltip>
        </Text>
      </DescriptionText>
      <Field name='message' component={TextArea} placeholder="What's this transaction for?" fullwidth />
      <Text size='14px' weight={500}>
        <FormattedMessage id='modals.sendbch.firststep.fee' defaultMessage='Transaction fee (sat/b) :' />
        <Tooltip>
          <FormattedMessage id='modals.sendbch.firststep.fee_tooltip' defaultMessage='Estimated confirmation time 1+ hour.' />
        </Tooltip>
      </Text>
      <Row>
        <ColLeft>
          <ComboDisplay coin='BCH'>{fee}</ComboDisplay>
        </ColLeft>
        <ColRight />
      </Row>
      <ButtonRow>
        <Button type='submit' nature='primary' uppercase disabled={submitting || invalid}>
          <FormattedMessage id='modals.sendbch.firststep.continue' defaultMessage='Continue' />
        </Button>
      </ButtonRow>
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  addressSelectToggled: PropTypes.bool.isRequired,
  addressSelectOpened: PropTypes.bool.isRequired,
  // selection: PropTypes.object.isRequired,
  fee: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClickAddressToggler: PropTypes.func.isRequired
}

export default reduxForm({ form: 'sendBch', shouldValidate, destroyOnUnmount: false })(FirstStep)
