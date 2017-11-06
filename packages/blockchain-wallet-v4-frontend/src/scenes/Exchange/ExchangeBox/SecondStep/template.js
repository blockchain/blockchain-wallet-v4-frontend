import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Link, Text, Tooltip } from 'blockchain-info-components'
import { CheckBox, Form } from 'components/Form'
import Terms from 'components/Terms'

const Wrapper = styled.div`
  border: 1px solid black;
`

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

const Body = styled.div`
  padding: 20px 30px;
`

const ExpiryText = styled(Text)`
  display: flex;
  justify-content: flex-end;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0px 20px 20px 20px;
`

const RecapTable = styled.div``

const SecondStep = (props) => {
  const { previousStep, position, total, close, submitting, invalid, ...rest } = props
  const { onSubmit } = rest
  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
        <Header>
          <Text>
            <FormattedMessage id='scenes.exchange.exchangebox.firststep.title' defaultMessage='Confirm Exchange Order' />
          </Text>
          <Text weight={300}>
            <FormattedMessage id='scenes.exchange.exchangebox.firststep.stepnumber' defaultMessage='Step 2 of 2' />
          </Text>
        </Header>
        <Body>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.exchange.exchangebox.secondstep.recap' defaultMessage='x BTC will be sent directly from Mon portefeuille bitcoin and exchanged for y ETH to be deposited into My Ether Wallet. The process can take up to two hours and you can keep track of your Exchange progress in the Order History tab.' />
          </Text>
          <ExpiryText size='13px' weight={300}>
            <FormattedMessage id='scenes.exchange.exchangebox.secondstep.expiry' defaultMessage='Quote expires in: TIME' />
            <Tooltip>
              <FormattedMessage id='scenes.exchange.exchangebox.secondstep.expiryexplanation' defaultMessage='This rate will expire after 10 minutes. If that happens please restart your trade.' />
            </Tooltip>
          </ExpiryText>
          <RecapTable>
            Recap table
          </RecapTable>
          <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
            <Text size='12px' weight={300}>
              <Terms company='shapeshift' />
            </Text>
          </Field>
        </Body>
        <Footer align='spaced'>
          <Link size='13px' weight={300} onClick={previousStep}>
            <FormattedMessage id='scenes.exchange.exchangebox.secondstep.back' defaultMessage='Cancel' />
          </Link>
          <Button type='submit' nature='primary' disabled={submitting || invalid}>
            <FormattedMessage id='scenes.exchange.exchangebox.secondstep.finish' defaultMessage='Confirm' />
          </Button>
        </Footer>
      </Form>
    </Wrapper>
  )
}

SecondStep.propTypes = {
  previousStep: PropTypes.func.isRequired
}

export default reduxForm({ form: 'recoveryPhrase' })(SecondStep)
