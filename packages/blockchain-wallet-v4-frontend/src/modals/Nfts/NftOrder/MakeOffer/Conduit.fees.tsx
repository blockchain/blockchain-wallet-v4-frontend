import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'

import { RightAlign } from '../../components'
import { Props as OwnProps } from '..'

const Fees: React.FC<Props> = (props: Props) => {
  const { orderFlow } = props

  return (
    <>
      {orderFlow.fees.cata({
        Failure: (e) => (
          <Flex justifyContent='space-between' alignItems='center'>
            <Flex>
              <Text size='14px' weight={500}>
                <FormattedMessage id='copy.approval_fees' defaultMessage='Approval Fees' />
              </Text>
            </Flex>
            <RightAlign>
              <Text size='14px' weight={600} color='grey600'>
                N/A
              </Text>
            </RightAlign>
          </Flex>
        ),
        Loading: () => null,
        NotAsked: () => null,
        Success: (val) => {
          return (
            <Flex justifyContent='space-between' alignItems='center'>
              <Flex>
                <Text size='14px' weight={500}>
                  <FormattedMessage id='copy.approval_fees' defaultMessage='Approval Fees' />
                </Text>
                {val.approvalFees > 0 ? (
                  <TooltipHost id='tooltip.opensea_offer_conduit_approval_fees'>
                    <TooltipIcon name='question-in-circle-filled' />
                  </TooltipHost>
                ) : null}
              </Flex>
              <RightAlign>
                <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                  {new BigNumber(val.approvalFees).multipliedBy(val.gasPrice).toString()}
                </CoinDisplay>
                <FiatDisplay size='14px' color='grey600' weight={600} coin='ETH'>
                  {new BigNumber(val.approvalFees).multipliedBy(val.gasPrice).toString()}
                </FiatDisplay>
              </RightAlign>
            </Flex>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps

export default Fees
