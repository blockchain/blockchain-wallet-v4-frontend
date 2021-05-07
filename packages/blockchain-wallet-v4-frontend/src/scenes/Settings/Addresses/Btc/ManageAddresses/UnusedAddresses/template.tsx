import React from 'react'
import { FormattedMessage } from 'react-intl'
import { filter } from 'ramda'
import styled from 'styled-components'

import {
  Icon,
  Link,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'

const TableStyled = styled(Table)`
  margin-top: 8px;
  > div:last-child {
    border-bottom: none;
  }
`

const UnusedAddressesTemplate = ({
  onDeleteLabel,
  onEditLabel,
  search,
  unusedAddresses
}) => {
  const isMatch = addr =>
    !search ||
    addr.label.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
    addr.address.toLowerCase().indexOf(search.toLowerCase()) > -1
  const addresses = filter(isMatch, unusedAddresses).map((entry, i) => {
    return (
      <TableRow key={i} data-e2e='btcUnusedAddressRow'>
        <TableCell width='40%' style={{ wordBreak: 'break-all' }}>
          <Link
            href={`https://blockchain.info/address/${entry.address}`}
            size='13px'
            weight={500}
            target='_blank'
            data-e2e='btcUnusedAddressLink'
          >
            {entry.address}
          </Link>
        </TableCell>
        <TableCell width='40%'>
          <Text size='13px' weight={500} data-e2e='btcUnusedAddressLabel'>
            {entry.label}
          </Text>
        </TableCell>
        <TableCell
          width='20%'
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Icon
            cursor
            data-e2e='btcEditAddressLabelLink'
            name='pencil'
            onClick={() => onEditLabel(entry.derivationIndex)}
            style={{ marginRight: 10 }}
          />
          <Icon
            cursor
            data-e2e='btcDeleteAddressLink'
            name='trash'
            onClick={() => onDeleteLabel(entry.derivationIndex)}
          />
        </TableCell>
      </TableRow>
    )
  })

  return unusedAddresses.length === 0 ? (
    <Text
      color='grey700'
      data-e2e='btcWalletNoUnusedAddresses'
      size='16px'
      style={{ marginTop: 20, textAlign: 'center' }}
      weight={500}
    >
      <FormattedMessage
        id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.nounusedmessage'
        defaultMessage='This wallet has no unused addresses.'
      />
    </Text>
  ) : (
    <TableStyled>
      <TableHeader>
        <TableCell width='40%'>
          <Text color='grey900' size='14px' weight={500}>
            <FormattedMessage id='copy.address' defaultMessage='Address' />
          </Text>
        </TableCell>
        <TableCell width='40%'>
          <Text color='grey900' size='14px' weight={500}>
            <FormattedMessage
              id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.label'
              defaultMessage='Label'
            />
          </Text>
        </TableCell>
        <TableCell
          width='20%'
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Text color='grey900' size='14px' weight={500}>
            <FormattedMessage
              id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.actions'
              defaultMessage='Actions'
            />
          </Text>
        </TableCell>
      </TableHeader>
      {addresses}
    </TableStyled>
  )
}

export default UnusedAddressesTemplate
