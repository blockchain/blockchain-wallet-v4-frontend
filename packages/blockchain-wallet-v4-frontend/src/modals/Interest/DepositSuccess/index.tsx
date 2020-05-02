import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

class DepositForm extends PureComponent<Props> {
  render () {
    return (
      <Wrapper>
        <Text weight={600} color='grey800' style={{ marginTop: '24px' }}>
          Deposit summary goes here!
        </Text>
      </Wrapper>
    )
  }
}

export type OwnProps = {
  handleClose: () => void
}

type Props = OwnProps

export default DepositForm
