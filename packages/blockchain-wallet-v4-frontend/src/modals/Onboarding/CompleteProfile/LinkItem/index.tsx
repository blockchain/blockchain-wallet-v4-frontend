import React from 'react'

import { ResponseShape } from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'

import { useCountdownTo } from '../countdownTo'
import {
  ActionButton,
  ButtonContent,
  CentralContainer,
  IconWrapper,
  ItemButton,
  MainSection
} from './model'

type Props = {
  onClick: () => void
} & Omit<ResponseShape, 'id' | 'action'>

const CountdownTo = ({ countdownDate }) => {
  const countdown = useCountdownTo(countdownDate)

  return <span>{countdown}</span>
}

const LinkItem = ({ iconUrl, metadata, onClick, status, subtitle, title }: Props) => {
  const isComplete = status === 'COMPLETED'
  const isPending = status === 'PENDING' // Only KYC can be in this state
  const isIdle = status === 'IDLE'
  const isDisabled = status === 'DISABLED'

  const hasCountdown = !!metadata?.countdownDate

  return (
    <ItemButton
      disabled={hasCountdown || isDisabled || isPending}
      status={status}
      onClick={isIdle ? onClick : () => {}}
    >
      <ButtonContent>
        <IconWrapper>
          <img src={iconUrl} alt='' />
        </IconWrapper>
        <MainSection>
          <Text size='14px' weight={600} lineHeight='20px' color='grey900'>
            {title}
          </Text>
          <Text
            size='12px'
            weight={500}
            lineHeight='20px'
            color={isComplete ? 'green600' : 'grey600'}
          >
            {subtitle}
            {hasCountdown && <CountdownTo countdownDate={metadata.countdownDate} />}
          </Text>
        </MainSection>
        <CentralContainer>
          <ActionButton>
            {isComplete && <Image name='checkmark-circle-green' />}
            {isPending && <Icon name='pending' size='24px' />}
            {isIdle && <Icon name='chevron-right' size='24px' color='blue600' />}
            {isDisabled && <Icon name='chevron-right' size='24px' />}
          </ActionButton>
        </CentralContainer>
      </ButtonContent>
    </ItemButton>
  )
}

export default LinkItem
