import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { IconButton, Table, TableHeader, TableCell, Text } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import OptionItem from '../OptionItem'
import AddressRow from '../AddressRow'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const ImportedAddressesSettingHeader = SettingHeader.extend`
  justify-content: flex-start;
  margin-top: 30px;
`
const WarningSign = styled.span`
  font-size: 18px;
`

const Success = ({ importedAddresses, onClickImport, onToggleArchived, onShowPriv }) => {
  const importedAddressesTableRows = importedAddresses.map((address) => (
    <AddressRow key={address.addr} address={address} renderOptions={() => [
      <OptionItem id='scens.settings.addresses.archive' defaultMessage='Archive' onClick={() => onToggleArchived(address)} />
    ].concat(
      !address.priv ? [] : [
        <OptionItem id='scens.settings.addresses.show_priv' defaultMessage='Private Key' onClick={() => onShowPriv(address)} />,
        <OptionItem id='scens.settings.addresses.sign_message' defaultMessage='Sign Message' onClick={() => console.log('sign_message')} />
      ]
    )} />
  ))

  return (
    <Wrapper>
      <ImportedAddressesSettingHeader>
        <FormattedMessage id='scenes.settings.addresses.imported_bitcoin_addrs' defaultMessage='Imported Bitcoin Addresses' />
      </ImportedAddressesSettingHeader>
      <SettingDescription style={spacing('mb-10')}>
        <WarningSign>⚠️</WarningSign>
        <FormattedMessage id='scenes.settings.addresses.imported_bitcoin_addrs_desc' defaultMessage='Imported funds are not protected by your backup phrase. To ensure these funds are secured, please transfer them directly into your wallet.' />
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
