import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { filter } from 'ramda'

import { Banner, Text, Table, TableHeader, TableRow, TableCell, Icon, IconButton, Link, ComponentDropdown } from 'blockchain-info-components'

const Fragment = React.Fragment
const WalletLabelCell = styled.div`
  display: flex;
  align-items: center;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const MoreOptions = () => (
  <Link weight={200} size='small'>
    <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.moreoptions' defaultMessage='More Options' />
  </Link>
)

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
        <TableCell style={{ display: 'flex', justifyContent: 'flex-end' }} width='20%'>
          <Icon cursor name='pencil' onClick={() => onEditLabel(entry.index)} style={{ marginRight: 10 }} />
          <Icon cursor name='trash' onClick={() => onDeleteLabel(entry.index)} />
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Fragment>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <WalletLabelCell>
          <Text weight={400} style={{ marginRight: 10 }}>
            {account.label}
          </Text>
          {isDefault && (
            <Banner label>
              <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.isdefault' defaultMessage='Default' />
            </Banner>
          )}
        </WalletLabelCell>
        <ComponentDropdown
          down
          forceSelected
          color={'gray-5'}
          selectedComponent={<MoreOptions />}
          components={[
            <ClickableText size='small' onClick={onEditBtcAccountLabel}>
              <FormattedMessage id='scenes.settings.manage_addresses.edit_name' defaultMessage='Edit Name' />
            </ClickableText>,
            (!isDefault && <ClickableText size='small' onClick={onMakeDefault}>
              <FormattedMessage id='scenes.settings.manage_addresses.make_default' defaultMessage='Make Default' />
            </ClickableText>),
            (!isDefault && <ClickableText size='small' onClick={onSetArchived}>
              <FormattedMessage id='scenes.settings.manage_addresses.archive' defaultMessage='Archive' />
            </ClickableText>),
            <ClickableText size='small' onClick={onShowXPub}>
              <FormattedMessage id='scenes.settings.manage_addresses.show_xpub' defaultMessage='Show xPub' />
            </ClickableText>
          ].filter(x => x)} />
      </div>
      <Text weight={400} size='14px' style={{ marginTop: 25 }}>
        <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.title' defaultMessage='Unused Addresses' />
      </Text>
      <Text weight={200} size='small' style={{ marginTop: 10, marginBottom: 15 }}>
        <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.message' defaultMessage='Your Blockchain Wallet contains an unlimited collection of bitcoin addresses that you can use to receive funds from anybody, globally. Your wallet will automatically manage your bitcoin addresses for you. The addresses below are the subset of addresses that are labeled.' />
      </Text>
      {unusedAddresses.length === 0 ? null : (
        <Table>
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
        </Table>
      )}
      <IconButton style={{ marginTop: 15 }} name='plus' onClick={() => onGenerateNextAddress()}>
        <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.addnext' defaultMessage='Add Next Address' />
      </IconButton>
    </Fragment>
  )
}

export default UnusedAddressesTemplate
