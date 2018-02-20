import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Icon, TabMenu, TabMenuItem, Text, Table, TableHeader, TableCell, TableRow, Button } from 'blockchain-info-components'
import HorizontalMenu from 'components/HorizontalMenu'
import { actions, selectors } from 'data'
import { Types } from 'blockchain-wallet-v4'
import settings from 'config'

const Wrapper = styled.div`
  width: 100%;
`

const InnerWrapper = styled.div`
  padding: 40px 30px;
`

class ManageAddressesContainer extends React.Component {
  render () {
    let { account, labels, receiveIndex, actions } = this.props
    let deriveAddress = (i) => Types.HDAccount.getReceiveAddress(account, i, settings.NETWORK_BITCOIN)
    let generateNewLabel = (i) => actions.setHdAddressLabel(account.index, i, 'New Address')

    return (
      <Wrapper>
        <HorizontalMenu>
          <TabMenu>
            <LinkContainer to='/settings/addresses'>
              <TabMenuItem>
                <Icon name='left-arrow' />
              </TabMenuItem>
            </LinkContainer>
          </TabMenu>
        </HorizontalMenu>
        <InnerWrapper>
          <Text weight={400}>
            {account.label}
          </Text>
          <Text weight={400} size='small' style={{ marginTop: 25 }}>
            <FormattedMessage id='scenes.settings.manage_addresses.unused_addresses' defaultMessage='Unused Addresses' />
          </Text>
          <Text weight={200} size='small' style={{ marginTop: 10 }}>
            <FormattedMessage id='scenes.settings.manage_addresses.unused_addresses.message' defaultMessage='Your Blockchain Wallet contains an unlimited collection of bitcoin addresses that you can use to receive funds from anybody, globally. Your wallet will automatically manage your bitcoin addresses for you. The addresses below are the subset of addresses that are labeled.' />
          </Text>
          {receiveIndex.cata({
            Success: (index) => (
              <Button onClick={() => generateNewLabel(index)}>
                Add label
              </Button>
            ),
            Failure: () => null,
            Loading: () => null,
            NotAsked: () => null
          })}
          <Table>
            <TableHeader>
              <TableCell width='30%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='scenes.settings.addresses.address' defaultMessage='Address' />
                </Text>
              </TableCell>
              <TableCell width='30%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='scenes.settings.addresses.address_label' defaultMessage='Label' />
                </Text>
              </TableCell>
            </TableHeader>
            {labels.map(entry => (
              <TableRow key={entry.index}>
                <TableCell width='30%'>
                  <Text size='13px'>{deriveAddress(entry.index)}</Text>
                </TableCell>
                <TableCell width='30%'>
                  <Text size='13px'>{entry.label}</Text>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </InnerWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state, props) => {
  let index = props.computedMatch.params.index
  let account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(index)
  let labels = Types.HDAccount.selectAddressLabels(account).toArray()
  let nextReceiveIndex = selectors.core.data.bitcoin.getReceiveIndex(account.xpub, state)
  let lastLabeledIndex = labels.reduce((acc, l) => Math.max(acc, l.index), 0)
  let receiveIndex = nextReceiveIndex.map(i => Math.max(i, lastLabeledIndex + 1))
  return { account, labels, receiveIndex }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageAddressesContainer)
