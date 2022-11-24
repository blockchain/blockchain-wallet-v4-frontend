import React, { useRef } from 'react'
import styled from 'styled-components'

import { DropdownMenu, DropdownMenuArrow, DropdownMenuItem } from 'components/Navbar/Dropdown'
import { Destination } from 'layouts/Wallet/components'
import { useOnClickOutside } from 'services/misc'

import { AccountNavKeys, PrimaryNavKeys } from '../types'

const DropdownPositioned = styled(DropdownMenu)`
  top: 54px;
  right: 12px;
`

type Props = {
  navItems: Array<{ key: PrimaryNavKeys | AccountNavKeys; label: string }>
  onClickNavItem: (key: PrimaryNavKeys | AccountNavKeys) => void
  onClose: () => void
}

export const AccountDropdown = ({ navItems, onClickNavItem, onClose }: Props) => {
  const ref = useRef(null)
  useOnClickOutside(ref, onClose)

  return (
    <DropdownPositioned ref={ref}>
      <DropdownMenuArrow />
      {navItems.map(({ key, label }) => {
        return (
          <DropdownMenuItem key={key} onClick={() => onClickNavItem(key)} data-e2e={key}>
            <Destination>{label}</Destination>
          </DropdownMenuItem>
        )
      })}
    </DropdownPositioned>
  )
}
