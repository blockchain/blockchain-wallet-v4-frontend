import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { SettingDescription, SettingHeader } from 'components/Setting'
import {
  Button,
  Icon,
  IconButton,
  Table,
  TableHeader,
  TableCell,
  Text
} from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import AddressRow from '../AddressRow'
import { filter } from 'ramda'

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
  importedAddresses,
  onClickImport,
  onClickVerify,
  onToggleArchived,
  onTransferAll,
  onShowPriv,
  onShowSignMessage,
  search,
  failure
}) => {
  const isMatch = address =>
    !search || address.addr.toLowerCase().indexOf(search) > -1
  const importedAddressesTableRows = filter(isMatch, importedAddresses).map(
    address => (
      <AddressRow
        key={address.addr}
        address={address}
        renderOptions={() =>
          [
            <ClickableText
              size='small'
              onClick={() => onToggleArchived(address)}
            >
              <FormattedMessage
                id='scenes.settings.addresses.archive'
                defaultMessage='Archive'
              />
            </ClickableText>
          ].concat(
            !address.priv
              ? []
              : [
                  !failure && (
                    <ClickableText
                      size='small'
                      onClick={() => onShowPriv(address)}
                    >
                      <FormattedMessage
                        id='scenes.settings.addresses.show_priv'
                        defaultMessage='Private Key'
                      />
                    </ClickableText>
                  ),
                  <ClickableText
                    size='small'
                    onClick={() => onShowSignMessage(address)}
                  >
                    <FormattedMessage
                      id='scenes.settings.addresses.sign_message'
                      defaultMessage='Sign Message'
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
                id='scenes.settings.addresses.btc.importedaddresses.success.description'
                defaultMessage='Imported funds are not protected by your backup phrase. To ensure these funds are secured, please transfer them directly into your wallet.'
              />
            </WarningWrapper>
          </SettingDescription>
        </div>
        <ImportedActions>
          <Button onClick={onClickVerify}>
            <FormattedMessage
              id='scenes.settings.addresses.btc.importedaddresses.success.verifymessage'
              defaultMessage='Verify Message'
            />
          </Button>
          <Button onClick={onTransferAll} nature='primary'>
            <FormattedMessage
              id='scenes.settings.addresses.btc.importedaddresses.success.transferall'
              defaultMessage='Transfer All'
            />
          </Button>
        </ImportedActions>
      </ImportedAddressesSettingHeader>
      {importedAddressesTableRows.length > 0 && (
        <Table>
          <TableHeader>
            <TableCell width='50%'>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.importedaddresses.success.address'
                  defaultMessage='Address'
                />
              </Text>
            </TableCell>
            <TableCell width='30%'>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.importedaddresses.success.balance'
                  defaultMessage='Balance'
                />
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
        <IconButton name='plus' onClick={onClickImport}>
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
