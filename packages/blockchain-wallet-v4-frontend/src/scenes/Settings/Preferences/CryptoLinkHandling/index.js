import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Text, TextGroup } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { actions, model } from 'data'
import { isBrowserSafari } from 'services/browser'

const isSafari = isBrowserSafari()

const TextWrapper = styled(Text)`
  a {
    color: ${(props) => props.theme.blue600};
    text-decoration: none;
  }
`

const { ENABLE_BTC_LINKS } = model.analytics.PREFERENCE_EVENTS.GENERAL
class CryptoLinkHandlingContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { warningDisplayed: false }
  }

  onEnableClick = () => {
    this.setState((prevState) => ({ warningDisplayed: !prevState.warningDisplayed }))

    this.props.preferencesActions.setLinkHandling()

    // LEGACY
    this.props.analyticsActions.logEvent(ENABLE_BTC_LINKS)
  }

  render() {
    return (
      <SettingContainer>
        <SettingSummary>
          <SettingHeader>
            <FormattedMessage
              id='scenes.settings.preferences.cryptolinkhandling.title'
              defaultMessage='Crypto Link Handling'
            />
          </SettingHeader>
          <SettingDescription>
            <FormattedMessage
              id='scenes.settings.preferences.cryptolinkhandling.desc'
              defaultMessage='Enable this to allow your Blockchain Wallet to handle crypto payment links in the web browser from 3rd parties such as BitPay. Enabling this will make your experience more convenient when transacting crypto online.'
            />
          </SettingDescription>
        </SettingSummary>
        <SettingComponent>
          <Button nature='primary' onClick={this.onEnableClick}>
            <FormattedMessage
              id='scenes.settings.preferences.cryptolinkhandling.enable'
              defaultMessage='Enable'
            />
          </Button>
          {this.state.warningDisplayed && (
            <TextGroup inline>
              <Text size='12px' weight={400} color='error'>
                <FormattedMessage
                  id='scenes.settings.preferences.cryptolinkhandling.unknownstatus'
                  defaultMessage="We can't detect whether or not handling of crypto links has been enabled. If it has already been enabled, nothing will happen."
                />
              </Text>

              {isSafari && (
                <TextWrapper size='12px' weight={400} color='error'>
                  <FormattedMessage
                    id='scenes.settings.preferences.cryptolinkhandling.unknownstatus.safari'
                    defaultMessage='This feature is not supported in Safari <a>more details</a>.'
                    values={{
                      a: (msg) => (
                        <a
                          href='https://caniuse.com/?search=registerProtocolHandler'
                          target='_blank'
                          rel='noopener noreferrrer noreferrer'
                        >
                          {msg}
                        </a>
                      )
                    }}
                  />
                </TextWrapper>
              )}
            </TextGroup>
          )}
        </SettingComponent>
      </SettingContainer>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(null, mapDispatchToProps)(CryptoLinkHandlingContainer)
