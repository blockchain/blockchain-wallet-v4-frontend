import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'

import MakeOfferFees from '../NftOrder/MakeOffer/fees'
import WrapEthFees from '../NftOrder/WrapEth/fees'

const Wrapper = styled.div`
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  font-family: Inter, sans-serif;
  padding: 1em;
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
`
const ChevronArea = styled.div`
  display: flex;
`
const Fees = styled.div`
  padding: 1em 0em 0em 0em;
`

const OfferFees = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1em 0em;
`

const WrappedEthFees = styled(OfferFees)``

const Total = styled(FiatDisplay)`
  margin-left: 10em;
  display: flex;
  justify-content: space-between;
`

const NetworkFeesComponent: React.FC<Props> = (props: any, val) => {
  const [moreFees, setMoreFees] = useState(false)
  const toggleDropdown = () => {
    setMoreFees(!moreFees)
  }

  const getTotalFees = () => {
    const totalFees = new BigNumber(props?.orderFlow?.wrapEthFees?.data?.approvalFees)
      .multipliedBy(props?.orderFlow?.wrapEthFees?.data?.gasPrice)
      .plus(
        new BigNumber(props?.orderFlow?.wrapEthFees?.data?.totalFees).multipliedBy(
          props?.orderFlow?.wrapEthFees?.data?.gasPrice
        )
      )
    return !totalFees.isNaN() ? totalFees.toString() : 0
  }

  return (
    <>
      <Wrapper>
        <Top onClick={toggleDropdown}>
          <Text weight={500} color='#353F52' lineHeight='24px' size='15px'>
            Network Fees
          </Text>
          <Text style={{ marginLeft: '2.6em' }} lineHeight='24px'>
            <Total color={colors.grey600} weight={600} size='14px' coin='ETH'>
              {getTotalFees()}
            </Total>
          </Text>
          {!moreFees && (
            <ChevronArea>
              <Icon name='chevron-right' size='24px' color='grey400' />
            </ChevronArea>
          )}
          {moreFees && (
            <ChevronArea>
              <Icon name='chevron-down' size='24px' color='grey400' />
            </ChevronArea>
          )}
        </Top>
        <Fees style={moreFees ? {} : { display: 'none' }}>
          {/* @ts-ignore */}
          <MakeOfferFees {...props} asset={val} />
          {/* @ts-ignore */}
          <WrapEthFees {...props} />
        </Fees>
      </Wrapper>
      {/* {moreFees && (
        <Total>
          <Text weight={500}>Total</Text>
          <Text weight={500}>$0.00</Text>
        </Total>
      )} */}
    </>
  )
}

const connector = connect()

type Props = ConnectedProps<typeof connector>

export default connector(NetworkFeesComponent)
