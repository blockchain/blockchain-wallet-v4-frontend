import React from 'react'
import { FormattedMessage } from 'react-intl'
import { filter } from 'ramda'

import {
  Icon,
  Link,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'

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
            size='small'
            weight={400}
            target='_blank'
            data-e2e='btcUnusedAddressLink'
          >
            {entry.address}
          </Link>
        </TableCell>
        <TableCell width='40%'>
          <Text size='13px' data-e2e='btcUnusedAddressLabel'>
            {entry.label}
          </Text>
        </TableCell>
        <TableCell
          width='20%'
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Icon
            cursor
            name='pencil'
            onClick={() => onEditLabel(entry.derivationIndex)}
            style={{ marginRight: 10 }}
            data-e2e='btcEditAddressLabelLink'
          />
          <Icon
            cursor
            name='trash'
            onClick={() => onDeleteLabel(entry.derivationIndex)}
            data-e2e='btcDeleteAddressLink'
          />
        </TableCell>
      </TableRow>
    )
  })

  return unusedAddresses.length === 0 ? (
    <Text
      weight={400}
      style={{ marginTop: 20, textAlign: 'center' }}
      data-e2e='btcWalletNoUnusedAddresses'
    >
      <FormattedMessage
        id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.nounusedmessage'
        defaultMessage='This wallet has no unused addresses.'
      />
    </Text>
  ) : (
    <Table>
      <TableHeader>
        <TableCell width='40%'>
          <Text size='13px' weight={500}>
            <FormattedMessage id='copy.address' defaultMessage='Address' />
          </Text>
        </TableCell>
        <TableCell width='40%'>
          <Text size='13px' weight={500}>
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
          <Text size='13px' weight={500}>
            <FormattedMessage
              id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.actions'
              defaultMessage='Actions'
            />
          </Text>
        </TableCell>
      </TableHeader>
      {addresses}
    </Table>
  )
}

export default UnusedAddressesTemplate
