import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { IconButton, Table, TableHeader, TableCell, TableRow, Text, Link } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const ImportedAddressesSettingHeader = SettingHeader.extend`
  justify-content: flex-start;
  margin-top: 30px;
`

const Success = ({ importedAddresses, onClickImport, onToggleArchived }) => {
  const importedAddressesTableRows = importedAddresses.map((address, i) => {
    return (
      <TableRow key={i}>
        <TableCell width='40%' style={{ display: 'flex' }}>
          <Text size='13px'>{address.addr}</Text>
          {address.priv == null && (
            <Text size='13px' weight={300} style={spacing('ml-10')}>Watch Only</Text>
          )}
        </TableCell>
        <TableCell width='40%'>
          <Text size='13px'><SwitchableDisplay coin='BTC'>{address.info && address.info.final_balance}</SwitchableDisplay></Text>
        </TableCell>
        <TableCell width='20%'>
          <Link weight={200} size='small' onClick={() => onToggleArchived(address)}>
            <FormattedMessage id='scenes.settings.addresses.archive' defaultMessage='Archive' />
          </Link>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      <ImportedAddressesSettingHeader>
        <FormattedMessage id='scenes.settings.addresses.imported_bitcoin_addrs' defaultMessage='Imported Bitcoin Addresses' />
      </ImportedAddressesSettingHeader>
      <SettingDescription style={spacing('mb-10')}>
        <FormattedMessage id='scenes.settings.addresses.imported_bitcoin_addrs_desc' defaultMessage='⚠️ Not backed up by your Recovery Phrase. Transfer into a wallet to secure funds.' />
      </SettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='40%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.imported_addresses.address' defaultMessage='Address' />
            </Text>
          </TableCell>
          <TableCell width='40%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.imported_addresses.wallet_description' defaultMessage='Balance' />
            </Text>
          </TableCell>
        </TableHeader>
        { importedAddressesTableRows }
      </Table>
      <div style={spacing('mt-10')}>
        <IconButton name='up-arrow-in-circle' onClick={onClickImport}>
          <FormattedMessage id='scenes.settings.imported_addresses.import_bitcoin_addr' defaultMessage='Import Bitcoin Address' />
        </IconButton>
      </div>
    </Wrapper>
  )
}

export default Success
