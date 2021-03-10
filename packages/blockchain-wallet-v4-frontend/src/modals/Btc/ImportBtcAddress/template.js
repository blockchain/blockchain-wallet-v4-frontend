import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import {
  Form,
  FormGroup,
  FormItem,
  SelectBoxBtcAddresses,
  TextBox
} from 'components/Form'
import QRCodeCapture from 'components/QRCode/Capture'
import { required, validBtcPrivateKey } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { spacing } from 'services/styles'

const Wrapper = styled.div`
  font-weight: 400;
  color: ${props => props.theme.grey700};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const LabelText = styled(Text)`
  margin-bottom: 9px;
`
const ImportFormItem = styled(FormItem)`
  margin-bottom: 32px;
`
const BorderRow = styled(Row)`
  input {
    border-radius: 8px 0 0 8px;
  }

  > div {
    border-radius: 0 8px 8px 0;
  }
`
const Tooltip = styled(TooltipHost)`
  & > span {
    font-size: 12px;
  }
`
const Label = styled.label`
  display: flex;
`
const ImportHeader = styled(ModalHeader)`
  border-bottom: 0;
  padding-bottom: 8px;

  > div:first-child * {
    font-weight: 500;
    color: ${props => props.theme.grey800};
  }
`
const ImportFooter = styled(ModalFooter)`
  border-top: 0;
`

const ImportBtcAddress = ({
  handleSubmit,
  invalid,
  onClose,
  position,
  priv,
  submitting
}) => (
  <Modal size='large' position={position}>
    <Form onSubmit={handleSubmit}>
      <Wrapper>
        <ImportHeader onClose={onClose}>
          <FormattedMessage
            id='modals.importkey.import'
            defaultMessage='Import Private Key'
          />
        </ImportHeader>
        <ModalBody>
          <FormGroup>
            <ImportFormItem width={'100%'}>
              <Label htmlFor='addrOrPriv'>
                <LabelText color='grey600' size='14px' weight={500}>
                  <FormattedMessage
                    id='modals.importkey.label.privatekey'
                    defaultMessage='Enter your private key'
                  />
                </LabelText>
                <Tooltip
                  id='import.privatekeys'
                  data-place='right'
                  style={{ marginTop: '3px' }}
                >
                  <TooltipIcon name='info' />
                </Tooltip>
              </Label>
              <BorderRow>
                <Field
                  name='addrOrPriv'
                  validate={[validBtcPrivateKey, required]}
                  normalize={removeWhitespace}
                  component={TextBox}
                  data-e2e='privateKeyInput'
                />
                <QRCodeCapture
                  scanType='btcPrivOrAddress'
                  border={['top', 'bottom', 'right']}
                />
              </BorderRow>
            </ImportFormItem>
            <ImportFormItem width={'100%'}>
              <Label htmlFor='addrOrPriv'>
                <LabelText color='grey600' size='14px' weight={500}>
                  <FormattedMessage
                    id='modals.importkey.label.enterlabel'
                    defaultMessage='Enter a label (optional)'
                  />
                </LabelText>
              </Label>
              <Row>
                <Field
                  name='label'
                  validate={[]}
                  component={TextBox}
                  data-e2e='labelInput'
                />
              </Row>
            </ImportFormItem>
            <ImportFormItem style={spacing('mt-10')}>
              <Label htmlFor='wallets'>
                <LabelText color='grey600' size='14px' weight={500}>
                  <FormattedMessage
                    id='modals.importkey.label.transferfunds'
                    defaultMessage='Transfer funds to an existing wallet (optional)'
                  />
                </LabelText>
              </Label>
              <Row>
                <Field
                  name='to'
                  component={SelectBoxBtcAddresses}
                  optional
                  excludeImported
                  includeAll={false}
                  disabled={!priv}
                />
              </Row>
            </ImportFormItem>
          </FormGroup>
        </ModalBody>

        <ImportFooter align='right'>
          <Button
            type='submit'
            nature='primary'
            capitalize
            disabled={submitting || invalid}
            data-e2e='importButton'
          >
            <FormattedMessage
              id='modals.importkey.import'
              defaultMessage='Import Private Key'
            />
          </Button>
        </ImportFooter>
      </Wrapper>
    </Form>
  </Modal>
)

export default reduxForm({
  form: 'importBtcAddress',
  initialValues: { 'address-type': '' }
})(ImportBtcAddress)
