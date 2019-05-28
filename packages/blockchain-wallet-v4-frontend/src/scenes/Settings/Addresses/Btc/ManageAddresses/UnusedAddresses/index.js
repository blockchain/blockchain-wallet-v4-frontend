import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { length, prop } from 'ramda'
import PropTypes from 'prop-types'
import { formValueSelector } from 'redux-form'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import * as C from 'services/AlertService'
import { actions, model, selectors } from 'data'
import { Types } from 'blockchain-wallet-v4'
import UnusedAddresses from './template'
import {
  Banner,
  ComponentDropdown,
  FlatLoader,
  Link,
  IconButton,
  Text
} from 'blockchain-info-components'

const { ADDRESS_EVENTS, WALLET_EVENTS } = model.analytics
const { ADD_NEXT_ADDR, DELETE_LABEL, EDIT_LABEL } = ADDRESS_EVENTS
const { ARCHIVE, CHANGE_DEFAULT, EDIT_NAME, SHOW_XPUB } = WALLET_EVENTS
const WalletLabelCell = styled.div`
  display: flex;
  align-items: center;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`
class UnusedAddressesContainer extends React.PureComponent {
  componentDidMount () {
    const { componentActions, derivation, walletIndex } = this.props
    componentActions.fetchUnusedAddresses(walletIndex, derivation)
  }

  // TODO: SEGWIT
  onEditLabel = i => {
    const {
      accountIndex,
      analyticsActions,
      componentActions,
      walletIndex
    } = this.props
    componentActions.editAddressLabel(accountIndex, walletIndex, i)
    analyticsActions.logEvent(EDIT_LABEL)
  }

  // TODO: SEGWIT
  onDeleteLabel = i => {
    const {
      accountIndex,
      analyticsActions,
      modalsActions,
      walletIndex
    } = this.props
    modalsActions.showModal('DeleteAddressLabel', {
      accountIdx: accountIndex,
      walletIdx: walletIndex,
      addressIdx: i
    })
    analyticsActions.logEvent(DELETE_LABEL)
  }

  // TODO: SEGWIT
  onEditBtcAccountLabel = () => {
    const {
      accountIndex,
      accountLabel,
      analyticsActions,
      walletActions
    } = this.props
    walletActions.editBtcAccountLabel(accountIndex, accountLabel)
    analyticsActions.logEvent(EDIT_NAME)
  }

  // TODO: SEGWIT
  onShowXPub = () => {
    const { account, analyticsActions, modalsActions } = this.props
    modalsActions.showModal('ShowXPub', { xpub: account.xpub })
    analyticsActions.logEvent(SHOW_XPUB)
  }

  // TODO: SEGWIT
  onMakeDefault = () => {
    const { accountIndex, analyticsActions, coreActions } = this.props
    coreActions.setDefaultAccountIdx(accountIndex)
    analyticsActions.logEvent(CHANGE_DEFAULT)
  }

  // TODO: SEGWIT
  onGenerateNextAddress = () => {
    const {
      alertActions,
      analyticsActions,
      componentActions,
      unusedAddresses,
      walletIndex
    } = this.props
    if (length(unusedAddresses.getOrElse([])) >= 15) {
      alertActions.displayError(C.ADDRESS_LABEL_MAXIMUM_ERROR)
    } else {
      componentActions.generateNextReceiveAddress(walletIndex)
    }
    analyticsActions.logEvent(ADD_NEXT_ADDR)
  }

  // TODO: SEGWIT
  onSetArchived = () => {
    const {
      accountIndex,
      analyticsActions,
      coreActions,
      routerActions
    } = this.props
    coreActions.setAccountArchived(accountIndex, true)
    routerActions.push('/settings/addresses/btc')
    analyticsActions.logEvent(ARCHIVE)
  }

  render () {
    const {
      accountLabel,
      derivation,
      isDefault,
      search,
      unusedAddresses
    } = this.props

    return (
      <React.Fragment>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <WalletLabelCell>
            <Text
              weight={500}
              style={{ marginRight: 10 }}
              data-e2e='btcWalletName'
            >
              {accountLabel}
            </Text>
            <Banner label data-e2e='btcWalletDerivation' type='informational'>
              {derivation.charAt(0).toUpperCase() + derivation.slice(1)}
            </Banner>
            {isDefault && (
              <Banner label data-e2e='btcDefaultWallet'>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.isdefault'
                  defaultMessage='Default'
                />
              </Banner>
            )}
          </WalletLabelCell>
          <ComponentDropdown
            down
            forceSelected
            color={'gray-5'}
            selectedComponent={
              <Link
                weight={500}
                size='13px'
                data-e2e='btcWalletMoreOptionsDropdown'
              >
                <FormattedMessage
                  id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.moreoptions'
                  defaultMessage='More Options'
                />
              </Link>
            }
            components={[
              <ClickableText
                size='small'
                onClick={this.onEditBtcAccountLabel}
                data-e2e='btcEditWalletNameLink'
              >
                <FormattedMessage
                  id='scenes.settings.manage_addresses.edit_name'
                  defaultMessage='Edit Name'
                />
              </ClickableText>,
              !isDefault && (
                <React.Fragment>
                  <ClickableText
                    size='small'
                    onClick={this.onMakeDefault}
                    data-e2e='btcMakeWalletDefaultLink'
                  >
                    <FormattedMessage
                      id='scenes.settings.manage_addresses.make_default'
                      defaultMessage='Make Default'
                    />
                  </ClickableText>
                  <ClickableText
                    size='small'
                    onClick={this.onSetArchived}
                    data-e2e='btcArchiveWalletLink'
                  >
                    <FormattedMessage
                      id='scenes.settings.manage_addresses.archive'
                      defaultMessage='Archive'
                    />
                  </ClickableText>
                </React.Fragment>
              ),
              <ClickableText
                size='small'
                onClick={this.onShowXPub}
                data-e2e='btcShowWalletXpubLink'
              >
                <FormattedMessage
                  id='scenes.settings.manage_addresses.show_xpub'
                  defaultMessage='Show xPub'
                />
              </ClickableText>
            ].filter(x => x)}
          />
        </div>
        <Text weight={500} size='14px' style={{ marginTop: 25 }}>
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.title'
            defaultMessage='Unused Addresses'
          />
        </Text>
        <Text
          weight={400}
          size='small'
          style={{ marginTop: 10, marginBottom: 15 }}
        >
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.message'
            defaultMessage='Your Blockchain Wallet contains an unlimited collection of bitcoin addresses that you can use to receive funds from anybody, globally. Your wallet will automatically manage your bitcoin addresses for you. The addresses below are the subset of addresses that are labeled.'
          />
        </Text>
        {!unusedAddresses
          ? null
          : unusedAddresses.cata({
              Success: unusedAddresses => (
                <UnusedAddresses
                  search={search}
                  onDeleteLabel={this.onDeleteLabel}
                  onEditLabel={this.onEditLabel}
                  unusedAddresses={unusedAddresses}
                />
              ),
              Failure: () => <div />,
              Loading: () => (
                <FlatLoader
                  style={{ margin: '25px auto' }}
                  width='100px'
                  height='12px'
                />
              ),
              NotAsked: () => <div />
            })}
        <IconButton
          style={{ marginTop: 15 }}
          name='plus'
          onClick={this.onGenerateNextAddress}
          data-e2e='btcAddNextAddressButton'
        >
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.addnext'
            defaultMessage='Add Next Address'
          />
        </IconButton>
      </React.Fragment>
    )
  }
}

UnusedAddressesContainer.propTypes = {
  derivation: PropTypes.string.isRequired,
  walletIndex: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { walletIndex } = ownProps
  const account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(
    walletIndex
  )
  const isDefault =
    parseInt(walletIndex) ===
    Types.HDWallet.selectDefaultAccountIdx(
      Types.Wallet.selectHdWallets(state.walletPath.wallet).get(0)
    )
  const unusedAddresses = selectors.components.manageAddresses.getWalletUnusedAddresses(
    state,
    walletIndex
  )

  return {
    accountIndex: prop('index', account),
    accountLabel: prop('label', account),
    isDefault,
    unusedAddresses,
    search: formValueSelector('manageAddresses')(state, 'search')
  }
}

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  componentActions: bindActionCreators(
    actions.components.manageAddresses,
    dispatch
  ),
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnusedAddressesContainer)
