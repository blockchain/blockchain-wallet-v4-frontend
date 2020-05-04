import { actions } from 'data'
import { Badge, Button, Text } from 'blockchain-info-components'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import React from 'react'
import styled from 'styled-components'

const BadgesContainer = styled.div`
  display: block;
  padding-top: 10px;
  & > * {
    display: inline;
    margin-right: 5px;
  }
`

class PairingCode extends React.PureComponent<Props> {
  onShowCode = () => {
    this.props.modalActions.showModal('PairingCode', { origin: 'SettingsPage' })
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
              // altFont
              // light
            />
            <FormattedMessage
              id='scenes.settings.general.pairingcode.description2'
              defaultMessage='Download our mobile applications below.'
            />
            <Text size='14px' weight={400} color='error'>
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
          <Button
            data-e2e='showQrCode'
            nature='primary'
            onClick={this.onShowCode}
          >
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
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(
  null,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

export default connector(PairingCode)
