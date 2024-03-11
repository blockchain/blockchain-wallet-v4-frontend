import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image } from 'blockchain-info-components'
import { Content, DisplayContainer, DisplayIcon, DisplayTitle } from 'components/BuySell'

const MobileDiplayContainer = styled(DisplayContainer)`
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MobilePayment = ({ onClick, type }: { onClick: () => void; type: 'google' | 'apple' }) => {
  const capType = type.charAt(0).toUpperCase() + type.slice(1)
  return (
    <MobileDiplayContainer role='button' onClick={onClick}>
      <DisplayIcon>
        <Image name={`${type}-pay`} height='18px' />
      </DisplayIcon>
      <Content>
        <DisplayTitle>
          <FormattedMessage id={`modals.simplebuy.${type}pay`} defaultMessage={`${capType} Pay`} />
        </DisplayTitle>
      </Content>
    </MobileDiplayContainer>
  )
}

export default MobilePayment
