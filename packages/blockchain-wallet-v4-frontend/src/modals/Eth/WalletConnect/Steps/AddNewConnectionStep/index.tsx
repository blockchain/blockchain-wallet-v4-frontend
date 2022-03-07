import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import { Form, TextBox } from 'components/Form'
import { model } from 'data'
import { required } from 'services/forms'

import { Props as OwnProps } from '../..'

const FormWrapper = styled(Form)`
  box-sizing: border-box;
  padding: 20px;
`
const StepText = styled(Text)`
  font-weight: 500;
  color: ${(props) => props.theme.grey800};
  font-size: 14px;
  line-height: 24px;
`

const AddNewConnectionStep: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => (
  <FlyoutContainer>
    <FlyoutHeader data-e2e='closeAddNewDapp' mode='close' onClick={props.handleClose}>
      <FormattedMessage id='scenes.walletconnect.connect_dapp' defaultMessage='Connect Dapp' />
    </FlyoutHeader>
    <FlyoutContent mode='top'>
      <FormWrapper>
        <Text weight={600} color='grey800' size='16px' style={{ marginBottom: '0.75rem' }}>
          <FormattedMessage
            id='scenes.walletconnect.connect_dapp.subtitle'
            defaultMessage='Complete the following steps to add a new Dapp connection'
          />
        </Text>
        <StepText>
          <FormattedMessage
            id='scenes.walletconnect.connect_dapp.step1'
            defaultMessage='1. Go to your desired Dapp and initiate a new wallet connection'
          />
        </StepText>
        <StepText>
          <FormattedMessage
            id='scenes.walletconnect.connect_dapp.step2'
            defaultMessage='2. From the connection options, select WalletConnect'
          />
        </StepText>
        <StepText>
          <FormattedMessage
            id='scenes.walletconnect.connect_dapp.step3'
            defaultMessage='3. While on the QR Code screen, click the "Copy to clipboard" button'
          />
        </StepText>
        <StepText style={{ marginBottom: '1.5rem' }}>
          <FormattedMessage
            id='scenes.walletconnect.connect_dapp.step4'
            defaultMessage='4. Paste the URL into the input below and press "Add Dapp"'
          />
        </StepText>
        <Field
          name='newConnectionString'
          validate={[required]}
          component={TextBox}
          data-e2e='newConnectionString'
          autoFocus
          placeholder='Paste URL'
        />
      </FormWrapper>
      <FlyoutFooter>
        <Button
          fullwidth
          disabled={props.invalid}
          height='48px'
          data-e2e='addConnection'
          nature='primary'
          // @ts-ignore
          onClick={props.walletConnectActions.addNewDappConnection}
          size='16px'
        >
          <FormattedMessage id='scenes.walletconnect.add_dapp' defaultMessage='Add Dapp' />
        </Button>
      </FlyoutFooter>
    </FlyoutContent>
  </FlyoutContainer>
)

type Props = OwnProps & { handleClose: () => void }

export default reduxForm({ form: model.components.walletConnect.WC_ADD_DAPP_FORM })(
  // @ts-ignore
  AddNewConnectionStep
)
