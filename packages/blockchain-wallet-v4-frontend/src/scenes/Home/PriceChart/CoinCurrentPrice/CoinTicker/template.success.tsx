import React from 'react'

import { Text } from 'blockchain-info-components'

const Success = ({ fiat, ...props }: { fiat: string }) => {
  return (
    <>
      <Text
        size='32px'
        weight={500}
        color='grey800'
        data-e2e={props['data-e2e']}
      >
        {fiat}
      </Text>
    </>
  )
}

export default Success
