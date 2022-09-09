import React, { memo } from 'react'
import styled, { css } from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

const Header = styled.div<Pick<Props, 'position' | 'sticky'>>`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
  border-bottom: ${(p) => p.theme.grey000};

  @media (max-width: 767px) {
    padding: 20px;
  }

  ${(p) =>
    p.position &&
    css`
      position: ${p.position};
    `}

  ${(p) =>
    p.sticky &&
    css`
      background: ${(props) => props.theme.white};
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

const CloseIconBg = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`

// TODO migrate this to use constellation
const FlyoutHeader = memo(
  (props: Props) => {
    return (
      <Header position={props.position || 'relative'} sticky={props.sticky}>
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
            <CloseIconBg>
              <Icon
                cursor
                data-e2e='close'
                name='close'
                size='20px'
                color='grey600'
                role='button'
                onClick={props.onClick}
              />
            </CloseIconBg>
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
  position?: 'absolute' | 'relative'
  sticky?: true
}

export default FlyoutHeader
