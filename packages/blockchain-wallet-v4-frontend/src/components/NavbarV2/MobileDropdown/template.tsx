import React, { useCallback, useState } from 'react'
import { colors, Icon, IconName, Switch, useClickOutside } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { TextInputWithClipboard } from 'components/Form'
import { DropdownMenu, DropdownMenuArrow } from 'components/Navbar/NavbarDropdown'
import QRCodeWrapper from 'components/QRCode/Wrapper'

const ANDROID_URL = 'https://play.google.com/store/apps/details?id=piuk.blockchain.android'
const IOS_URL = 'https://apps.apple.com/us/app/blockchain-wallet-buy-bitcoin/id493253309'

const CustomDropdownMenu = styled(DropdownMenu)`
  top: 38px;
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
  height: 16px;

  &:hover {
    cursor: pointer;
  }
`
const QRContainer = styled.div`
  margin: 16px 0;
`

const StyledSwitch = styled(Switch)`
  background: ${colors.grey100};
  height: 15px;
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
      <Icon color={colors.grey400} name={IconName.PHONE} size='sm' onClick={handleMenuToggle} />
      {isMenuOpen && (
        <CustomDropdownMenu>
          <DropdownMenuArrow />
          <StyledSwitch
            css={{ backgroundColor: 'red' }}
            firstItem='iOS'
            secondItem='Android'
            handleFirstItemClicked={handleFirstItemClicked}
            handleSecondItemClicked={handleSecondItemClicked}
            isFirstItemActive={isFirstItemActive}
          />
          <QRContainer>
            <QRCodeWrapper value={isFirstItemActive ? IOS_URL : ANDROID_URL} size={220} />
          </QRContainer>
          <TextInputWithClipboard value={isFirstItemActive ? IOS_URL : ANDROID_URL} />
        </CustomDropdownMenu>
      )}
    </NavbarButton>
  )
}

export default MobileDropdown
