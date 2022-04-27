import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title } from 'components/Flyout'

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
  const { orderFlow, title, wethFees } = props
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

  const getBasisPoints = () => {
    return `${String(
      Number(orderFlow?.asset?.data?.collection?.dev_seller_fee_basis_points) +
        Number(orderFlow?.asset?.data?.asset_contract?.opensea_seller_fee_basis_points) / 100
    )}%`
  }

  return (
    <>
      <Wrapper>
        <Top onClick={toggleDropdown}>
          <Text weight={500} color='#353F52' lineHeight='24px' size='15px'>
            {title}
          </Text>
          <Text style={{ marginLeft: '2.6em' }} lineHeight='24px'>
            {wethFees ? (
              <Total color={colors.grey600} weight={500} size='14px' coin='ETH'>
                {getTotalFees()}
              </Total>
            ) : (
              <Text weight={500} style={{ paddingLeft: '10em' }} lineHeight='24px'>
                {getBasisPoints()}
              </Text>
            )}
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
        {wethFees ? (
          <Fees style={moreFees ? {} : { display: 'none' }}>
            {/* @ts-ignore */}
            <MakeOfferFees {...props} asset={val} />
            {/* @ts-ignore */}
            <WrapEthFees {...props} />
          </Fees>
        ) : (
          <Fees style={moreFees ? {} : { display: 'none' }}>
            {orderFlow?.asset?.data?.asset_contract?.opensea_seller_fee_basis_points > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text weight={500}>OpenSea Service Fee</Text>
                <Text weight={500} style={{ paddingRight: '1.5em' }}>
                  {orderFlow.asset.data.asset_contract.opensea_seller_fee_basis_points / 100}%
                </Text>
              </div>
            )}
            {orderFlow?.asset?.data?.collection?.dev_seller_fee_basis_points > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text weight={500} style={{ paddingRight: '2em' }}>
                  Creator Royalty
                </Text>
                <Text weight={500}>
                  {Number(orderFlow.asset.data.collection.dev_seller_fee_basis_points) / 100}%
                </Text>
              </div>
            )}
          </Fees>
        )}
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
type OwnProps = { title: string; wethFees: boolean }
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(NetworkFeesComponent)
