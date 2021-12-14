import React, { useCallback, useState } from 'react'
import { Icon, Switch, useClickOutside } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { TextInputWithClipboard } from 'components/Form'
import { DropdownMenu, DropdownMenuArrow } from 'components/Navbar/NavbarDropdown'
import QRCodeWrapper from 'components/QRCode/Wrapper'

const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.blockchain.exchange'
const IOS_URL = 'https://apps.apple.com/app/blockchain-exchange-buy-btc/id1557515848'

const CustomDropdownMenu = styled(DropdownMenu)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
  right: -8px;
  padding: 16px;
  border-radius: 8px;

  &:hover {
    cursor: default;
  }
`
const NavbarButton = styled.button`
  position: relative;
  background: transparent;
  min-width: auto;
  width: auto;
  padding: 0;
  border: 0;

  &:hover {
    cursor: pointer;
  }
`
const QRContainer = styled.div`
  margin: 16px 0;
`

const MobileDropdown = () => {
  const [isMenuOpen, toggleIsMenuOpen] = useState(false)
  const [isFirstItemActive, setIsFirstItemActive] = useState(true)

  const ref = useClickOutside(() => {
    toggleIsMenuOpen(false)
  })

  const handleMenuToggle = useCallback(() => {
    toggleIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

  const handleFirstItemClicked = useCallback(() => setIsFirstItemActive(true), [])
  const handleSecondItemClicked = useCallback(() => setIsFirstItemActive(false), [])

  return (
    <NavbarButton data-e2e='mobileQrCode' ref={ref}>
      {
        // @ts-ignore
        <Icon color='#98A1B2' name='phone' size='sm' onClick={handleMenuToggle} />
      }
      {isMenuOpen && (
        <CustomDropdownMenu>
          <DropdownMenuArrow />
          <Switch
            firstItem='IOS'
            secondItem='Android'
            handleFirstItemClicked={handleFirstItemClicked}
            handleSecondItemClicked={handleSecondItemClicked}
            isFirstItemActive={isFirstItemActive}
          />
          <QRContainer>
            <QRCodeWrapper value='blockchain.com' size={120} />
          </QRContainer>
          <TextInputWithClipboard value={isFirstItemActive ? IOS_URL : ANDROID_URL} />
        </CustomDropdownMenu>
      )}
    </NavbarButton>
  )
}

export default MobileDropdown
