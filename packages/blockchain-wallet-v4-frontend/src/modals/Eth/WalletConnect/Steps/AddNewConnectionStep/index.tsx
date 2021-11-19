import React from 'react'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'
import { model } from 'data'
import { required } from 'services/forms'

const Wrapper = styled(Form)`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AddNewConnectionStep = (props) => {
  return (
    <Wrapper>
      <Text weight={600} color='grey900' size='20px' style={{ marginBottom: '1rem' }}>
        Copy and paste the connection string below from desired Dapp.
      </Text>
      <Field
        name='newConnectionString'
        validate={[required]}
        component={TextBox}
        data-e2e='newConnectionString'
        autoFocus
        placeholder='Enter connection string'
      />

      <Button
        fullwidth
        disabled={props.invalid}
        height='48px'
        data-e2e='addConnection'
        nature='primary'
        size='16px'
        onClick={props.walletConnectActions.addNewDappConnection}
      >
        Add Connection
      </Button>
    </Wrapper>
  )
}

export default reduxForm({ form: model.components.walletConnect.WC_ADD_DAPP_FORM })(
  AddNewConnectionStep
)
