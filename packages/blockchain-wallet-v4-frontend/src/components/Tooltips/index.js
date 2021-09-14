import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Link, Text, TextGroup, Tooltip } from 'blockchain-info-components'

// TODO: remove this
// Hide tooltips on IE Edge because of a CSP issue
const TooltipWrapper = styled.div`
  @supports (-ms-ime-align: auto) {
    display: none;
  }
`
class Tooltips extends React.PureComponent {
  render() {
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
        <Tooltip id='import.privatekeys'>
          <FormattedMessage
            id='modals.import.privatekeys.tooltip'
            defaultMessage='Private key format must be compressed WIF. If you are importing a private key that is in an uncompressed format, please convert it to compressed prior to importing.'
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
          <FormattedMessage id='scenes.exchange.changeinput' defaultMessage='Change Input' />
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
        <Tooltip id='scenes.interest.legaldisclaimer'>
          <div style={{ marginBottom: '8px' }}>
            <FormattedMessage
              id='scenes.interest.legal.one'
              defaultMessage='Digital/virtual currencies are not bank deposits, are not legal tender, are not backed by the government, and accounts and value balances are not subject to US Federal Deposit Insurance Corporation or Securities Investor Protection Corporation or any other non-US governmental or government-backed protections.'
            />
          </div>
          <div>
            <FormattedMessage
              id='scenes.interest.legal.two'
              defaultMessage='Legislative and regulatory changes or actions at the US State, Federal, or international level may adversely affect the use, transfer, exchange, and value of digital/virtual currencies.'
            />
          </div>
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
        <Tooltip id='verifyMessage'>
          <FormattedMessage
            id='modals.verifymessage.tooltip'
            defaultMessage='Verify a message signed by the owner of a particular Bitcoin address.'
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
        <Tooltip id='exchangeSideNavConnected' bgColor='grey800' padding='13px 20px' opacity='1'>
          <Text color='green400' weight={700} uppercase size='12px'>
            <FormattedMessage id='exchange-side-nav-tooltip-connected' defaultMessage='connected' />
          </Text>
        </Tooltip>
        <Tooltip id='transaction.pending.eth'>
          <FormattedMessage
            id='tooltip.transaction.pending.eth'
            defaultMessage='Your transaction is currently pending. You can attempt to resend it with a higher fee.'
          />
        </Tooltip>
        <Tooltip id='coming-soon'>
          <FormattedMessage id='tooltip.comingsoon' defaultMessage='Coming soon.' />
        </Tooltip>
        <Tooltip id='earninterest.calculation.tooltip'>
          <FormattedMessage
            id='scenes.interest.summarycard.tooltip'
            defaultMessage='The rate is subject to change. Interest will be paid in crypto.'
          />
        </Tooltip>
        <Tooltip id='modals.interest.depositmax.tooltip'>
          <FormattedMessage
            id='modals.interest.deposit.maxtransfer.tooltip'
            defaultMessage='Maximum transfer is determined by spendable balance minus priority fee.'
          />
        </Tooltip>
        <Tooltip id='modals.interest.calculator.tooltip'>
          <FormattedMessage
            id='modals.interest.deposit.calculator.tooltip'
            defaultMessage='This is an estimate calculated using the current interest rate for the entire horizon. The actual interest rate is subject to change.'
          />
        </Tooltip>
        <Tooltip id='modals.interest.summary.accrued.tooltip'>
          <FormattedMessage
            id='modals.interest.summary.accrued.description.tooltip'
            defaultMessage='Interest earned month to date. Total interest earned during any month will be transferred on the 1st of the following month.'
          />
        </Tooltip>
        <Tooltip id='modals.interest.summary.lock.tooltip'>
          <FormattedMessage
            id='modals.interest.summary.transferlock.tooltip.description'
            defaultMessage='The period of time the transfer will be restricted from being withdrawn.'
          />
        </Tooltip>
        <Tooltip id='modals.interest.summary.moreinterestdetails.tooltip'>
          <FormattedMessage
            id='modals.interest.moredetails.tooltip.description'
            defaultMessage='Interest accrues daily and is paid monthly. The interest rate may be periodically adjusted.'
          />
        </Tooltip>
        <Tooltip id='copy.on_chain_txs' maxWidth='250px'>
          <FormattedMessage id='copy.on_chain_txs' defaultMessage='On-chain transactions only' />
        </Tooltip>
        <Tooltip id='tooltip.rates_error' maxWidth='160px'>
          <FormattedMessage
            id='copy.rates_error'
            defaultMessage='Your crypto is safe, but pricing data is currently unavailable.'
          />
        </Tooltip>
      </TooltipWrapper>
    )
  }
}

export default Tooltips
