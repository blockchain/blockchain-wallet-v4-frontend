import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Badge, Button, Text } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { modals } from 'data/actions'
import { ModalName } from 'data/types'

const BadgesContainer = styled.div`
  display: block;
  padding-top: 10px;
  & > * {
    display: inline;
    margin-right: 5px;
  }
`

const PairingCode = () => {
  const dispatch = useDispatch()

  const onShowCode = () => {
    dispatch(modals.showModal(ModalName.PAIRING_CODE_MODAL, { origin: 'SettingsPage' }))
  }

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
          />{' '}
          <FormattedMessage
            id='scenes.settings.general.pairingcode.description2'
            defaultMessage='Download our mobile applications below.'
          />{' '}
          <Text color='error' size='13px' weight={600}>
            <FormattedMessage
              id='scenes.settings.general.pairingcode.warning'
              defaultMessage='Do not share your Pairing Code with others.'
            />
          </Text>
          <BadgesContainer>
            <Badge size='34px' type='applestore' />
            <Badge size='34px' type='googleplay' />
          </BadgesContainer>
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button data-e2e='showQrCode' nature='empty-blue' onClick={onShowCode}>
          <FormattedMessage
            id='scenes.settings.general.pairingcode.settings.show'
            defaultMessage='Show Pairing Code'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default PairingCode
