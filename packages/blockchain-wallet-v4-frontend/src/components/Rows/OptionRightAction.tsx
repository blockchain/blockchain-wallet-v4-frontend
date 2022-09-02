import React, { ReactNode, useCallback, useMemo } from 'react'
import { IconChevronRight, PaletteColors } from '@blockchain-com/constellation'
import { rgba } from 'polished'
import styled from 'styled-components'

import { Tooltip, TooltipHost, TooltipIcon } from 'blockchain-info-components'

const Row = styled.div`
  padding: 16px 40px;
  box-sizing: border-box;
  border-top: 1px solid ${(props) => props.theme.grey000};
  &:last-child {
    border-bottom: 1px solid ${(props) => props.theme.grey000};
  }
`
const FlexWrapper = styled(Row)<{ disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};

  & > div.disabledText > div {
    color: ${(props) => rgba(props.theme.grey900, 0.5)};
  }

  & > div {
    height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`
const ChildrenLayout = styled.div`
  display: flex;
  flex-direction: row !important;
  justify-content: center;
  align-items: center;
  gap: 16px;

  & > div.disabledText > div {
    color: ${(props) => rgba(props.theme.grey900, 0.5)};
  }
`

const OptionRightActionRow = ({ children, disabled, icon, onClick, toolTip }: Props) => {
  const onClickCallback = useCallback(() => {
    if (!disabled) {
      onClick()
    }
  }, [disabled, onClick])

  const date = Date.now() // some randomness in case of multiple disabled rows
  const disabledId = `disabledRow${date}`

  const wrappedChildren = useMemo(
    () => <div className={disabled ? 'disabledText' : ''}>{children}</div>,
    [disabled, children]
  )

  return (
    <FlexWrapper disabled={disabled} role='button' onClick={onClickCallback}>
      {icon ? (
        <ChildrenLayout>
          {icon}
          {wrappedChildren}
        </ChildrenLayout>
      ) : (
        wrappedChildren
      )}
      {disabled ? (
        <div style={{ height: 'auto' }}>
          <Tooltip id={disabledId}>
            <span>{toolTip}</span>
          </Tooltip>
          <TooltipHost id={disabledId}>
            <TooltipIcon name='info' size='15px' />
          </TooltipHost>
        </div>
      ) : (
        <IconChevronRight color={PaletteColors['grey-400']} label='chevron-right' size='medium' />
      )}
    </FlexWrapper>
  )
}

export type Props = {
  children: React.ReactNode
  disabled?: boolean
  icon?: ReactNode
  onClick: () => void
  toolTip?: React.ReactNode
}

export default OptionRightActionRow
