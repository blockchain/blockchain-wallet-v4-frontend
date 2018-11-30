import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import * as bowser from 'bowser'
import {
  Banner,
  Button,
  Icon,
  Image,
  Link,
  Text
} from 'blockchain-info-components'
import {
  Wrapper,
  IntroContainer,
  GetStartedContainer,
  GetStartedContent,
  GetStartedHeader,
  GetStartedText
} from 'components/FeatureLandingPage'
import media from 'services/ResponsiveService'

const containerWidth = '650px'
const containerPadding = '25px'
const marginContent = '25px'

const GetStartedButton = styled(Button)`
  width: 250px;
  margin: 45px 0 0 35px;
  ${media.mobile`
    width: 100%;
    margin: 0;
  `};
`
const PoweredByContainer = styled.div`
  top: ${containerPadding};
  right: ${containerPadding};
  position: absolute;
  ${media.mobile`
    right: 5px;
  `};
`

const PoweredByText = styled(Text)`
  margin-bottom: 5px;
`
const WarningContent = styled.div`
  width: ${containerWidth};
  margin: 0 auto;
`

const LearnMoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: ${containerWidth};
  margin: 0 auto ${marginContent};
  padding: ${containerPadding};
  box-sizing: border-box;
  border-radius: 3px;
  background-color: ${props => props.theme['white-blue']};
  ${media.mobile`
    width: 100%;
    flex-direction: column;
  `};
`

const LearnMoreLink = styled(Link)`
  display: inline-flex;
`

const LearnMoreText = styled(Text)`
  margin-right: 15px;
  color: ${props => props.theme['brand-secondary']};
`

const BrowserWarning = styled(Banner)``

const disableSetup = !(bowser.name === 'Chrome' || bowser.name === 'Chromium')

const Onboard = props => {
  const { domains, launchLockboxSetup } = props

  return (
    <Wrapper>
      <IntroContainer>
        <GetStartedContainer height='325px' url='url(/img/lockbox@2x.png)'>
          <GetStartedContent>
            <GetStartedHeader size='26px' weight={400} color='brand-primary' width='200px'>
              <FormattedMessage
                id='scenes.lockbox.welcome.title'
                defaultMessage='Secure Your Crypto Offline'
              />
            </GetStartedHeader>
            <GetStartedText size='17px' weight={300}>
              <FormattedMessage
                id='scenes.lockbox.welcome.subtitle'
                defaultMessage='Trade, send and receive straight from your offline hardware wallet. Blockchain Lockbox works seamlessly with your Blockchain Wallet.'
              />
            </GetStartedText>
            <GetStartedButton
              nature='primary'
              disabled={disableSetup}
              onClick={launchLockboxSetup}
            >
              <FormattedMessage
                id='scenes.lockbox.welcome.getstarted'
                defaultMessage='Get Started'
              />
            </GetStartedButton>
          </GetStartedContent>
          <PoweredByContainer>
            <PoweredByText size='11px' weight={300} color='brand-primary'>
              <FormattedMessage
                id='scenes.lockbox.welcome.poweredby'
                defaultMessage='Powered By'
              />
            </PoweredByText>
            <Image
              width='100%'
              name='ledger-logo'
              srcset={{
                'ledger-logo2': '2x',
                'ledger-logo3': '3x'
              }}
            />
          </PoweredByContainer>
        </GetStartedContainer>
        <LearnMoreContainer>
          <Text size='15px'>
            <FormattedMessage
              id='scenes.lockbox.welcome.explanation'
              defaultMessage="Don't have a Lockbox? Secure your crypto now for $99."
            />
          </Text>
          <LearnMoreLink href={domains['comRoot'] + '/lockbox'} target='_blank'>
            <LearnMoreText size='15px'>
              <FormattedMessage
                id='scenes.lockbox.welcome.learnmore'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
            <Icon
              name='short-right-arrow'
              color='brand-secondary'
              size='18px'
            />
          </LearnMoreLink>
        </LearnMoreContainer>
        <WarningContent>
          {disableSetup && (
            <BrowserWarning type='warning'>
              <Text color='warning' size='12px'>
                <FormattedMessage
                  id='scenes.lockbox.welcome.browserblock'
                  defaultMessage='New device setup can only be done while using the Chrome browser'
                />
              </Text>
            </BrowserWarning>
          )}
        </WarningContent>
      </IntroContainer>
    </Wrapper>
  )
}

export default Onboard
