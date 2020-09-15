import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'

import { actions, model } from 'data'
import { Button, Text, TextGroup } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const { ENABLE_BTC_LINKS } = model.analytics.PREFERENCE_EVENTS.GENERAL
class CryptoLinkHandlingContainer extends React.PureComponent {
  state = { warningDisplayed: false }

  onEnableClick = () => {
    this.setState({ warningDisplayed: !this.state.warningDisplayed })
    // Register BTC links
    window.navigator.registerProtocolHandler(
      'bitcoin',
      '/#/open/%s',
      'Blockchain'
    )
    // Register BCH links
    window.navigator.registerProtocolHandler(
      'web+bitcoincash',
      '/#/open/%s',
      'Blockchain'
    )
    this.props.analyticsActions.logEvent(ENABLE_BTC_LINKS)
  }

  render () {
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
            </TextGroup>
          )}
        </SettingComponent>
      </SettingContainer>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

export default connect(null, mapDispatchToProps)(CryptoLinkHandlingContainer)
