import React from 'react'
import styled from 'styled-components'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Text, Button } from 'blockchain-info-components'
import { required, onSfoxWhitelist, onPartnerCountryWhitelist } from 'services/FormHelper'
import { FormGroup, FormItem, SelectBoxUSState, SelectBoxCountry } from 'components/Form'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
const ColLeft = styled.div`
  width: 50%;
`
const ColRight = styled.div`
  width: 50%;
`
const PartnerHeader = styled.div`
  font-size: 30px;
  font-weight: 600;
`
const PartnerSubHeader = styled.div`
  margin-top: 5px;
  font-size: 14px;
`
const Intro = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const SelectionContainer = Intro.extend`
  margin-top: 40px;
`
const FieldWrapper = Intro.extend`
  margin-top: 20px;
  width: 50%;
`

const SelectPartner = (props) => {
  const { onSubmit, invalid, pristine, country } = props

  return (
    <Row>
      <ColLeft>
        placeholder
      </ColLeft>
      <ColRight>
        <Intro>
          <PartnerHeader>
            <FormattedMessage id='selectpartner.header' defaultMessage='Introducing Marketplace.' />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='selectpartner.subheader' defaultMessage='We believe that buying and selling cryptocurrency can be both secure and easy. We’ve partnered with leading exchanges to create a place where you can buy bitcoin, ethereum, and bitcoin cash with any currency – all within the Blockchain platform.' />
          </PartnerSubHeader>
        </Intro>
        <SelectionContainer>
          <Text>
            <FormattedMessage id='selectpartner.residence' defaultMessage='Get started by selecting your place of residence.' />
          </Text>
          <FieldWrapper>
            <form onSubmit={onSubmit}>
              <FormGroup>
                <FormItem>
                  <Field name='country' validate={[required, onPartnerCountryWhitelist]} component={SelectBoxCountry} />
                </FormItem>
              </FormGroup>
              {
                country === 'US'
                  ? <FormGroup>
                    <FormItem>
                      <Field name='state' validate={[required, onSfoxWhitelist]} component={SelectBoxUSState} />
                    </FormItem>
                  </FormGroup>
                  : null
              }
              <Button nature='primary' uppercase type='submit' disabled={invalid || pristine}>
                <FormattedMessage id='selectpartner.getstarted' defaultMessage='get started' />
              </Button>
            </form>
          </FieldWrapper>
        </SelectionContainer>
      </ColRight>
    </Row>
  )
}

export default reduxForm({ form: 'selectPartner' })(SelectPartner)
