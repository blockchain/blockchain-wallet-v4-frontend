import { FormattedMessage } from 'react-intl'
import { Link, Text, TextGroup, Tooltip } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

// TODO: remove this
// Hide tooltips on IE Edge because of a CSP issue
const TooltipWrapper = styled.div`
  @supports (-ms-ime-align: auto) {
    display: none;
  }
`
class Tooltips extends React.PureComponent {
  render () {
    return (
      <TooltipWrapper>
        <Tooltip id='copied'>
          <FormattedMessage id='tooltip.copied' defaultMessage='Copied!' />
        </Tooltip>
        <Tooltip id='addr' multiline offset={{ bottom: 8 }} />
        <Tooltip id='lockbox.exportkeyswarning'>
          <FormattedMessage
            id='modals.lockboxsetup.pairdevice.exportkeyswarning.tooltip'
            defaultMessage='Exporting the public keys from the device allows the app to show your hardware wallets balances even when the device is not connected to your computer.'
          />
        </Tooltip>
        <Tooltip id='recurring.tooltip'>
          <FormattedMessage
            id='orderdetails.recurring.tooltip'
            defaultMessage='Recurring orders will be placed automatically on a regular basis from your linked credit card.'
          />
        </Tooltip>
        <Tooltip id='exchangedetails.exchangetooltip'>
          <FormattedMessage
            id='modals.exchangedetails.exchangetooltip'
            defaultMessage='This rate may change depending on the market price at the time of your transaction.'
          />
        </Tooltip>
        <Tooltip id='qrcode.tooltip'>
          <FormattedMessage
            id='modals.qrcode.tooltip'
            defaultMessage='Ask the sender to scan this QR code with their bitcoin wallet.'
          />
        </Tooltip>
        <Tooltip id='reqBchShare'>
          <FormattedMessage
            id='modals.requestbch.share_tooltip'
            defaultMessage='Share this address with others, and they can send you bitcoin cash directly to your wallet. Your address changes with every payment.'
          />
        </Tooltip>
        <Tooltip id='reqBchQR'>
          <FormattedMessage
            id='modals.requestbch.scan_tooltip'
            defaultMessage='Ask the sender to scan this QR code with their bitcoin cash wallet'
          />
        </Tooltip>
        <Tooltip id='reqBtcShare'>
          <FormattedMessage
            id='modals.requestbitcoin.firststep.sharetooltip'
            defaultMessage='Share this address with others, and they can send you BTC directly to your wallet. Your address changes with every payment. You can also create a request by attaching an amount below.'
          />
        </Tooltip>
        <Tooltip id='requesteth.shareaddress'>
          <FormattedMessage
            id='modals.requesteth.shareaddress'
            defaultMessage='Share this address with others, and they can send you ETH directly to your wallet. Your request address will not change.'
          />
        </Tooltip>
        <Tooltip id='requestpax.shareaddress'>
          <FormattedMessage
            id='modals.requesteth.erc20.shareaddress'
            defaultMessage='Share this address with others, and they can send you PAX directly to your wallet. Your request address will not change.'
          />
        </Tooltip>
        <Tooltip id='reqXlmShare'>
          <FormattedMessage
            id='modals.requestxlm.sharetooltip'
            defaultMessage='Share this address with others, and they can send you XLM directly to your wallet. Your request address will not change.'
          />
        </Tooltip>
        <Tooltip id='requesteth.qrcode'>
          <FormattedMessage
            id='modals.requesteth.qrcode'
            defaultMessage='Ask the sender to scan this QR code with their ETH wallet'
          />
        </Tooltip>
        <Tooltip id='requestpax.qrcode'>
          <FormattedMessage
            id='modals.requesteth.erc20.qrcode'
            defaultMessage='Ask the sender to scan this QR code with their PAX wallet'
          />
        </Tooltip>
        <Tooltip id='reqXlmScan'>
          <FormattedMessage
            id='modals.requestxlm.scan_tooltip'
            defaultMessage='Ask the sender to scan this QR code with their stellar wallet'
          />
        </Tooltip>
        <Tooltip id='sendBch.firststep.share_tooltip'>
          <FormattedMessage
            id='modals.sendBch.firststep.share_tooltip'
            defaultMessage='Add a note to remind yourself what this transaction relates to. This note will be private and only seen by you.'
          />
        </Tooltip>
        <Tooltip id='sendeth.firststep.description'>
          <FormattedMessage
            id='modals.sendeth.firststep.description'
            defaultMessage='Add a note to remind yourself what this transaction relates to. This note will be private and only seen by you.'
          />
        </Tooltip>
        <Tooltip id='sendxlm.firststep.sharetooltip'>
          <FormattedMessage
            id='modals.sendxlm.firststep.sharetooltip'
            defaultMessage='Add a note to remind yourself what this transaction relates to. This note will be private and only seen by you.'
          />
        </Tooltip>
        <Tooltip id='sendxlm.firststep.memotooltip'>
          <FormattedMessage
            id='modals.sendxlm.firststep.memotooltip'
            defaultMessage='Memos are used to communicate optional information to the recipient.'
          />
        </Tooltip>
        <Tooltip id='exchangecheckout.rate'>
          <FormattedMessage
            id='scenes.buysell.exchangecheckout.rate'
            defaultMessage="The rate offered by your region's exchange partner. May include fees."
          />
        </Tooltip>
        <Tooltip id='exchange.networkfees'>
          <FormattedMessage
            id='scenes.exchange.networkfees'
            defaultMessage='These are the fees paid to the Miners of the network.'
          />
        </Tooltip>
        <Tooltip id='exchange.changeinput' place='bottom'>
          <FormattedMessage
            id='scenes.exchange.changeinput'
            defaultMessage='Change Input'
          />
        </Tooltip>
        <Tooltip id='activityFeedWatchOnly'>
          <FormattedMessage
            id='scenes.home.activitylist.nonspendable'
            defaultMessage='This transaction involves a non-spendable address.'
          />
        </Tooltip>
        <Tooltip id='settingsBtcUsedBalace'>
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.tooltip'
            defaultMessage='When you send bitcoin, your Blockchain wallet automatically selects addresses to spend from. That is why the current balance of an address can be different from the total received value.'
          />
        </Tooltip>
        <Tooltip id='sendbtc.firststep.sharetooltip'>
          <FormattedMessage
            id='modals.sendbtc.firststep.sharetooltip'
            defaultMessage='Add a note to remind yourself what this transaction relates to. This note will be private and only seen by you.'
          />
        </Tooltip>
        <Tooltip id='sendxlm.addr' maxWidth='initial' />
        <Tooltip id='signmessage.label.tooltip'>
          <FormattedMessage
            id='modals.signmessage.label'
            defaultMessage="By signing a message, you can prove that you own this bitcoin address. You can verify signed messages by clicking on 'More Actions' > 'Verify Message'."
          />
        </Tooltip>
        <Tooltip id='swaplimit.airdrops.tooltip'>
          <TextGroup size='12px' inline>
            <Text color='white' weight={400} size='12px'>
              <FormattedMessage
                id='scenes.profile.identityverification.swaplimit.goldcompleteairdropeligible-1'
                defaultMessage='By completing the Gold Level requirements you are automatically eligible for our airdrop programs extended to your region.'
              />
            </Text>
            <Link
              size='12px'
              weight={500}
              href='https://support.blockchain.com/hc/en-us/categories/360001126692-Airdrop-Program'
              target='_blank'
            >
              <FormattedMessage
                id='scenes.profile.identityverification.swaplimit.airdrops.learnmore'
                defaultMessage='Learn more.'
              />
            </Link>
          </TextGroup>
        </Tooltip>
        <Tooltip id='faq.tooltip'>
          <FormattedMessage
            id='faq.tooltip.description'
            defaultMessage='Frequently Asked Questions'
          />
        </Tooltip>
        <Tooltip id='refresh.tooltip'>
          <FormattedMessage
            id='refresh.tooltip.description'
            defaultMessage='Refresh'
          />
        </Tooltip>
        <Tooltip id='verifyMessage'>
          <FormattedMessage
            id='modals.verifymessage.tooltip'
            defaultMessage='Verify a message signed by the owner of a particular Bitcoin address.'
          />
        </Tooltip>
        <Tooltip id='whatsnew.tooltip'>
          <FormattedMessage
            id='whatsnew.tooltip.description'
            defaultMessage="What's New"
          />
        </Tooltip>
        <Tooltip id='lockboxRequired'>
          <FormattedMessage
            id='lockboxrequired.tooltip'
            defaultMessage='Hardware device is required'
          />
        </Tooltip>
        <Tooltip id='txlist.change.tooltip'>
          <FormattedMessage
            id='txlist.change.tooltip.description'
            defaultMessage='This change address belongs to your wallet'
          />
        </Tooltip>
        <Tooltip id='identityverification.headerhelper'>
          <TextGroup inline>
            <Text color='white' weight={400} size='12px'>
              <FormattedMessage
                id='identityverification.tooltip.headerhelper'
                defaultMessage='Need help verifying your identity?'
              />
            </Text>
            <Link
              size='12px'
              weight={500}
              href='https://blockchain.zendesk.com/hc/en-us/requests/new?ticket_form_id=360000186571'
              target='_blank'
            >
              <FormattedMessage
                id='identityverification.tooltip.headerhelper.contactsupport'
                defaultMessage='Contact support.'
              />
            </Link>
          </TextGroup>
        </Tooltip>
        <Tooltip
          id='exchangeSideNavConnected'
          bgColor='grey800'
          padding='13px 20px'
          opacity='1'
        >
          <Text color='green400' weight={700} uppercase size='12px'>
            <FormattedMessage
              id='exchange-side-nav-tooltip-connected'
              defaultMessage='connected'
            />
          </Text>
        </Tooltip>
        <Tooltip id='borrow.amount.tooltip'>
          <FormattedMessage
            id='borrow.amount.tooltip.description'
            defaultMessage='This amount does not include the required collateral network fee.'
          />
        </Tooltip>
        <Tooltip id='borrow.interest.tooltip'>
          <FormattedMessage
            id='borrow.interest.tooltip.description'
            defaultMessage='Interest will be taken from the collateral deposited on a monthly basis.'
          />
        </Tooltip>
        <Tooltip id='borrow.collateral.tooltip'>
          <FormattedMessage
            id='borrow.collateral.tooltip.description'
            defaultMessage='The amount you need to deposit to open this loan.'
          />
        </Tooltip>
        <Tooltip id='borrow.collateralpending.tooltip'>
          <FormattedMessage
            id='borrow.collateralpending.tooltip.description'
            defaultMessage='The collateral deposit is pending until it is confirmed by the network and a Blockchain.com agent.'
          />
        </Tooltip>
        <Tooltip id='coming-soon'>
          <FormattedMessage
            id='tooltip.comingsoon'
            defaultMessage='Coming soon.'
          />
        </Tooltip>
      </TooltipWrapper>
    )
  }
}

export default Tooltips
