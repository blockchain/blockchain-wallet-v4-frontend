import React from 'react'
import { FormattedMessage } from 'react-intl'
import Bowser from 'bowser'
import styled from 'styled-components'

import {
  Banner,
  Button,
  Icon,
  Image,
  Link,
  Text
} from 'blockchain-info-components'
import { model } from 'data'
import { media } from 'services/styles'

const containerWidth = '650px'
const containerPadding = '25px'
const marginContent = '25px'

const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  padding: 10px;
  box-sizing: border-box;
`
const IntroContainer = styled.div`
  padding-top: 20px;
`

const GetStartedContainer = styled.div`
  position: relative;
  margin: 0 auto 10px;
  padding: ${containerPadding};
  width: ${containerWidth};
  box-sizing: border-box;
  height: 325px;
  border: 1px solid ${props => props.theme.blue000};
  border-radius: 3px;
  background-image: url('/img/lockbox@2x.png');
  background-repeat: no-repeat;
  background-size: auto 95%;
  background-position: top right 24px;
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
  width: 200px;
  margin-bottom: ${marginContent};
  ${media.mobile`
    width: 100%;
  `};
`
const GetStartedButton = styled(Button)`
  width: 100%;
  margin: 25px 0 15px;
`
const GetStartedText = styled(Text)`
  width: 350px;
  ${media.mobile`
    width: 100%;
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
  background-color: ${props => props.theme.grey000};
  ${media.mobile`
    width: 100%;
    flex-direction: column;
  `};
`
const SetupGuideContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
`
const LearnMoreText = styled(Text)`
  margin-right: 15px;
  color: ${props => props.theme.blue600};
`
const SetupGuideText = styled(Text)`
  margin: 0 4px;
  color: ${props => props.theme.blue600};
`
const BrowserWarning = styled(Banner)``
const browser = Bowser.getParser(window.navigator.userAgent)
const disableSetup = !browser.satisfies(
  model.components.lockbox.supportedBrowsers
)

const Onboard = props => {
  const { launchLockboxSetup } = props

  return (
    <Wrapper>
      <IntroContainer>
        <GetStartedContainer height='325px' url='url(/img/lockbox@2x.png)'>
          <GetStartedContent>
            <GetStartedHeader
              size='26px'
              weight={500}
              color='blue900'
              width='200px'
            >
              <FormattedMessage
                id='scenes.lockbox.welcome.title'
                defaultMessage='Secure Your Crypto Offline'
              />
            </GetStartedHeader>
            <GetStartedText size='17px' weight={400}>
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
            <SetupGuideContainer>
              <Text size='13px' weight={400}>
                <FormattedMessage
                  id='scenes.lockbox.welcome.trouble'
                  defaultMessage='Having trouble? View our'
                />
              </Text>
              <LearnMoreLink
                href={
                  'https://blockchain.zendesk.com/hc/en-us/sections/360002593291-Setting-Up-Lockbox'
                }
                target='_blank'
              >
                <SetupGuideText size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.lockbox.welcome.setupguide'
                    defaultMessage='Setup Guide'
                  />
                </SetupGuideText>
              </LearnMoreLink>
            </SetupGuideContainer>
          </GetStartedContent>
          <PoweredByContainer>
            <PoweredByText size='11px' weight={400} color='blue900'>
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
              id='scenes.lockbox.welcome.explanation.secure'
              defaultMessage="Don't have a Lockbox? Secure your crypto now."
            />
          </Text>
          <LearnMoreLink
            href={'https://www.blockchain.com/lockbox'}
            target='_blank'
          >
            <LearnMoreText size='15px'>
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
            <Icon name='arrow-right' color='blue600' size='18px' />
          </LearnMoreLink>
        </LearnMoreContainer>
        <WarningContent>
          {disableSetup && (
            <BrowserWarning type='warning'>
              <Text color='warning' size='12px'>
                <FormattedMessage
                  id='scenes.lockbox.welcome.blockbrowser'
                  defaultMessage='Unsupported browser for new device setup. Please use Brave, Chrome, Firefox or Opera.'
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
