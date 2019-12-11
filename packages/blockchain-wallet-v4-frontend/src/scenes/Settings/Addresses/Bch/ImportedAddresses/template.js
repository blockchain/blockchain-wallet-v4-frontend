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
import { FormattedMessage } from 'react-intl'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { spacing } from 'services/StyleService'
import AddressRow from '../../Btc/AddressRow'
import React from 'react'
import styled from 'styled-components'

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

const BchImportedAddresses = props => {
  const {
    importedAddresses,
    onTransferAll,
    search,
    onEditLabel,
    handleClickImport,
    handleShowPriv,
    handleSignMessage,
    onClickVerify
  } = props

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
          renderOptions={() =>
            [
              <ClickableText
                size='small'
                onClick={() => onEditLabel(address)}
                data-e2e='bchImportedAddressEditLabel'
              >
                <FormattedMessage
                  id='scenes.settings.addresses.bch.edit_name'
                  defaultMessage='Edit Label'
                />
              </ClickableText>
            ].concat(
              !address.priv
                ? []
                : [
                    <ClickableText
                      size='small'
                      onClick={() => handleShowPriv(address)}
                      data-e2e='bchImportedAddressShowPriv'
                    >
                      <FormattedMessage
                        id='scenes.settings.addresses.bch.edit_label'
                        defaultMessage='Private Key'
                      />
                    </ClickableText>,
                    <ClickableText
                      size='small'
                      onClick={() => handleSignMessage(address)}
                      data-e2e='bchImportedAddressSignMessage'
                    >
                      <FormattedMessage
                        id='scenes.settings.addresses.bch.sign_message'
                        defaultMessage='Sign Message'
                      />
                    </ClickableText>
                  ]
            )
          }
        />
      )
    }
  )

  return (
    <Wrapper>
      <ImportedAddressesSettingHeader>
        <div>
          <FormattedMessage
            id='scenes.settings.addresses.bch.importedaddresses.title'
            defaultMessage='Imported Bitcoin Cash Addresses'
          />
          <SettingDescription>
            <WarningWrapper>
              <Icon
                name='alert-filled'
                size='22px'
                className={'warning-icon'}
                color='brand-yellow'
              />
              <FormattedMessage
                id='scenes.settings.addresses.bch.importedaddresses.description'
                defaultMessage='Imported funds are not protected by your backup phrase. To ensure these funds are secured, please transfer them directly into your wallet.'
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
              id='scenes.settings.addresses.bch.importedaddresses.success.verifymessage'
              defaultMessage='Verify Message'
            />
          </Button>
          {importedAddressesTableRows.length > 0 && (
            <Button
              onClick={onTransferAll}
              nature='primary'
              data-e2e='bchTransferAllButton'
            >
              <FormattedMessage
                id='scenes.settings.addresses.bch.importedaddresses.success.transferall'
                defaultMessage='Transfer All'
              />
            </Button>
          )}
        </ImportedActions>
      </ImportedAddressesSettingHeader>
      {importedAddressesTableRows.length > 0 && (
        <Table dataE2e='bchImportedAddressesTable'>
          <TableHeader>
            <TableCell width='40%'>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.bch.importedaddresses.address'
                  defaultMessage='Address'
                />
              </Text>
            </TableCell>
            <TableCell width='30%'>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.bch.importedaddresses.success.label'
                  defaultMessage='Label'
                />
              </Text>
            </TableCell>
            <TableCell width='15%'>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.bch.importedaddresses.balance'
                  defaultMessage='Balance'
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
          onClick={handleClickImport}
          data-e2e='bchImportedAddressLink'
        >
          <FormattedMessage
            id='scenes.settings.addresses.bch.importedaddresses.success.importbitcoinaddress'
            defaultMessage='Import Bitcoin Cash Address'
          />
        </IconButton>
      </div>
    </Wrapper>
  )
}

export default BchImportedAddresses
