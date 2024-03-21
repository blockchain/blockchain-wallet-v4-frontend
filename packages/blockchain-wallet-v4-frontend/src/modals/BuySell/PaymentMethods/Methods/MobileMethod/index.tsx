import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image } from 'blockchain-info-components'
import {
  Content,
  Description,
  DisplayContainer,
  DisplayIcon,
  DisplaySubTitle,
  DisplayTitle
} from 'components/BuySell'

const MobileTitle = styled(DisplayTitle)`
  margin-bottom: 2px;
`
const MobileIcon = styled(DisplayIcon)`
  min-height: 60px;
`

type Props = {
  onClick: (string) => void
  type: 'apple' | 'google'
}

const MobileMethod = ({ onClick, type }: Props) => {
  const capType = type.charAt(0).toUpperCase() + type.slice(1)
  return (
    <DisplayContainer role='button' onClick={onClick}>
      <MobileIcon>
        <Image name={`${type}-pay`} height='18px' />
      </MobileIcon>
      <Content>
        <MobileTitle>
          <FormattedMessage id={`modals.simplebuy.${type}pay`} defaultMessage={`${capType} Pay`} />
        </MobileTitle>
        <DisplaySubTitle>
          <FormattedMessage id='copy.instantly_available' defaultMessage='Instantly Available' />
        </DisplaySubTitle>
        <Description>
          <FormattedMessage
            id={`modals.simplebuy.${type}pay.description`}
            defaultMessage={`Simply tap Buy with ${capType} Pay`}
          />
        </Description>
      </Content>
      <Icon name='chevron-right' size='24px' color='grey400' />
    </DisplayContainer>
  )
}

export default MobileMethod
