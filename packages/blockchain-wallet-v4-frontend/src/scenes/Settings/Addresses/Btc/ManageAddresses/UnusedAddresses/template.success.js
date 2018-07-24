import React from 'react'
import { FormattedMessage } from 'react-intl'
import { filter } from 'ramda'

import { Text, Table, TableHeader, TableRow, TableCell, Icon, Link } from 'blockchain-info-components'

const UnusedAddressesTemplate = ({ account, currentReceiveIndex, unusedAddresses, isDefault, onGenerateNextAddress, onEditLabel, onDeleteLabel, onEditBtcAccountLabel, onShowXPub, onMakeDefault, onSetArchived, search }) => {
  const isMatch = (addr) => !search || addr.label.toLowerCase().indexOf(search.toLowerCase()) > -1 || addr.address.toLowerCase().indexOf(search.toLowerCase()) > -1
  const addresses = filter(isMatch, unusedAddresses).map((entry, i) => {
    return (
      <TableRow key={i}>
        <TableCell width='40%'>
          <Link href={`https://blockchain.info/address/${entry.address}`} size='small' weight={300} target='_blank'>
            {entry.address}
          </Link>
        </TableCell>
        <TableCell width='40%'>
          <Text size='13px'>{entry.label}</Text>
        </TableCell>
        <TableCell width='20%' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Icon cursor name='pencil' onClick={() => onEditLabel(entry.derivationIndex)} style={{ marginRight: 10 }} />
          <Icon cursor name='trash' onClick={() => onDeleteLabel(entry.derivationIndex)} />
        </TableCell>
      </TableRow>
    )
  })

  return unusedAddresses.length === 0
    ? (<Text weight={300} style={{ marginTop: 20, textAlign: 'center' }}>
      <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.nounusedmessage' defaultMessage='This wallet has no unused addresses.'/>
    </Text>)
    : (<Table>
      <TableHeader>
        <TableCell width='40%'>
          <Text size='13px' weight={500}>
            <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.address' defaultMessage='Address' />
          </Text>
        </TableCell>
        <TableCell width='40%'>
          <Text size='13px' weight={500}>
            <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.label' defaultMessage='Label' />
          </Text>
        </TableCell>
        <TableCell width='20%' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text size='13px' weight={500}>
            <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.actions' defaultMessage='Actions' />
          </Text>
        </TableCell>
      </TableHeader>
      {addresses}
    </Table>)
}

export default UnusedAddressesTemplate
