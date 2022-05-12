import React, { memo } from 'react'
import styled, { css } from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

const Header = styled.div<{ sticky: boolean }>`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
  border-bottom: ${(p) => p.theme.grey000};

  @media (max-width: 767px) {
    padding: 20px;
  }

  ${(p) =>
    p.sticky &&
    css`
      position: sticky;
      top: 0;
      z-index: 99;
    `}
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const LeftTopCol = styled.div`
  display: flex;
  align-items: center;
`

const FlyoutHeader = memo(
  (props: Props) => {
    return (
      <Header sticky={props.sticky || false}>
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
              data-e2e='close'
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
  },
  (prevProps, nextProps) => prevProps.mode === nextProps.mode
)

export type Props = {
  children?: React.ReactNode
  'data-e2e': string
  mode: 'close' | 'back'
  onClick: () => void
  sticky?: true
}

export default FlyoutHeader
