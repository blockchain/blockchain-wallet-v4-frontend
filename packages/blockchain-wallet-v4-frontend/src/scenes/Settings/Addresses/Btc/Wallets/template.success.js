import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import {
  Banner,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Text,
  IconButton,
  Link
} from 'blockchain-info-components'
import { take, filter } from 'ramda'
import media from 'services/ResponsiveService'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const BitcoinWalletsAddressesSettingHeader = styled(SettingHeader)`
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
const LabelCell = styled(Text)`
  margin-right: 6px;
`
const ErrorWrapper = styled.div`
  margin-bottom: 20px;
`
const ErrorMessageText = styled(Text)`
  margin-top: 5px;
`

const Success = ({
  wallets,
  handleClick,
  onUnarchive,
  search,
  failure,
  message
}) => {
  const isMatch = wallet =>
    !search || wallet.label.toLowerCase().indexOf(search) > -1
  const matchedWallets = filter(isMatch, take(wallets.length, wallets))

  const walletTableRows = matchedWallets.map(wallet => {
    return (
      <TableRow key={wallet.index}>
        <WalletTableCell width='50%'>
          <LabelCell size='13px'>{wallet.label}</LabelCell>
          {wallet.default && (
            <Banner label='true'>
              <FormattedMessage
                id='scenes.settings.addresses.btc.wallets.defaultlabel'
                defaultMessage='Default'
              />
            </Banner>
          )}
          {wallet.archived && (
            <Banner label={'true'} type='informational'>
              <FormattedMessage
                id='scenes.settings.addresses.btc.wallets.archivedlabel'
                defaultMessage='Archived'
              />
            </Banner>
          )}
        </WalletTableCell>
        <TableCell width='30%'>
          {!wallet.archived && (
            <SwitchableDisplay size='13px' coin='BTC'>
              {wallet.balance}
            </SwitchableDisplay>
          )}
        </TableCell>
        <TableCell
          width='20%'
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          {wallet.archived ? (
            <Link
              weight={400}
              size='13px'
              onClick={() => onUnarchive(wallet.index)}
            >
              <FormattedMessage
                id='scenes.settings.addresses.btc.wallets.unarchive'
                defaultMessage='Unarchive'
              />
            </Link>
          ) : (
            <LinkContainer to={`/settings/addresses/btc/${wallet.index}`}>
              <Link weight={400} size='13px'>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.wallets.manage'
                  defaultMessage='Manage'
                />
              </Link>
            </LinkContainer>
          )}
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      {failure && (
        <ErrorWrapper>
          <Banner type='warning'>
            <Text size='14px' color='error'>
              <FormattedMessage
                id='scenes.settings.addresses.btc.failurealert'
                defaultMessage='There is an issue with the wallet and this page may have limited functionality, such as balances not showing.'
              />
              <ErrorMessageText size='14px' color='error'>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.failuremessage'
                  defaultMessage='Message: {errorMessage}'
                  values={{
                    errorMessage: message || (
                      <span>
                        Please contact
                        <Link
                          size='14px'
                          href='https://support.blockchain.com/hc/en-us/requests/new'
                          target='_blank'
                        >
                          support
                        </Link>{' '}
                        for help resolving the problem
                      </span>
                    )
                  }}
                />
              </ErrorMessageText>
            </Text>
          </Banner>
        </ErrorWrapper>
      )}
      <BitcoinWalletsAddressesSettingHeader>
        <FormattedMessage
          id='scenes.settings.addresses.btc.wallets.bitcoinwallets'
          defaultMessage='Bitcoin Wallets'
        />
      </BitcoinWalletsAddressesSettingHeader>
      <SettingDescription>
        <FormattedMessage
          id='scenes.settings.addresses.btc.wallets.bitcoinwallets.description'
          defaultMessage='Wallets allow you to organize your funds into categories, like spending or savings. To see all of the individual addresses that have been generated for each wallet, click on ‘Manage‘.'
        />
      </SettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='50%'>
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.btc.wallets.walletname'
                defaultMessage='Wallet Name'
              />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.btc.wallets.balance'
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
                id='scenes.settings.addresses.btc.wallets.actions'
                defaultMessage='Actions'
              />
            </Text>
          </TableCell>
        </TableHeader>
        {search && !matchedWallets.length ? (
          <TableRow>
            <NoSearchMatchCell>
              <LabelCell size='13px'>
                <Text size='13px' weight={500}>
                  <FormattedMessage
                    id='scenes.settings.addresses.btc.wallets.nomatch'
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
      <IconButton style={{ marginTop: 10 }} name='plus' onClick={handleClick}>
        <FormattedMessage
          id='scenes.settings.addresses.btc.wallets.newhdaccount'
          defaultMessage='New Wallet'
        />
      </IconButton>
    </Wrapper>
  )
}

export default Success
