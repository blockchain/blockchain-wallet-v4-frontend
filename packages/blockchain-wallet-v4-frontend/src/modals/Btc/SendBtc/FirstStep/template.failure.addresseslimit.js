import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`
const CustomButton = styled(Button)`
  margin-top: 24px;
`

function AddressesLimit ({ actions }) {
  console.log(actions)
  return (
    <Container>
      <Text
        size='20px'
        color='error'
        weight={600}
        style={{ marginBottom: '16px' }}
      >
        <FormattedMessage
          id='addresseslimit.error.notice'
          defaultMessage='Notice!'
        />
      </Text>
      <Text weight={500} size='14px'>
        <FormattedMessage
          id='addresseslimit.error.message'
          defaultMessage='You have reached the maximum number of generated addresses allowed in
        one of your wallets. To regain basic functionality we can automatically
        generate a new wallet for you and transfer your funds there.'
        />
      </Text>
      <CustomButton nature='primary'>
        <FormattedMessage
          id='addresseslimit.error.cta'
          defaultMessage='Transfer Funds'
        />
      </CustomButton>
    </Container>
  )
}

export default AddressesLimit
