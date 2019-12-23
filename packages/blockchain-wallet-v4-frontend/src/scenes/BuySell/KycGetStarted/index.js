import { Button, Image, Text } from 'blockchain-info-components'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, FormItem, SelectBoxCountry } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { onPartnerCountryWhitelist, required } from 'services/FormHelper'
import { spacing } from 'services/StyleService'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  padding: 0;
  box-sizing: border-box;
`
const GetStartedContainer = styled.div`
  position: relative;
  margin: 0 auto 25px;
  padding: 25px;
  width: 650px;
  box-sizing: border-box;
  height: ${props => props.height};
  border: 1px solid ${props => props.theme['brand-quaternary']};
  border-radius: 3px;
  background-image: ${props => props.url};
  background-repeat: no-repeat;
  background-size: ${props => props.backgroundSize || 'auto 100%'};
  background-position: ${props => props.backgroundPosition || 'right'};
  ${media.mobile`
    width: 100%;
    background-image: none;
  `};
`
const GetStartedContent = styled.div`
  width: 300px;
  ${media.mobile`
    width: 100%;
  `};
`
const GetStartedHeader = styled(Text)`
  width: ${props => props.width};
  margin-bottom: 25px;
  ${media.mobile`
    width: 100%;
  `};
`
const GetStartedText = styled(Text)`
  width: 350px;
  margin-bottom: 25px;
  ${media.mobile`
    width: 100%;
  `};
`
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
const BuySellAnimationWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  top: 105px;
  right: 20px;
`
const BuySellBaseImage = styled(Image)`
  width: 280px;
  height: auto;
`
const BuySellBaseColor = styled(Image)`
  left: 0;
  opacity: 0;
  position: absolute;
  transition: opacity 0.5s;
  &.active {
    opacity: 1;
  }
`
const KycGetStarted = props => {
  const {
    coinifyCountries,
    invalid,
    pristine,
    fields,
    handleSubmit,
    showRejectedNotification
  } = props

  const isCoinifyCountry = country => coinifyCountries.includes(country)
  const getPartner = () => {
    if (isCoinifyCountry(fields.country)) {
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
    <Wrapper>
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
          <BuySellAnimationWrapper>
            <BuySellBaseImage name='buy-sell-grey' />
            <BuySellBaseColor name='buy-sell-color' className={'active'} />
          </BuySellAnimationWrapper>
        ) : (
          <PoweredByContainer>
            <Image width='100%' name={getPartner().logo} />
          </PoweredByContainer>
        )}
      </GetStartedContainer>
    </Wrapper>
  )
}

export default reduxForm({
  form: 'selectPartner'
})(KycGetStarted)
