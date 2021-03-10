import React from 'react'
import { FormattedMessage } from 'react-intl'
import { filter, path, take } from 'ramda'
import styled from 'styled-components'

import {
  Banner,
  ComponentDropdown,
  Link,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { media } from 'services/styles'

import { Table } from '../../components'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const TitleHeader = styled(SettingHeader)`
  font-weight: 500;
  font-size: 20px;
  justify-content: flex-start;
`
const SubTitleHeader = styled(SettingDescription)`
  margin-bottom: 20px;
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
  font-weight: 500;
`

const WalletRow = props => {
  const { bchAccounts, defaultIndex, wallets } = props.data
  const {
    onEditBchAccountLabel,
    onMakeDefault,
    onSetArchived,
    onShowChangeAddrs,
    onShowXPub,
    search
  } = props
  const isMatch = wallet =>
    !search || wallet.label.toLowerCase().indexOf(search) > -1
  const matchedWallets = filter(isMatch, take(bchAccounts.length, wallets))

  const walletTableRows = matchedWallets.map((wallet, i) => {
    const isDefault = path(['value', 'index'], wallet) === defaultIndex
    const isArchived = path(['value', 'archived'], wallet)

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
            <SwitchableDisplay size='13px' coin='BCH' weight={500}>
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
              weight={500}
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
            <div>
              <ComponentDropdown
                color='grey900'
                down
                forceSelected
                margin='0 3px 0 0'
                width='165px'
                textAlign='end'
                selectedComponent={
                  <Link weight={500} size='13px' data-e2e='bchManageWalletLink'>
                    <FormattedMessage
                      id='buttons.manage'
                      defaultMessage='Manage'
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
            </div>
          )}
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      <TitleHeader>
        <FormattedMessage
          id='scenes.settings.addresses.bch.wallets.title'
          defaultMessage='Bitcoin Cash Wallets'
        />
      </TitleHeader>
      <SubTitleHeader>
        <FormattedMessage
          id='scenes.settings.addresses.bch.wallets.desc'
          defaultMessage='Wallets allow you to organize your funds into categories, like spending or savings.'
        />
      </SubTitleHeader>
      <Table>
        <TableHeader>
          <TableCell width='50%'>
            <Text color='grey900' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.bch.wallets.walletname'
                defaultMessage='Wallet Name'
              />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text color='grey900' size='14px' weight={500}>
              <FormattedMessage id='copy.balance' defaultMessage='Balance' />
            </Text>
          </TableCell>
          <TableCell
            width='20%'
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Text color='grey900' size='14px' weight={500}>
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

export default WalletRow
