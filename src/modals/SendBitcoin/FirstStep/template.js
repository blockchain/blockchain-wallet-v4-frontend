import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { required, requiredNumber } from 'services/FormHelper'
import Modal from 'components/generic/Modal'
import { Button, SecondaryButton } from 'components/generic/Button'
import { Form, Hidden, TextBox, TextArea } from 'components/generic/Form'
import { Icon } from 'components/generic/Icon'
import { Link } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Tooltip } from 'components/generic/Tooltip'
import { CoinConvertor, SelectBoxAddresses } from 'components/shared/Form'
import ComboDisplay from 'components/shared/ComboDisplay'
import SelectBoxFee from './SelectBoxFee'
import qrCode from 'img/qr-code.png'

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
  width: 50%;
`
const ColRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: 50%;
`
const AddressesToContainer = styled.div`
  display: flex;
  align-items: center;
`
const QrCodeCaptureToggle = styled.img.attrs({ src: qrCode })`height: 18px;`
const AddressesSelectToggle = styled(Icon).attrs({ name: 'icon-down_arrow' })`font-size: 0.6rem;`
const AddressesEditToggle = styled(Icon).attrs({ name: 'ti-pencil' })`font-size: 1rem;`
const AddressesToButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  margin: 0;
  border-radius: 0;
`

const FirstStep = (props) => {
  const validateAmount = (value, allValues, props) => {
    return value <= allValues.effectiveBalance ? undefined : `Invalid amount. Available : ${allValues.effectiveBalance}`
  }
  const { addressSelectToggled, addressSelectOpened, feeEditToggled, selection, next, invalid, submitting,
    handleClickQrCodeCapture, handleClickAddressToggler, handleClickFeeToggler, ...rest } = props

  return (
    <Modal {...rest} icon='icon-send' title='Send' size='large'>
      <Form>
        <Text id='modals.sendbitcoin.firststep.from' text='From:' small medium />
        <Field name='from' component={SelectBoxAddresses} validate={[required]} props={{ includeAll: false }} />
        <Text id='modals.sendbitcoin.firststep.to' text='To:' small medium />
        {addressSelectToggled
          ? (
            <AddressesToContainer>
              <Field name='to' component={SelectBoxAddresses} validate={[required]} props={{ opened: addressSelectOpened, includeAll: false }} />
              <AddressesToButton onClick={handleClickQrCodeCapture}><QrCodeCaptureToggle /></AddressesToButton>
              <AddressesToButton onClick={handleClickAddressToggler}><AddressesEditToggle /></AddressesToButton>
            </AddressesToContainer>
          ) : (
            <AddressesToContainer>
              <Field name='to' component={TextBox} validate={[required]} />
              <AddressesToButton onClick={handleClickQrCodeCapture}><QrCodeCaptureToggle /></AddressesToButton>
              <AddressesToButton onClick={handleClickAddressToggler}><AddressesSelectToggle /></AddressesToButton>
            </AddressesToContainer>
            )
        }
        <Text id='modals.sendbitcoin.firststep.amount' text='Enter amount:' small medium />
        <Field name='amount' component={CoinConvertor} validate={[requiredNumber, validateAmount]} />
        <Field name='effectiveBalance' component={Hidden} />
        <Aligned>
          <Text id='modals.sendbitcoin.firststep.description' text='Description:' small medium />
          <Tooltip>
            <Text id='modals.sendbitcoin.firststep.share_tooltip1' text='Add a note to remind yourself what this transaction relates to.' smaller light />
            <Text id='modals.sendbitcoin.firststep.share_tooltip2' text='This note will be private and only seen by you.' smaller light />
          </Tooltip>
        </Aligned>
        <Field name='message' component={TextArea} placeholder="What's this transaction for?" fullwidth />
        <Aligned>
          <Text id='modals.sendbitcoin.firststep.fee' text='Transaction fee:' small medium capitalize />
          <Tooltip>
            <Text id='modals.sendbitcoin.firststep.fee_tooltip' text='Estimated confirmation time 1+ hour.' smaller light />
          </Tooltip>
        </Aligned>
        <Row>
          <ColLeft>
            {feeEditToggled
              ? <Field name='fee' component={TextBox} validate={[required]} />
              : <Field name='fee' component={SelectBoxFee} validate={[required]} />
            }
          </ColLeft>
          <ColRight>
            { invalid ? <div /> : <ComboDisplay small light>{selection.fee}</ComboDisplay> }
            <Link onClick={handleClickFeeToggler}>
              {feeEditToggled
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

FirstStep.propTypes = {
  addressesSelectToggled: PropTypes.bool.isRequired,
  feeEditToggled: PropTypes.bool.isRequired,
  handleClickQrCodeCapture: PropTypes.func.isRequired,
  handleClickAddressToggler: PropTypes.func.isRequired,
  handleClickFeeToggler: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired
}

export default FirstStep
