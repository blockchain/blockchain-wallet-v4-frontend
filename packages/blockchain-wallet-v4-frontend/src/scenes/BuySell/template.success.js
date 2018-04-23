import React from 'react'
import styled from 'styled-components'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Text, Button } from 'blockchain-info-components'
import { FormGroup, FormItem, SelectBoxUSState, SelectBoxCountry, TextBox } from 'components/Form'
import { spacing } from 'services/StyleService'
import { required } from 'services/FormHelper'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
const ColLeft = styled.div`
  width: 55%;
`
const ColRight = styled.div`
  width: 40%;
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
const UnavailableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
`
const SubmittedWrapper = styled.span`
  text-align: center;
  margin-top: 35px;
`

const SelectPartner = (props) => {
  const { invalid, options, pristine, country, stateSelection, submitEmail, ui, email } = props
  const sfoxStates = options.platforms.web.sfox.states
  const sfoxCountries = options.platforms.web.sfox.countries
  const unocoinCountries = options.platforms.web.unocoin.countries
  const coinifyCountries = options.platforms.web.coinify.countries
  const countries = [sfoxCountries, coinifyCountries, unocoinCountries].join().split(',')

  const onSfoxWhitelist = val => val && sfoxStates.indexOf(val) >= 0 ? undefined : 'state not supported'
  const onPartnerCountryWhitelist = val => val && countries.indexOf(val) >= 0 ? undefined : 'country not supported'

  const onSubmit = (e) => {
    e.preventDefault()
    if (sfoxCountries.indexOf(props.country) >= 0) {
      props.modalActions.showModal('SfoxExchangeData', { step: 'account' })
    }
    if (unocoinCountries.indexOf(props.country) >= 0) {
      console.log('start unocoin')
    }
    if (coinifyCountries.indexOf(props.country) >= 0) {
      props.modalActions.showModal('CoinifyExchangeData', { step: 'account' })
    }
  }

  const renderUnavailable = () => {
    if (!pristine && ((country && onPartnerCountryWhitelist(country)) || (stateSelection && onSfoxWhitelist(stateSelection)))) {
      return (
        <UnavailableContainer>
          <Text size='14px' weight={300} style={spacing('mb-15')}>
            {
              country === 'US'
                ? <FormattedMessage id='selectpartner.unavailable.unfortunatelystate' defaultMessage='Unfortunately buy & sell is not available in your state at this time. To be notified when we expand to your location, sign up below.' />
                : <FormattedMessage id='selectpartner.unavailable.unfortunatelycountry' defaultMessage='Unfortunately buy & sell is not available in your country at this time. To be notified when we expand to your location, sign up below.' />
            }
          </Text>
          {
            !ui.submittedEmail
              ? <span>
                <Field name='email' component={TextBox} placeholder='Add your email here' />
                <Button style={spacing('mt-15')} nature='primary' onClick={submitEmail}>
                  <FormattedMessage id='selectpartner.unavailable.notifyme' defaultMessage='Notify Me When This Becomes Available' />
                </Button>
              </span>
              : <SubmittedWrapper>
                <Text size='16px' color='brand-primary'>
                  <FormattedMessage id='selectpartner.unavailable.thanks' defaultMessage='Thanks!' />
                </Text>
                <Text size='14px' weight={300}>
                  <FormattedHTMLMessage id='selectpartner.unavailable.sendemail' defaultMessage='We will send an email to <strong>{email}</strong> once buy & sell are available for your area.' values={{email: email}} />
                </Text>
              </SubmittedWrapper>
          }
        </UnavailableContainer>
      )
    }
  }

  return (
    <Row>
      <ColLeft>
        placeholder
        { renderUnavailable() }
      </ColLeft>
      <ColRight>
        <Intro>
          <PartnerHeader>
            <FormattedMessage id='selectpartner.header' defaultMessage='A Better Buy & Sell' />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='selectpartner.subheader' defaultMessage="We're excited to introduce an all-in-one experience. Whether you want to buy or sell using your local currency or exchange between your digital assets, you'll find everything you need right here." />
          </PartnerSubHeader>
          <PartnerSubHeader style={spacing('mt-15')}>
            <FormattedMessage id='selectpartner.subheader2' defaultMessage="Select your location below, verify your identity, and before you know it, you'll be on your way to making your crypto dreams a reality!" />
          </PartnerSubHeader>
        </Intro>
        <SelectionContainer>
          <Text size='14px'>
            <FormattedMessage id='selectpartner.selectcountry' defaultMessage='Select your country:' />
          </Text>
          <FieldWrapper>
            <form onSubmit={onSubmit}>
              <FormGroup>
                <FormItem>
                  <Field name='country' validate={[required, onPartnerCountryWhitelist]} component={SelectBoxCountry} errorBottom />
                </FormItem>
              </FormGroup>
              {
                country === 'US'
                  ? <FormGroup style={spacing('mt-20')}>
                    <FormItem>
                      <Field name='state' validate={[required, onSfoxWhitelist]} component={SelectBoxUSState} errorBottom />
                    </FormItem>
                  </FormGroup>
                  : null
              }
              <Button nature='primary' uppercase type='submit' disabled={invalid || pristine} style={spacing('mt-20')}>
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
