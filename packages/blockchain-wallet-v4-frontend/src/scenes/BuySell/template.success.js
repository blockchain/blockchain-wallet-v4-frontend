import React from 'react'
import styled from 'styled-components'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { equals, prop } from 'ramda'

import { Text, Button, Image } from 'blockchain-info-components'
import {
  Form,
  FormGroup,
  FormItem,
  SelectBoxUSState,
  SelectBoxCountry,
  TextBox
} from 'components/Form'
import { spacing } from 'services/StyleService'
import {
  required,
  onPartnerCountryWhitelist,
  onPartnerStateWhitelist,
  validEmail
} from 'services/FormHelper'
import BuySellAnimation from './BuySellAnimation'
import media from 'services/ResponsiveService'
import {
  Wrapper,
  GetStartedContainer,
  GetStartedContent,
  GetStartedHeader,
  GetStartedText
} from 'components/FeatureLandingPage'

const CountryFAQText = styled.div`
  padding-top: 25px;
`
const Intro = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const PoweredByContainer = styled.div`
  bottom: 25px;
  right: 25px;
  position: absolute;
  width: 100px;
  ${media.mobile`
    right: 5px;
  `};
`
const SelectionContainer = Intro.extend`
  margin-top: 25px;
`
const FieldWrapper = Intro.extend`
  margin-top: 5px;
  width: 75%;
`
const UnavailableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
`
const SubmittedWrapper = styled.span`
  text-align: center;
  margin-top: 35px;
`

const SelectPartner = props => {
  const { invalid, options, pristine, submitEmail, ui, fields, sfoxStates, allCountries, handleSubmit } = props
  const { country, stateSelection, email } = fields

  const onSfoxWhitelist = usState =>
    prop('code', usState) && sfoxStates.includes(usState.code)
      ? undefined
      : 'This service is not yet available in your state.'

  return (
    <Wrapper>
      <GetStartedContainer>
        <GetStartedContent>
          <GetStartedHeader size='26px' weight={400} color='brand-primary' width='300px'>
            <FormattedMessage
              id='scenes.buysell.selectpartner.header'
              defaultMessage='Introducing Buy & Sell'
            />
          </GetStartedHeader>
          <GetStartedText size='17px' weight={300}>
            <FormattedMessage
              id='scenes.buysell.selectpartner.subtitle'
              defaultMessage='You can now buy & sell Bitcoin (BTC) directly from your Blockchain Wallet.'
            />
          </GetStartedText>
          <FieldWrapper>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <FormItem>
                  <Field
                    name='country'
                    validate={[required, onPartnerCountryWhitelist]}
                    component={SelectBoxCountry}
                    errorBottom
                  />
                </FormItem>
              </FormGroup>
              {equals(country, 'US') ? (
                <FormGroup style={spacing('mt-5')}>
                  <FormItem>
                    <Field
                      name='state'
                      validate={[required, onPartnerStateWhitelist]}
                      component={SelectBoxUSState}
                      errorBottom
                    />
                  </FormItem>
                </FormGroup>
              ) : null}
              <Button
                nature='primary'
                type='submit'
                disabled={invalid || pristine}
                style={spacing('mt-20')}
              >
                <FormattedMessage
                  id='scenes.buysell.selectpartner.button'
                  defaultMessage='Next'
                />
              </Button>
            </Form>
          </FieldWrapper>
          <CountryFAQText>
            <Text size='12px' style={spacing('pb-5')}>
              <FormattedMessage
                id='scenes.buysell.selectpartner.countryquestion'
                defaultMessage="What's my country for?"
              />
            </Text>
            <Text size='12px' weight={300}>
              <FormattedMessage
                id='scenes.buysell.selectpartner.countryanswer'
                defaultMessage='Due to local laws, Blockchain can only operate in permitted regions.'
              />
            </Text>
          </CountryFAQText>
        </GetStartedContent>
        <PoweredByContainer>
          <Text size='11px' weight={300} color='brand-primary'>
            <FormattedMessage
              id='scenes.buysell.selectpartner.poweredby'
              defaultMessage='Powered By'
            />
          </Text>
          <Image
            width='100%'
            name='coinify-logo'
          />
        </PoweredByContainer>
      </GetStartedContainer>
    </Wrapper>
    // <Row>
    //   <ColLeft>{renderColLeft()}</ColLeft>
    //   <ColRight>
    //     <Intro>
    //       <PartnerHeader>
    //         <FormattedMessage
    //           id='scenes.buysell.selectpartner.header'
    //           defaultMessage='Introducing Buy & Sell'
    //         />
    //       </PartnerHeader>
    //       <PartnerSubHeader>
    //         <FormattedMessage
    //           id='scenes.buysell.selectpartner.subheader'
    //           defaultMessage='You can now buy & sell bitcoin directly from your wallet and have the exchanged funds deposited into your bank account.'
    //         />
    //       </PartnerSubHeader>
    //       <PartnerSubHeader style={spacing('mt-15')}>
    //         <FormattedMessage
    //           id='scenes.buysell.selectpartner.subheader2'
    //           defaultMessage="Select your location below, verify your identity, and before you know it, you'll be on your way to making your crypto dreams a reality!"
    //         />
    //       </PartnerSubHeader>
    //     </Intro>
    //     <SelectionContainer>
    //       <Text size='14px'>
    //         <FormattedMessage
    //           id='scenes.buysell.selectpartner.selectcountry'
    //           defaultMessage='Select your country:'
    //         />
    //       </Text>
    //       <FieldWrapper>
    //         <form onSubmit={handleSubmit}>
    //           <FormGroup>
    //             <FormItem>
    //               <Field
    //                 name='country'
    //                 validate={[required, onPartnerCountryWhitelist]}
    //                 component={SelectBoxCountry}
    //                 errorBottom
    //               />
    //             </FormItem>
    //           </FormGroup>
    //           {equals(country, 'US') ? (
    //             <FormGroup style={spacing('mt-5')}>
    //               <FormItem>
    //                 <Field
    //                   name='state'
    //                   validate={[required, onPartnerStateWhitelist]}
    //                   component={SelectBoxUSState}
    //                   errorBottom
    //                 />
    //               </FormItem>
    //             </FormGroup>
    //           ) : null}
    //           <Button
    //             nature='primary'
    //             type='submit'
    //             disabled={invalid || pristine}
    //             style={spacing('mt-35')}
    //           >
    //             <FormattedMessage
    //               id='scenes.buysell.selectpartner.getstarted'
    //               defaultMessage='Get Started'
    //             />
    //           </Button>
    //         </form>
    //       </FieldWrapper>
    //     </SelectionContainer>
    //   </ColRight>
    // </Row>
  )
}

export default reduxForm({ form: 'selectPartner' })(SelectPartner)
