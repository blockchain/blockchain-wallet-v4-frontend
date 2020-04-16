import { FormattedMessage } from 'react-intl'
import bip21 from 'bip21'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Button, Text, TextGroup } from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'
import CoinDisplay from 'components/Display/CoinDisplay'
import CopyClipboard from 'components/CopyClipboard'
import QRCodeWrapper from 'components/QRCodeWrapper'

const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 24px 0 16px;
`
const QrCodeColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;
`
const SummaryColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const SummaryGroup = styled(TextGroup)`
  margin-bottom: 8px;
  > :first-child {
    margin-bottom: 0;
  }
`
const LinkSummary = styled.div`
  margin-bottom: 16px;
`
const ShareRequestLink = props => {
  const {
    closeAll,
    receiveAddress,
    requestAmount,
    requestMessage,
    requestTo
  } = props
  const requestAmountSats = Exchange.convertBtcToBtc({
    value: requestAmount.coin,
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
  const link = `https://blockchain.com/btc/payment_request?address=${receiveAddress}&amount=${requestAmount.coin}&message=${requestMessage}`
  const requestBip21 = bip21.encode(receiveAddress, {
    amount: requestAmount.coin,
    label: requestMessage
  })

  return (
    <React.Fragment>
      <Text size='13px' weight={400}>
        <FormattedMessage
          id='modals.requestbtc.share.title'
          defaultMessage='Copy & share the link below with your friends or contacts and they will be able to send Bitcoin directly to your wallet.'
        />
      </Text>
      <Details>
        <QrCodeColumn>
          <QRCodeWrapper
            value={requestBip21}
            size={150}
            data-e2e='requestBtcAddressQrCode'
          />
        </QrCodeColumn>
        <SummaryColumn>
          <SummaryGroup>
            <Text size='14px' weight={600}>
              <FormattedMessage
                id='modals.requestbtc.share.destination'
                defaultMessage='Destination'
              />
            </Text>
            <Text size='13px' weight={400}>
              {requestTo.label}
            </Text>
          </SummaryGroup>
          <SummaryGroup>
            <Text size='14px' weight={600}>
              <FormattedMessage
                id='modals.requestbtc.share.amount'
                defaultMessage='Amount'
              />
            </Text>
            <CoinDisplay size='13px' weight={400} coin='BTC'>
              {requestAmountSats}
            </CoinDisplay>
          </SummaryGroup>
          <SummaryGroup>
            <Text size='14px' weight={600}>
              <FormattedMessage
                id='modals.requestbtc.share.description'
                defaultMessage='Description'
              />
            </Text>
            <Text size='13px' weight={400}>
              {requestMessage}
            </Text>
          </SummaryGroup>
        </SummaryColumn>
      </Details>
      <LinkSummary>
        <Text size='13px' weight={600}>
          <FormattedMessage
            id='modals.requestbtc.share.copylink'
            defaultMessage='Shareable Link'
          />
        </Text>
        <CopyClipboard address={link} data-e2e='btcShareLink' />
      </LinkSummary>

      <Button
        onClick={closeAll}
        fullwidth
        nature='primary'
        data-e2e='btcShareLinkDoneButton'
      >
        <FormattedMessage id='buttons.done' defaultMessage='Done' />
      </Button>
    </React.Fragment>
  )
}

ShareRequestLink.propTypes = {
  closeAll: PropTypes.func.isRequired,
  receiveAddress: PropTypes.string.isRequired,
  requestAmount: PropTypes.object.isRequired,
  requestMessage: PropTypes.string.isRequired,
  requestTo: PropTypes.object.isRequired
}

export default ShareRequestLink
