import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Tooltip, Link, TextGroup } from 'blockchain-info-components'

class Tooltips extends React.PureComponent {
  render () {
    return (
      <div>
        <Tooltip id='addr' multiline offset={{ bottom: 8 }} />
        <Tooltip id='isx.expiredtooltip'>
          <FormattedMessage
            id='scenes.buysell.coinify.isx.expiredtooltip'
            defaultMessage='This is an estimated quote. The original quote for this trade expired. The exact amount of bitcoin received depends on when the payment is received.'
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
        <Tooltip id='exchangedetails.feetooltip'>
          <FormattedMessage
            id='modals.exchangedetails.feetooltip'
            defaultMessage='This fee is used to send the outgoing exchange funds to ShapeShift.'
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
        <Tooltip id='reqBitcoinShare'>
          <FormattedMessage
            id='modals.requestbitcoin.firststep.sharetooltip'
            defaultMessage='Share this address with others, and they can send you BTC directly to your wallet. Your address changes with every payment. You can also create a request by attaching an amount below.'
          />
        </Tooltip>
        <Tooltip id='reqEthShare'>
          <FormattedMessage
            id='modals.requestether.sharetooltip'
            defaultMessage='Share this address with others, and they can send you ETH directly to your wallet. Your request address will not change.'
          />
        </Tooltip>
        <Tooltip id='reqXlmShare'>
          <FormattedMessage
            id='modals.requestxlm.sharetooltip'
            defaultMessage='Share this address with others, and they can send you XLM directly to your wallet. Your request address will not change.'
          />
        </Tooltip>
        <Tooltip id='reqEthScan'>
          <FormattedMessage
            id='modals.requestether.scan_tooltip'
            defaultMessage='Ask the sender to scan this QR code with their ether wallet'
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
        <Tooltip id='sendether.firststep.sharetooltip'>
          <FormattedMessage
            id='modals.sendether.firststep.sharetooltip'
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
        <Tooltip id='tradingfee.tooltip'>
          <FormattedMessage
            id='orderdetails.tradingfee.tooltip'
            defaultMessage='The fee charged to execute a trade through SFOX.'
          />
        </Tooltip>
        <Tooltip id='exchangecheckout.rate'>
          <FormattedMessage
            id='scenes.buysell.exchangecheckout.rate'
            defaultMessage="The rate offered by your region's exchange partner. May include fees."
          />
        </Tooltip>
        <Tooltip id='tradingfee.tooltip'>
          <FormattedMessage
            id='orderdetails.tradingfee.tooltip'
            defaultMessage='The fee charged to execute a trade through SFOX.'
          />
        </Tooltip>
        <Tooltip id='firststep.tooltip'>
          <TextGroup inline>
            <FormattedMessage
              id='scenes.exchange.shapeshift.firststep.tooltip'
              defaultMessage='This quote may change depending on the market price at the time of your transaction.'
            />
            <Link
              size='12px'
              weight={300}
              href='https://info.shapeshift.io/about'
              target='_blank'
            >
              <FormattedMessage
                id='scenes.exchange.shapeshift.firststep.tooltip2'
                defaultMessage='Learn more'
              />
            </Link>
          </TextGroup>
        </Tooltip>
        <Tooltip id='exchange.changeinput' place='bottom'>
          <FormattedMessage
            id='scenes.exchange.changeinput'
            defaultMessage='Change Input'
          />
        </Tooltip>
        <Tooltip id='secondstep.txfeeexplanation'>
          <FormattedMessage
            id='scenes.exchange.shapeshift.secondstep.txfeeexplanation'
            defaultMessage='This fee is used to send the outgoing exchange funds to ShapeShift.'
          />
        </Tooltip>
        <Tooltip id='secondstep.ratetooltip'>
          <FormattedMessage
            id='scenes.exchange.shapeshift.secondstep.ratetooltip'
            defaultMessage='This rate may change depending on the market price at the time of your transaction.'
          />
        </Tooltip>
        <Tooltip id='secondstep.networkfeetooltip'>
          <FormattedMessage
            id='scenes.exchange.shapeshift.secondstep.networkfeetooltip'
            defaultMessage='ShapeShift will use this fee to send the incoming exchange funds to your wallet.'
          />
        </Tooltip>
        <Tooltip id='shapeshift.exchangetooltip'>
          <FormattedMessage
            id='modals.exchange.shapeshift.exchangetooltip'
            defaultMessage='This rate may change depending on the market price at the time of your transaction.'
          />
        </Tooltip>
        <Tooltip id='shapeshift.feetooltip'>
          <FormattedMessage
            id='modals.exchange.shapeshift.feetooltip'
            defaultMessage='This fee is used to send the incoming exchange funds from ShapeShift.'
          />
        </Tooltip>
        <Tooltip id='activityFeedWatchOnly'>
          <FormattedMessage
            id='scenes.home.activitylist.watchonly'
            defaultMessage='This transaction involves a watch only address.'
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
        <Tooltip id='sendBsv.firststep.share_tooltip'>
          <FormattedMessage
            id='modals.sendBsv.firststep.share_tooltip'
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
          <TextGroup inline>
            <FormattedMessage
              id='scenes.profile.identityverification.swaplimit.airdrops'
              defaultMessage='By completing Tier 2 you are automatically eligible for our airdrop program.'
            />
            <Link
              size='12px'
              weight={300}
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
      </div>
    )
  }
}

export default Tooltips
