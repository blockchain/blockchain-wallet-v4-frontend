import React, { memo } from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const SubHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 40px 24px;
  > div {
    display: flex;
    flex-direction: row;
  }
`

const SubHeader = (props: Props) => {
  return (
    <SubHeaderContainer data-e2e={props['data-e2e']}>
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
    </SubHeaderContainer>
  )
}

export type Props = {
  'data-e2e': string
  subTitle: string | React.ReactNode
  title: string | React.ReactNode
}

export default memo(
  SubHeader,
  (prevProps, nextProps) =>
    prevProps.title === nextProps.title && prevProps.subTitle === nextProps.subTitle
)
