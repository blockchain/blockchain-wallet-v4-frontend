import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

import MakeOfferFees from '../NftOrder/MakeOffer'
import WrapEthFees from '../NftOrder/WrapEth/fees'

const Wrapper = styled.div`
  font-family: Inter, sans-serif;
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`

const Fees = styled.div`
  padding: 1em 0em;
`

const NetworkFeesComponent: React.FC<Props> = (props) => {
  const [moreFees, setMoreFees] = useState(false)
  const toggleDropdown = () => {
    setMoreFees(!moreFees)
  }
  return (
    <>
      <Wrapper>
        <Top onClick={toggleDropdown}>
          <Text>Network Fees</Text>
          {!moreFees && <Icon name='chevron-right' size='24px' color='grey400' />}
          {moreFees && <Icon name='chevron-down' size='24px' color='grey400' />}
        </Top>
        {moreFees && (
          <Fees>
            {/* <MakeOfferFees {...props} />
            <WrapEthFees {...props} /> */}
          </Fees>
        )}
      </Wrapper>
    </>
  )
}

const connector = connect()

type Props = ConnectedProps<typeof connector>

export default connector(NetworkFeesComponent)
