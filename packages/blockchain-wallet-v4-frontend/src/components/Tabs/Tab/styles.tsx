import { FC } from 'react'
import styled, { css } from 'styled-components'

import { TabProps } from './types'

export const Container = styled.div<{ onClick?: () => void; selected: boolean }>`
  display: inline-block;
  border-radius: 8px;

  ${({ selected }) =>
    selected &&
    css`
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.12), 0px 3px 1px rgba(0, 0, 0, 0.04);
    `}
  ${({ onClick }) => {
    const canClick = !!onClick

    if (!canClick) return

    return css`
      cursor: pointer;
    `
  }}
`

type BadgeProps = { $color: TabProps['badgeColor'] }

export const Badge: FC<BadgeProps> = styled.div<BadgeProps>`
  ${({ $color, theme }) => {
    const mapBadgeColorToThemeColor: Record<Required<TabProps>['badgeColor'], string> = {
      green: theme.green400
    }

    const backgroundColor = $color ? mapBadgeColorToThemeColor[$color] : null

    return css`
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background-color: ${backgroundColor};
    `
  }}
`
