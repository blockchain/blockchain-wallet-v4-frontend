import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'

import { required } from 'services/FormHelper'
import { Button, Text } from 'blockchain-info-components'
import { Form, FormGroup, FormLabel, FormItem, SelectBoxUSState } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
`
const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const SubHeader = styled.div`
  margin-top: 14px;
`
const SelectionContainer = styled.div`
  margin-top: 18px;
`
const SubmitButton = styled(Button)`
  margin-top: 16px;
`

const StateRegistrationStep = (props) => {
  const { handleSubmit, invalid, pristine, stateWhitelist } = props
  const onShapeshiftWhitelist = (val) => val && stateWhitelist.indexOf(val) >= 0 ? undefined : 'This service is not yet available in your state.'

  return (
    <Wrapper>
      <Header>
        <Text size='20px' weight={500} color='brand-primary'>
          <FormattedMessage id='scenes.exchange.shapeshift.stateregistration.header' defaultMessage='Simple. Seamless. Secure.' />
        </Text>
      </Header>
      <SubHeader>
        <Text size='14px' weight={300}>
          <FormattedMessage id='scenes.exchange.shapeshift.stateregistration.subheader' defaultMessage='Blockchain works with exchange partners to make exchanging coins in your wallet secure and seamless.' />
        </Text>
      </SubHeader>
      <SelectionContainer>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormItem>
              <FormLabel for='state'>
                <FormattedMessage id='scenes.exchange.shapeshift.stateregistration.selectstate' defaultMessage='Select your state of residency:' />
              </FormLabel>
              <Field name='state' validate={[required, onShapeshiftWhitelist]} component={SelectBoxUSState} />
            </FormItem>
          </FormGroup>
          <SubmitButton nature='primary' uppercase fullwidth type='submit' disabled={invalid || pristine}>
            <FormattedMessage id='scenes.exchange.shapeshift.stateregistration.continue' defaultMessage='Continue' />
          </SubmitButton>
        </Form>
      </SelectionContainer>
    </Wrapper>
  )
}

StateRegistrationStep.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  stateWhitelist: PropTypes.array.isRequired
}

export default reduxForm({ form: 'selectExchangeState' })(StateRegistrationStep)
