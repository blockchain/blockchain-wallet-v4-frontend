import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { SettingDescription } from 'components/Setting'

import UsedAddressesTable from './Table'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  > :first-child {
    padding-right: 100px;
  }
`
const UsedAddressesTemplate = ({
  derivation,
  onShowUsedAddresses,
  usedAddressesVisible,
  walletIndex
}) => (
  <>
    <Wrapper>
      <div>
        <Text color='black' weight={500} size='16px'>
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.title'
            defaultMessage='Used Addresses'
          />
        </Text>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.message'
            defaultMessage='Previously used addresses are helpful for viewing associated balances and debugging. We do not recommend re-using these addresses due to user privacy concerns. Change addresses are not shown here.'
          />
        </SettingDescription>
      </div>
      <div>
        {!usedAddressesVisible && (
          <Button
            data-e2e='btcShowUsedAddressesLink'
            height='36px'
            nature='primary'
            onClick={onShowUsedAddresses}
            size='14px'
          >
            <FormattedMessage
              id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.show'
              defaultMessage='Reveal Addresses'
            />
          </Button>
        )}
      </div>
    </Wrapper>
    {usedAddressesVisible ? (
      <UsedAddressesTable derivation={derivation} walletIndex={walletIndex} />
    ) : null}
  </>
)

export default UsedAddressesTemplate
