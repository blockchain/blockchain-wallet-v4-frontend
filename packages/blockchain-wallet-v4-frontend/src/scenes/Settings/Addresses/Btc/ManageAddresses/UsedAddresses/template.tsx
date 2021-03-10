import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'

import UsedAddressesTable from './Table'

const Wrapper = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const UsedAddressesTemplate = ({
  onShowUsedAddresses,
  usedAddressesVisible,
  walletIndex
}) => {
  return (
    <React.Fragment>
      <Wrapper>
        <Text weight={500} size='14px' style={{ marginRight: '16px' }}>
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.title'
            defaultMessage='Used Addresses'
          />
        </Text>
        {usedAddressesVisible ? (
          <Link
            weight={500}
            size='13px'
            onClick={onShowUsedAddresses}
            data-e2e='btcHideUsedAddressesLink'
          >
            <FormattedMessage
              id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.hide'
              defaultMessage='Hide'
            />
          </Link>
        ) : (
          <Link
            weight={500}
            size='13px'
            onClick={onShowUsedAddresses}
            data-e2e='btcShowUsedAddressesLink'
          >
            <FormattedMessage
              id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.show'
              defaultMessage='Show'
            />
          </Link>
        )}
      </Wrapper>
      {usedAddressesVisible ? (
        <UsedAddressesTable walletIndex={walletIndex} />
      ) : null}
    </React.Fragment>
  )
}

export default UsedAddressesTemplate
