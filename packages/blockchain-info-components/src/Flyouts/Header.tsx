import React from 'react'
import styled, { css } from 'styled-components'

import { Icon } from '../Icons'
import { Text } from '../Text'

const Header = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
  border-bottom: ${(p) => p.theme.grey000};
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
  children?: React.ReactNode,
  mode: 'close' | 'back'
  'data-e2e': string,
  onClick: () => void,
}

export default FlyoutHeader
