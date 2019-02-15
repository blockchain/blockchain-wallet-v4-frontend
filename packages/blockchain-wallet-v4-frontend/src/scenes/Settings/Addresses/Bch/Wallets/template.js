import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { filter, take } from 'ramda'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import {
  Banner,
  ComponentDropdown,
  Link,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Text
} from 'blockchain-info-components'
import media from 'services/ResponsiveService'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const BchWalletsAddressesSettingHeader = styled(SettingHeader)`
  justify-content: flex-start;
`
const WalletTableCell = styled(TableCell)`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 23px;

  ${media.mobile`
    flex-direction: column;
    align-items: flex-start;
  `};
`
const NoSearchMatchCell = styled(WalletTableCell)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`
const LabelCell = styled(Text)`
  margin-right: 6px;
`

const Success = props => {
  const { bchAccounts, wallets, defaultIndex } = props.data
  const {
    onEditBchAccountLabel,
    onShowChangeAddrs,
    onMakeDefault,
    onSetArchived,
    onShowXPub,
    search
  } = props
  const isMatch = wallet =>
    !search || wallet.label.toLowerCase().indexOf(search) > -1
  const matchedWallets = filter(isMatch, take(bchAccounts.length, wallets))

  const walletTableRows = matchedWallets.map((wallet, i) => {
    const isDefault = i === defaultIndex
    const isArchived = bchAccounts[i].archived

    return (
      <TableRow key={i} dataE2e='bchWalletRow'>
        <WalletTableCell width='50%'>
          <LabelCell size='13px' data-e2e='bchWalletName'>
            {wallet.label}
          </LabelCell>
          {isDefault && (
            <Banner label data-e2e='bchDefaultWalletBadge'>
              <FormattedMessage
                id='scenes.settings.addresses.bch.wallets.defaultlabel'
                defaultMessage='Default'
              />
            </Banner>
          )}
          {isArchived && (
            <Banner
              label
              type='informational'
              data-e2e='bchArchivedWalletBadge'
            >
              <FormattedMessage
                id='scenes.settings.addresses.bch.wallets.archivedlabel'
                defaultMessage='Archived'
              />
            </Banner>
          )}
        </WalletTableCell>
        <TableCell width='30%'>
          {!isArchived && (
            <SwitchableDisplay size='13px' coin='BCH'>
              {wallet.value.balance}
            </SwitchableDisplay>
          )}
        </TableCell>
        <TableCell
          width='20%'
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          {isArchived ? (
            <Link
              weight={400}
              size='13px'
              onClick={() => onSetArchived(wallet.value, false)}
              data-e2e='bchUnarchiveWalletLink'
            >
              <FormattedMessage
                id='scenes.settings.addresses.bch.unarchive'
                defaultMessage='Unarchive'
              />
            </Link>
          ) : (
            <ComponentDropdown
              down
              forceSelected
              color={'gray-5'}
              selectedComponent={
                <Link weight={400} size='13px' data-e2e='bchManageWalletLink'>
                  <FormattedMessage
                    id='scenes.settings.addresses.bch.wallets.manage'
                    defaultMessage='Manage Wallet'
                  />
                </Link>
              }
              components={[
                <ClickableText
                  size='small'
                  onClick={() => onEditBchAccountLabel(wallet.value)}
                  data-e2e='bchEditWalletNameLink'
                >
                  <FormattedMessage
                    id='scenes.settings.addresses.bch.edit_name'
                    defaultMessage='Edit Wallet Name'
                  />
                </ClickableText>,
                !isDefault && !isArchived && (
                  <ClickableText
                    size='small'
                    onClick={() => onMakeDefault(wallet.value)}
                    data-e2e='bchMakeWalletDefaultLink'
                  >
                    <FormattedMessage
                      id='scenes.settings.addresses.bch.make_default'
                      defaultMessage='Make Default'
                    />
                  </ClickableText>
                ),
                !isDefault &&
                  (isArchived ? (
                    <ClickableText
                      size='small'
                      onClick={() => onSetArchived(wallet.value, false)}
                      data-e2e='bchUnarchiveWalletLink'
                    >
                      <FormattedMessage
                        id='scenes.settings.addresses.bch.unarchive'
                        defaultMessage='Unarchive'
                      />
                    </ClickableText>
                  ) : (
                    <ClickableText
                      size='small'
                      onClick={() => onSetArchived(wallet.value, true)}
                      data-e2e='bchArchiveWalletLink'
                    >
                      <FormattedMessage
                        id='scenes.settings.addresses.bch.archive'
                        defaultMessage='Archive'
                      />
                    </ClickableText>
                  )),
                <ClickableText
                  size='small'
                  onClick={() => onShowXPub(wallet.value)}
                  data-e2e='bchShowWalletXpub'
                >
                  <FormattedMessage
                    id='scenes.settings.addresses.bch.show_xpub'
                    defaultMessage='Show xPub'
                  />
                </ClickableText>,
                <ClickableText
                  size='small'
                  onClick={() => onShowChangeAddrs(wallet.value)}
                  data-e2e='bchShowChangeAddressesLink'
                >
                  <FormattedMessage
                    id='scenes.settings.addresses.bch.showchangeaddrs'
                    defaultMessage='Show Change Addresses'
                  />
                </ClickableText>
              ]}
            />
          )}
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      <BchWalletsAddressesSettingHeader>
        <FormattedMessage
          id='scenes.settings.addresses.bch.wallets.title'
          defaultMessage='Bitcoin Cash Wallets'
        />
      </BchWalletsAddressesSettingHeader>
      <SettingDescription>
        <FormattedMessage
          id='scenes.settings.addresses.bch.wallets.description'
          defaultMessage='Wallets allow you to organize your funds into categories, like spending or savings. To see all of the individual addresses that have been generated for each wallet, click on ‘Manage‘.'
        />
      </SettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='50%'>
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.bch.wallets.walletname'
                defaultMessage='Wallet Name'
              />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.bch.wallets.balance'
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
                id='scenes.settings.addresses.bch.wallets.actions'
                defaultMessage='Actions'
              />
            </Text>
          </TableCell>
        </TableHeader>
        {search && !matchedWallets.length ? (
          <TableRow dataE2e='noBchWalletResults'>
            <NoSearchMatchCell>
              <LabelCell size='13px'>
                <Text size='13px' weight={500}>
                  <FormattedMessage
                    id='scenes.settings.addresses.bch.wallets.nomatch'
                    defaultMessage='No wallets matched your search'
                  />
                </Text>
              </LabelCell>
            </NoSearchMatchCell>
          </TableRow>
        ) : (
          walletTableRows
        )}
      </Table>
    </Wrapper>
  )
}

export default Success
