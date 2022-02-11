import React, { useCallback } from 'react'
import { Icon } from '@blockchain-com/constellation'
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
const IconWrapper = styled.div`
  display: flex;
  flex-direction: row !important;
  justify-content: center;
  align-items: center;

  & > div.disabledText > div {
    color: ${(props) => rgba(props.theme.grey900, 0.5)};
  }

  & > div {
    display: flex;
    height: 5rem;
    margin-left: 16px;
    flex-direction: column;
    justify-content: center;
  }
`

const OptionRightActionRow = ({
  children,
  disabled,
  iconColor,
  iconComponent,
  iconName,
  onClick,
  toolTip
}: Props) => {
  const onClickCallback = useCallback(() => {
    if (!disabled) {
      onClick()
    }
  }, [disabled, onClick])

  const date = Date.now() // some randomness in case of multiple disabled rows
  const disabledId = `disabledRow${date}`

  return (
    <FlexWrapper disabled={disabled} role='button' onClick={onClickCallback}>
      {iconComponent ? (
        <IconWrapper>
          {iconComponent()}
          <div className={disabled ? 'disabledText' : ''}>{children}</div>
        </IconWrapper>
      ) : iconName && iconColor ? (
        <IconWrapper>
          {
            // @ts-ignore
            <Icon name={iconName} color={iconColor} size='md' />
          }
          <div className={disabled ? 'disabledText' : ''}>{children}</div>
        </IconWrapper>
      ) : (
        <div className={disabled ? 'disabledText' : ''}>{children}</div>
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
        // @ts-ignore grey400
        <Icon name='chevron-right' color='#98A1B2' size='md' />
      )}
    </FlexWrapper>
  )
}

export type Props = {
  children: React.ReactNode
  disabled?: boolean
  iconColor?: string
  iconComponent?: () => void
  iconName?: string
  onClick: () => void
  toolTip?: React.ReactNode
}

export default OptionRightActionRow
