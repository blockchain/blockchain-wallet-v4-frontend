import React, { memo } from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Amount = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 40px 24px;
  > div {
    display: flex;
    flex-direction: row;
  }
`

const AmountSubHeader = (props: Props) => {
  return (
    <Amount data-e2e={props['data-e2e']}>
      <div>
        <Text size='32px' weight={600} color='grey800'>
          {props.title}
        </Text>
      </div>
      <div>
        <Text size='20px' weight={600} color='grey600' style={{ marginTop: '8px' }}>
          {props.subTitle}
        </Text>
      </div>
    </Amount>
  )
}

export type Props = {
  'data-e2e': string
  subTitle: string | React.ReactNode
  title: string | React.ReactNode
}

export default memo(
  AmountSubHeader,
  (prevProps, nextProps) =>
    prevProps.title === nextProps.title && prevProps.subTitle === nextProps.subTitle
)
