import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Icon,
  IconButton,
  Table,
  TableCell,
  TableHeader,
  Text
} from 'blockchain-info-components'
import { filter } from 'ramda'
import styled from 'styled-components'

import { SettingDescription, SettingHeader } from 'components/Setting'
import { spacing } from 'services/styles'
import AddressRow from '../AddressRow'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const ImportedAddressesSettingHeader = styled(SettingHeader)`
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`
const ImportedActions = styled.div`
  display: flex;
  > button {
    margin-left: 10px;
  }
`
const WarningWrapper = styled.div`
  display: flex;
  .warning-icon {
    margin-right: 7px;
    float: left;
  }
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const Success = ({
  failure,
  importedAddresses,
  onClickImport,
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
  onClickImport: any
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
          <FormattedMessage
            id='scenes.settings.addresses.btc.importedaddresses.success.title'
            defaultMessage='Imported Bitcoin Addresses'
          />
          <SettingDescription style={spacing('mb-10')}>
            <WarningWrapper>
              <Icon
                name='alert-filled'
                size='20px'
                className={'warning-icon'}
                color='brand-yellow'
              />
              <FormattedMessage
                id='scenes.settings.addresses.btc.importedaddresses.success.description1'
                defaultMessage='Imported funds are not protected by your Secret Private Key Recovery Phrase. To ensure these funds are secured, please transfer them directly into your wallet.'
              />
            </WarningWrapper>
          </SettingDescription>
        </div>
        <ImportedActions>
          <Button
            onClick={onClickVerify}
            data-e2e='btcVerifyMessageImportedAddressLink'
          >
            <FormattedMessage
              id='scenes.settings.addresses.btc.importedaddresses.success.verifymessage'
              defaultMessage='Verify Message'
            />
          </Button>
          {importedAddressesTableRows.length > 0 && (
            <Button
              onClick={onTransferAll}
              nature='primary'
              data-e2e='btcTransferAllImportedAddressLink'
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
              <Text size='13px' weight={500}>
                <FormattedMessage id='copy.address' defaultMessage='Address' />
              </Text>
            </TableCell>
            <TableCell width='20%'>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.importedaddresses.success.label'
                  defaultMessage='Label'
                />
              </Text>
            </TableCell>
            <TableCell width='10%'>
              <Text size='13px' weight={500}>
                <FormattedMessage id='copy.balance' defaultMessage='Balance' />
              </Text>
            </TableCell>
            <TableCell
              width='20%'
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Text size='13px' weight={500}>
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
      <div style={spacing('mt-10')}>
        <IconButton
          name='plus'
          onClick={onClickImport}
          data-e2e='btcImportedAddressLink'
        >
          <FormattedMessage
            id='scenes.settings.addresses.btc.importedaddresses.success.importbitcoinaddress'
            defaultMessage='Import Bitcoin Address'
          />
        </IconButton>
      </div>
    </Wrapper>
  )
}

export default Success
