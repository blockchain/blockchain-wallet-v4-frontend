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
`
const ImportedAddressesSettingHeader = styled(SettingHeader)`
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`
const ImportedActions = styled.div`
  display: flex;
  margin-right: 0;
  > button {
    margin-left: 10px;
  }
`
const Description = styled(SettingDescription)`
  margin-bottom: 20px;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const Success = ({
  failure,
  importedAddresses,
  onClickVerify,
  onEditLabel,
  onShowPriv,
  onShowSignMessage,
  onToggleArchived,
  onTransferAll,
  search
}: {
  failure?: any
  importedAddresses: any
  onClickVerify: any
  onEditLabel: any
  onShowPriv: any
  onShowSignMessage: any
  onToggleArchived: any
  onTransferAll: any
  search: any
}) => {
  const isMatch = address =>
    !search || address.addr.toLowerCase().indexOf(search) > -1
  const importedAddressesTableRows = filter(isMatch, importedAddresses).map(
    address => (
      <AddressRow
        coin='BTC'
        key={address.addr}
        address={address}
        dataE2e='btcImportedAddressRow'
        renderOptions={() =>
          [
            <ClickableText
              size='small'
              onClick={() => onToggleArchived(address)}
              data-e2e='btcArchiveImportedAddressLink'
            >
              <FormattedMessage
                id='scenes.settings.addresses.archive'
                defaultMessage='Archive'
              />
            </ClickableText>
          ].concat(
            // @ts-ignore
            !address.priv
              ? []
              : [
                  !failure && (
                    <ClickableText
                      size='small'
                      onClick={() => onShowPriv(address)}
                      data-e2e='btcShowPrivKeyImportedAddressLink'
                    >
                      <FormattedMessage
                        id='copy.private_key'
                        defaultMessage='Private Key'
                      />
                    </ClickableText>
                  ),
                  <ClickableText
                    size='small'
                    onClick={() => onShowSignMessage(address)}
                    data-e2e='btcSignMessageImportedAddressLink'
                  >
                    <FormattedMessage
                      id='scenes.settings.addresses.sign_message'
                      defaultMessage='Sign Message'
                    />
                  </ClickableText>,
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
                ]
          )
        }
      />
    )
  )

  return (
    <Wrapper>
      <ImportedAddressesSettingHeader>
        <div>
          <TitleHeader>
            <FormattedMessage
              id='scenes.settings.addresses.btc.importedaddresses.success.title'
              defaultMessage='Imported Bitcoin Addresses'
            />
          </TitleHeader>
          <Description>
            <FormattedMessage
              id='scenes.settings.addresses.btc.importedaddresses.success.description1'
              defaultMessage='Imported funds are not protected by your Secret Private Key Recovery Phrase. To ensure these funds are secured, please transfer them directly into your wallet.'
            />
          </Description>
        </div>
        <ImportedActions>
          <Button
            data-e2e='btcVerifyMessageImportedAddressLink'
            height='36px'
            nature='empty-secondary'
            onClick={onClickVerify}
            size='14px'
          >
            <FormattedMessage
              id='scenes.settings.addresses.btc.importedaddresses.success.verifymessage'
              defaultMessage='Verify Message'
            />
          </Button>
          {importedAddressesTableRows.length > 0 && (
            <Button
              data-e2e='btcTransferAllImportedAddressLink'
              height='36px'
              nature='primary'
              onClick={onTransferAll}
              size='14px'
            >
              <FormattedMessage
                id='scenes.settings.addresses.btc.importedaddresses.success.transferall'
                defaultMessage='Transfer All'
              />
            </Button>
          )}
        </ImportedActions>
      </ImportedAddressesSettingHeader>
      {importedAddressesTableRows.length > 0 && (
        <Table data-e2e='btcImportedAddrTable'>
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
                  id='scenes.settings.addresses.btc.importedaddresses.success.label'
                  defaultMessage='Label'
                />
              </Text>
            </TableCell>
            <TableCell
              width='10%'
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Text color='grey900' size='14px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.importedaddresses.success.actions'
                  defaultMessage='Actions'
                />
              </Text>
            </TableCell>
          </TableHeader>
          {importedAddressesTableRows}
        </Table>
      )}
    </Wrapper>
  )
}

export default Success
