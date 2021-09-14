import React, { memo } from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

const Header = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
  border-bottom: ${(p) => p.theme.grey000};

  @media (max-width: 767px) {
    padding: 20px;
  }
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
const LeftTopCol = styled.div`
  display: flex;
  align-items: center;
`

const FlyoutHeader = (props: Props) => {
  return (
    <Header>
      <TopText color='grey800' size='20px' weight={600}>
        <LeftTopCol>
          {props.mode === 'back' && (
            <Icon
              cursor
              data-e2e={props['data-e2e']}
              name='arrow-back'
              size='20px'
              color='grey600'
              role='button'
              style={{ marginRight: '8px' }}
              onClick={props.onClick}
            />
          )}
          {props.children}
        </LeftTopCol>
        {props.mode === 'close' && (
          <Icon
            cursor
            data-e2e='RecurringBuysCloseButton'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={props.onClick}
          />
        )}
      </TopText>
    </Header>
  )
}

export type Props = {
  children?: React.ReactNode
  'data-e2e': string
  mode: 'close' | 'back'
  onClick: () => void
}

export default memo(FlyoutHeader, (prevProps, nextProps) => prevProps.mode === nextProps.mode)
