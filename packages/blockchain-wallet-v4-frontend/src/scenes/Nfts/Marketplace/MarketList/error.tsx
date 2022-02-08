import React from 'react'
import { CombinedError } from 'urql'

import { Text } from 'blockchain-info-components'

const Error: React.FC<Props> = ({ error }) => {
  return error ? (
    <div>
      {error.graphQLErrors.map((val) => (
        <div key={val.stack}>
          <Text size='12px' weight={600}>
            {val.message}
          </Text>
        </div>
      ))}
    </div>
  ) : null
}

type Props = {
  error: CombinedError | undefined
}

export default Error
