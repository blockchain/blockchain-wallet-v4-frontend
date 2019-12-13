// import {  Field,  reduxForm } from 'redux-form'
import { /* Button, Image, */ Text } from 'blockchain-info-components'
// import { Form, FormGroup, FormItem, SelectBoxCountry } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import {
  // GetStartedContainer,
  // GetStartedContent,
  // GetStartedHeader,
  // GetStartedText,
  Wrapper
} from 'components/FeatureLandingPage'
// import { onPartnerCountryWhitelist, required } from 'services/FormHelper'
// import { spacing } from 'services/StyleService'
// import BuySellAnimation from './BuySellAnimation'
// import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

import ContinueCoinify from './BuySellBuckets/ContinueCoinify'
import LaunchPit from './BuySellBuckets/LaunchPit'
import LearnMore from './BuySellBuckets/LearnMore'

// const CountryFAQText = styled.div`
//   padding-top: 25px;
//   width: 70%;
// `
// const Intro = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 100%;
// `
// const PoweredByContainer = styled.div`
//   bottom: 25px;
//   right: 25px;
//   position: absolute;
//   width: 100px;
//   ${media.mobile`
//     right: 5px;
//   `};
// `
// const FieldWrapper = styled(Intro)`
//   margin-top: 5px;
//   width: 75%;
// `

const Title = styled(Text)`
  width: 300px;
  margin-bottom: 1rem;
`

const BucketWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const SelectPartner = props => {
  const {
    // invalid,
    // pristine,
    currentTier,
    // fields,
    // sfoxStates,
    // handleSubmit,
    // options,
    // showRejectedNotification,
    hasTokenOrTrades,
    handleShowCoinify
  } = props
  // const { country } = fields

  // const onSfoxWhitelist = usState =>
  //   country === 'US' &&
  //   prop('code', usState) &&
  //   sfoxStates.includes(usState.code)
  // const isCoinifyCountry = country => props.coinifyCountries.includes(country)
  // const getPartner = () => {
  //    if (onSfoxWhitelist(stateSelection)) {
  //      return {
  //        name: 'SFOX',
  //        url: 'url(/img/sfox-landing.png)',
  //        logo: 'powered-by-sfox',
  //        backgroundSize: 'auto 80%',
  //       backgroundPosition: 'right 70px bottom 0%'
  //     }
  //    }
  //   if (isCoinifyCountry(country)) {
  //     return {
  //       name: 'COINIFY',
  //       url: 'url(/img/coinify-landing.svg)',
  //       backgroundSize: 'auto 45%',
  //       backgroundPosition: 'right 25px bottom 65%',
  //       logo: 'powered-by-coinify'
  //     }
  //   }
  //   return {}
  // }

  return (
    <Wrapper noPadding>
      <Title size='32px' weight={600} color='grey800'>
        <FormattedMessage
          id='scenes.buysell.title.buy_sell_crypto'
          defaultMessage='Buy & Sell Crypto'
        />
      </Title>
      <Text weight={500} color='grey400'>
        <FormattedMessage
          id='scenes.buysell.subtitle.buy_sell_crypto'
          defaultMessage="The quickest way to get today's top crypto."
        />
      </Text>

      <BucketWrapper>
        <LearnMore />
        <LaunchPit />
        <ContinueCoinify
          currentTier={currentTier}
          handleShowCoinify={handleShowCoinify}
          hasTokenOrTrades={hasTokenOrTrades}
        />
      </BucketWrapper>
      {/* <GetStartedContainer
        url={getPartner().url}
        backgroundSize={getPartner().backgroundSize}
        backgroundPosition={getPartner().backgroundPosition}
      >
        <GetStartedContent>
          <GetStartedHeader
            size="26px"
            weight={500}
            color="brand-primary"
            width="300px"
          >
            <FormattedMessage
              id="scenes.buysell.selectpartner.header.buy_bitcoin"
              defaultMessage="Buy & Sell Bitcoin"
            />
          </GetStartedHeader>
          <GetStartedText size="17px" weight={400}>
            {getPartner().name === 'COINIFY' ? (
              <FormattedMessage
                id="scenes.buysell.selectpartner.subheader_coinify2"
                defaultMessage="You can buy & sell Bitcoin (BTC) from your Wallet through our partner Coinify."
              />
            ) : (
              <FormattedMessage
                id="scenes.buysell.selectpartner.subheader_nopartner"
                defaultMessage="You can buy & sell Bitcoin (BTC) from your Wallet."
              />
            )}
          </GetStartedText>
          <FieldWrapper>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <FormItem>
                  <Field
                    name="country"
                    validate={[required, onPartnerCountryWhitelist]}
                    component={SelectBoxCountry}
                    errorBottom
                  />
                </FormItem>
              </FormGroup>
              {
                <Button
                  nature={showRejectedNotification ? 'warning' : 'primary'}
                  type="submit"
                  disabled={invalid || pristine || showRejectedNotification}
                  style={spacing('mt-20')}
                >
                  {showRejectedNotification ? (
                    <FormattedMessage
                      id="scenes.buysell.selectpartner.cannottrade"
                      defaultMessage="Disabled Due to Identity Verification Issue"
                    />
                  ) : (
                    <FormattedMessage
                      id="scenes.buysell.selectpartner.button"
                      defaultMessage="Next"
                    />
                  )}
                </Button>
              }
            </Form>
          </FieldWrapper>
          <CountryFAQText>
            <Text size="12px" style={spacing('pb-5')}>
              <FormattedMessage
                id="scenes.buysell.selectpartner.countryquestion"
                defaultMessage="What's my country for?"
              />
            </Text>
            <Text size="12px" weight={400}>
              <FormattedMessage
                id="scenes.buysell.selectpartner.countryanswer"
                defaultMessage="Due to local laws, Blockchain can only operate in permitted regions."
              />
            </Text>
          </CountryFAQText>
        </GetStartedContent>
        {!getPartner().name ? (
          <BuySellAnimation country={country} options={options} />
        ) : null}
        {getPartner().name ? (
          <PoweredByContainer>
            <Image width="100%" name={getPartner().logo} />
          </PoweredByContainer>
        ) : null}
      </GetStartedContainer> */}
    </Wrapper>
  )
}

// export default reduxForm({ form: 'selectPartner' })(SelectPartner)
export default SelectPartner
