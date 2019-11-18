import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { Badge, Button, Text } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const BadgesContainer = styled.div`
  display: block;
  padding-top: 10px;
  & > * {
    display: inline;
    margin-right: 5px;
  }
`

class PairingCode extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onShowCode = this.onShowCode.bind(this)
  }

  onShowCode () {
    this.props.actions.showModal('PairingCode')
  }

  render () {
    return (
      <SettingContainer>
        <SettingSummary>
          <SettingHeader>
            <FormattedMessage
              id='scenes.settings.general.pairingcode.title'
              defaultMessage='Mobile App Pairing Code'
            />
          </SettingHeader>
          <SettingDescription>
            <FormattedMessage
              id='scenes.settings.general.pairingcode.description'
              defaultMessage="Scan the code (click on 'Show Pairing Code') with your Blockchain Wallet (iOS or Android) for a seamless connection to your wallet."
              altFont
              light
            />
            <FormattedMessage
              id='scenes.settings.general.pairingcode.description2'
              defaultMessage='Download our mobile applications below.'
            />
            <Text size='14px' weight={300} color='error'>
              <FormattedMessage
                id='scenes.settings.general.pairingcode.warning'
                defaultMessage='Do not share your Pairing Code with others.'
              />
            </Text>
            <BadgesContainer>
              <Badge type='applestore' />
              <Badge type='googleplay' />
            </BadgesContainer>
          </SettingDescription>
        </SettingSummary>
        <SettingComponent>
          <Button nature='primary' onClick={this.onShowCode}>
            <FormattedMessage
              id='scenes.settings.general.pairingcode.settings.show'
              defaultMessage='Show Pairing Code'
            />
          </Button>
        </SettingComponent>
      </SettingContainer>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(PairingCode)
