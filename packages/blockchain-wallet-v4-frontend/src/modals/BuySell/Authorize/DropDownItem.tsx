import React, { useState } from 'react'

import { Icon } from 'blockchain-info-components'

import { DropdownRow, DropdownTitleRow, InfoDropdown, InfoText, InfoTitle } from './styles'

export const DropdownItem = ({ bodyText, isPaymentInformation, titleText }) => {
  const [isToggled, handleToggle] = useState(false)
  return (
    <DropdownRow isPaymentInformation={isPaymentInformation}>
      <DropdownTitleRow
        isPaymentInformation={isPaymentInformation}
        onClick={() => handleToggle(!isToggled)}
      >
        <InfoTitle>{titleText}</InfoTitle>
        <Icon name='chevron-down' className={isToggled ? 'active' : ''} />
      </DropdownTitleRow>
      <InfoDropdown className={isToggled ? 'isToggled' : ''}>
        <InfoText>{bodyText}</InfoText>
      </InfoDropdown>
    </DropdownRow>
  )
}
