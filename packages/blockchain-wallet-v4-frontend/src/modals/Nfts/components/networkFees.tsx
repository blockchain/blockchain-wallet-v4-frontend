import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

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

// const Total = styled(Top)`
//   padding: 1em 1em;
// `

const NetworkFeesComponent: React.FC<Props> = (props, val) => {
  const [moreFees, setMoreFees] = useState(true)
  const toggleDropdown = () => {
    setMoreFees(!moreFees)
  }
  return (
    <>
      <Wrapper>
        <Top onClick={toggleDropdown}>
          <Text weight={500} color='#353F52' lineHeight='24px'>
            Network Fees
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
        {moreFees && (
          <Fees>
            {/* @ts-ignore */}
            <MakeOfferFees {...props} asset={val} />
            {/* @ts-ignore */}
            <WrapEthFees {...props} />
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

type Props = ConnectedProps<typeof connector>

export default connector(NetworkFeesComponent)
