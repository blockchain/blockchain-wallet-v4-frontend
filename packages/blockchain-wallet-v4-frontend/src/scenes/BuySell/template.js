import React from 'react'
import styled from 'styled-components'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import BuySellAnimation from './BuySellAnimation'
import { Text, Button, Image } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, SelectBoxCountry } from 'components/Form'
import { spacing } from 'services/StyleService'
import { required, onPartnerCountryWhitelist } from 'services/FormHelper'
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
  width: 70%;
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
const FieldWrapper = styled(Intro)`
  margin-top: 5px;
  width: 75%;
`

const SelectPartner = props => {
  const {
    invalid,
    pristine,
    fields,
    // sfoxStates,
    handleSubmit,
    options,
    showRejectedNotification
  } = props
  const { country } = fields

  // const onSfoxWhitelist = usState =>
  //   country === 'US' &&
  //   prop('code', usState) &&
  //   sfoxStates.includes(usState.code)
  const isCoinifyCountry = country => props.coinifyCountries.includes(country)
  const getPartner = () => {
    // if (onSfoxWhitelist(stateSelection)) {
    //   return {
    //     name: 'SFOX',
    //     url: 'url(/img/sfox-landing.png)',
    //     logo: 'powered-by-sfox',
    //     backgroundSize: 'auto 80%',
    //     backgroundPosition: 'right 70px bottom 0%'
    //   }
    // }
    if (isCoinifyCountry(country)) {
      return {
        name: 'COINIFY',
        url: 'url(/img/coinify-landing.svg)',
        backgroundSize: 'auto 45%',
        backgroundPosition: 'right 25px bottom 65%',
        logo: 'powered-by-coinify'
      }
    }
    return {}
  }

  return (
    <Wrapper noPadding>
      <GetStartedContainer
        url={getPartner().url}
        backgroundSize={getPartner().backgroundSize}
        backgroundPosition={getPartner().backgroundPosition}
      >
        <GetStartedContent>
          <GetStartedHeader
            size='26px'
            weight={500}
            color='brand-primary'
            width='300px'
          >
            <FormattedMessage
              id='scenes.buysell.selectpartner.header.buy_bitcoin'
              defaultMessage='Buy & Sell Bitcoin'
            />
          </GetStartedHeader>
          <GetStartedText size='17px' weight={400}>
            {getPartner().name === 'COINIFY' ? (
              <FormattedMessage
                id='scenes.buysell.selectpartner.subheader_coinify2'
                defaultMessage='You can buy & sell Bitcoin (BTC) from your Wallet through our partner Coinify.'
              />
            ) : (
              <FormattedMessage
                id='scenes.buysell.selectpartner.subheader_nopartner'
                defaultMessage='You can buy & sell Bitcoin (BTC) from your Wallet.'
              />
            )}
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
              {
                <Button
                  nature={showRejectedNotification ? 'warning' : 'primary'}
                  type='submit'
                  disabled={invalid || pristine || showRejectedNotification}
                  style={spacing('mt-20')}
                >
                  {showRejectedNotification ? (
                    <FormattedMessage
                      id='scenes.buysell.selectpartner.cannottrade'
                      defaultMessage='Disabled Due to Identity Verification Issue'
                    />
                  ) : (
                    <FormattedMessage
                      id='scenes.buysell.selectpartner.button'
                      defaultMessage='Next'
                    />
                  )}
                </Button>
              }
            </Form>
          </FieldWrapper>
          <CountryFAQText>
            <Text size='12px' style={spacing('pb-5')}>
              <FormattedMessage
                id='scenes.buysell.selectpartner.countryquestion'
                defaultMessage="What's my country for?"
              />
            </Text>
            <Text size='12px' weight={400}>
              <FormattedMessage
                id='scenes.buysell.selectpartner.countryanswer'
                defaultMessage='Due to local laws, Blockchain can only operate in permitted regions.'
              />
            </Text>
          </CountryFAQText>
        </GetStartedContent>
        {!getPartner().name ? (
          <BuySellAnimation country={country} options={options} />
        ) : null}
        {getPartner().name ? (
          <PoweredByContainer>
            <Image width='100%' name={getPartner().logo} />
          </PoweredByContainer>
        ) : null}
      </GetStartedContainer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'selectPartner' })(SelectPartner)
