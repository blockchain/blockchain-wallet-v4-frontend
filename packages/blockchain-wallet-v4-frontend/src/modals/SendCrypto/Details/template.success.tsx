import React from 'react'
import BigNumber from 'bignumber.js'
import moment from 'moment'

import { convertCoinToCoin } from 'blockchain-wallet-v4/src/exchange'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { GreyCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Row } from 'components/Flyout'
import { AmountWrapper } from 'components/Flyout/SendRequestCrypto'
import { selectors } from 'data'

const Success: React.FC<Props> = (props) => {
  if (!props.transaction) return null

  const coin = props.transaction.amount.symbol
  const totalStandard = new BigNumber(props.transaction.amount.value).toString()
  const totalBase = convertCoinToCoin({ baseToStandard: false, coin, value: totalStandard })

  return (
    <div>
      <AmountWrapper>
        <CoinDisplay coin={coin} size='32px' weight={600} color='black'>
          {totalBase}
        </CoinDisplay>
      </AmountWrapper>
      <GreyCartridge>{props.transaction.state}</GreyCartridge>
      <Row>
        <div>created</div>
        {moment(props.transaction.insertedAt).format('h:mm A on M d, Y')}
      </Row>
      {/* <Row>
        <div>from</div>
        {props.transaction.extraAttributes === ProductTypes.SIMPLEBUY
          ? `${coin} Trading Account`
          : `${coin} Account`}
      </Row> */}
      {/* <Row>
        <div>to</div>
        {props.transaction.extraAttributes.beneficiary.accountRef}
      </Row>
      <Row>
        <div>to</div>
        {props.transaction.extraAttributes.beneficiary.accountRef}
      </Row> */}
    </div>
  )
}

type Props = {
  transaction: ExtractSuccess<
    ReturnType<typeof selectors.components.sendCrypto.getTransactionDetails>
  >
}

export default Success
