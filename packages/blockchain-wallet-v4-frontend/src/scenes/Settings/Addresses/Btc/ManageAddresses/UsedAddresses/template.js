import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import UsedAddressesTable from './Table'
import { Text, Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const UsedAddressesTemplate = ({ onShowUsedAddresses, usedAddressesVisible, walletIndex }) => {
  return (
    <React.Fragment>
      <Wrapper>
        <Text weight={400} size='14px' style={{ marginRight: '16px' }}>
          <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.title' defaultMessage='Used Addresses' />
        </Text>
        <Link weight={200} size='12px' onClick={onShowUsedAddresses}>
          { usedAddressesVisible ? <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.hide' defaultMessage='Hide' /> : (
            <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.show' defaultMessage='Show' />
          )}
        </Link>
      </Wrapper>
      { usedAddressesVisible ? <UsedAddressesTable walletIndex={walletIndex} /> : null }
    </React.Fragment>
  )
}

export default UsedAddressesTemplate
