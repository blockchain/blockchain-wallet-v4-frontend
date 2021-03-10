import React from 'react'
import { FormattedMessage } from 'react-intl'
import { filter } from 'ramda'
import styled from 'styled-components'

import {
  Button,
  TableCell,
  TableHeader,
  Text
} from 'blockchain-info-components'
import { SettingDescription, SettingHeader } from 'components/Setting'

import { Table } from '../../components'
import AddressRow from '../../components/AddressRow'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const TitleHeader = styled(SettingHeader)`
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 20px;
  margin-top: 30px;
`
const SubTitleHeader = styled(SettingDescription)`
  margin-bottom: 20px;
`
const ClickableText = styled(Text)`
  cursor: pointer;
  text-align: right;
`

const BchImportedAddresses = props => {
  const { importedAddresses, onEditLabel, onTransferAll, search } = props

  const isMatch = address =>
    !search || address.addr.toLowerCase().indexOf(search) > -1

  const importedAddressesTableRows = filter(isMatch, importedAddresses).map(
    address => {
      return (
        <AddressRow
          key={address.addr}
          address={address}
          coin='BCH'
          dataE2e='bchImportedAddressRow'
          renderOptions={() => [
            <ClickableText
              size='small'
              onClick={() => onEditLabel(address)}
              data-e2e='btcSignMessageImportedAddressLink'
            >
              <FormattedMessage
                id='scenes.settings.addresses.edit_name'
                defaultMessage='Edit Label'
              />
            </ClickableText>
          ]}
        />
      )
    }
  )

  return (
    <Wrapper>
      <TitleHeader>
        <div>
          <FormattedMessage
            id='scenes.settings.addresses.bch.importedaddresses.title'
            defaultMessage='Imported Bitcoin Cash Addresses'
          />
          <SubTitleHeader>
            <FormattedMessage
              id='scenes.settings.addresses.bch.importedaddresses.desc'
              defaultMessage='Imported funds are not protected by your Secret Private Key Recovery Phrase. To ensure these funds are secured, please transfer them directly into your wallet.'
            />
          </SubTitleHeader>
        </div>
        {importedAddressesTableRows.length > 0 && (
          <div>
            <Button
              data-e2e='bchTransferAllButton'
              height='36px'
              size='14px'
              onClick={onTransferAll}
              nature='primary'
              style={{ marginRight: '-10px' }}
            >
              <FormattedMessage
                id='scenes.settings.addresses.bch.importedaddresses.success.transferall'
                defaultMessage='Transfer All'
              />
            </Button>
          </div>
        )}
      </TitleHeader>
      {importedAddressesTableRows.length > 0 && (
        <Table dataE2e='bchImportedAddressesTable'>
          <TableHeader>
            <TableCell width='50%'>
              <Text color='grey900' size='14px' weight={500}>
                <FormattedMessage id='copy.address' defaultMessage='Address' />
              </Text>
            </TableCell>
            <TableCell width='20%'>
              <Text color='grey900' size='14px' weight={500}>
                <FormattedMessage id='copy.balance' defaultMessage='Balance' />
              </Text>
            </TableCell>
            <TableCell width='20%'>
              <Text color='grey900' size='14px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.bch.importedaddresses.success.label'
                  defaultMessage='Label'
                />
              </Text>
            </TableCell>
            <TableCell
              width='10%'
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Text color='grey900' size='14px' weight={500}>
                <FormattedMessage id='copy.actions' defaultMessage='Actions' />
              </Text>
            </TableCell>
          </TableHeader>
          {importedAddressesTableRows}
        </Table>
      )}
    </Wrapper>
  )
}

export default BchImportedAddresses
