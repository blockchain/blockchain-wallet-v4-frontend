import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Link,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'

const TableStyled = styled(Table)`
  > div:last-child {
    border-bottom: none;
  }
`

const UsedTable = ({ children }) => (
  <TableStyled data-e2e='btcUsedAddressesTable'>
    <TableHeader>
      <TableCell width='40%'>
        <Text color='grey900' size='14px' weight={500}>
          <FormattedMessage id='copy.address' defaultMessage='Address' />
        </Text>
      </TableCell>
      <TableCell width='40%'>
        <Text color='grey900' size='14px' weight={500}>
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.label'
            defaultMessage='Label'
          />
        </Text>
      </TableCell>
      <TableCell
        width='20%'
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Text
          color='grey900'
          size='14px'
          weight={500}
          style={{ marginRight: '8px' }}
        >
          <FormattedMessage id='copy.balance' defaultMessage='Balance' />
        </Text>
        <TooltipHost id='settingsBtcUsedBalace'>
          <TooltipIcon name='info' />
        </TooltipHost>
      </TableCell>
    </TableHeader>
    {children}
  </TableStyled>
)

const UsedTableEntry = ({ address, search }) => {
  const isMatch = () => {
    return (
      !search ||
      address.address.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      (address.label &&
        address.label.toLowerCase().indexOf(search.toLowerCase()) > -1)
    )
  }

  return !isMatch() ? null : (
    <TableRow data-e2e='btcUsedAddressesRow'>
      <TableCell width='40%' style={{ wordBreak: 'break-all' }}>
        <Link
          href={`https://blockchain.com/btc/address/${address.address}`}
          size='13px'
          weight={500}
          target='_blank'
          data-e2e='btcUsedAddressLink'
        >
          {address.address}
        </Link>
      </TableCell>
      <TableCell width='40%'>
        <Text size='13px' weight={500}>
          {address.label}
        </Text>
      </TableCell>
      <TableCell
        width='20%'
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Text size='13px' weight={500}>
          <CoinDisplay coin={'BTC'} size='13px' weight={400}>
            {address.final_balance}
          </CoinDisplay>
        </Text>
      </TableCell>
    </TableRow>
  )
}

const UsedAddressesTable = ({ search, usedAddresses }) => (
  <>
    {usedAddresses.length ? (
      <UsedTable>
        {usedAddresses.map((address, i) => (
          <UsedTableEntry key={i} address={address} search={search} />
        ))}
      </UsedTable>
    ) : (
      <Text
        color='grey700'
        data-e2e='btcNoUsedAddresses'
        size='16px'
        style={{ marginTop: 20, textAlign: 'center' }}
        weight={500}
      >
        <FormattedMessage
          id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.nousedmessage'
          defaultMessage='This wallet has no used addresses.'
        />
      </Text>
    )}
  </>
)

export default UsedAddressesTable
