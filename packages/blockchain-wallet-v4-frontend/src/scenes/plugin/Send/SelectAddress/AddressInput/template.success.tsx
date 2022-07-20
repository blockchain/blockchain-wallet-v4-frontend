import React from 'react'
import styled from 'styled-components'

// @ts-ignore
import { TextInput } from 'blockchain-info-components'

const Wrapper = styled.div`
  margin: 17px auto 0;
  width: 100%;
`

const AddressInput = (props) => {
  const { input, meta, ...rest } = props

  return (
    <Wrapper>
      <TextInput {...input} {...meta} {...rest} />
    </Wrapper>
  )
}

export default AddressInput
