import React from 'react'
import styled from 'styled-components'

import { isValidAddress } from '@core/utils/eth'
// @ts-ignore
import { TextInput } from 'blockchain-info-components'

const Wrapper = styled.div`
  margin: 17px auto 0;
  width: 100%;
`

const AddressInput = (props) => {
  const { input, meta, ...rest } = props
  const VALIDATE_ADDRESS_TIME_DELAY = 1000

  // TODO: finalize logic
  if (isValidAddress(input.value)) {
    setTimeout(() => {
      props.changeAddress()
    }, VALIDATE_ADDRESS_TIME_DELAY)
  }

  return (
    <Wrapper>
      <TextInput id='sendEthAddressInput' {...input} {...meta} {...rest} />
    </Wrapper>
  )
}

export default AddressInput
