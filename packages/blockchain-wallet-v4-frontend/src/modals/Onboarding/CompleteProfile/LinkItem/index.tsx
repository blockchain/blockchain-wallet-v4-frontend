import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Icon, Image, Text } from 'blockchain-info-components'

import { COMPLETE_PROFILE_STEPS } from '../types'
import {
  ActionButton,
  CentralContainer,
  IconColors,
  ImageName,
  LinkExplanation,
  LinkTitle,
  MainContainer,
  MainIconWrapper,
  MainSection
} from './model'

const LinkItem = ({ isComplete, isKycPending, onClick, type }: Props) => {
  const ItemContainer = MainContainer[type]
  const IconWrapper = MainIconWrapper[type]
  return (
    <ItemContainer onClick={isComplete ? () => {} : onClick} isComplete={isComplete}>
      <IconWrapper>{ImageName[type]}</IconWrapper>
      <MainSection>
        <CentralContainer>
          <Text size='14px' weight={600} lineHeight='20px' color='grey900'>
            {LinkTitle[type]}
          </Text>
        </CentralContainer>
        <CentralContainer>
          <Text
            size='12px'
            weight={500}
            lineHeight='20px'
            color={isComplete ? 'green600' : 'grey600'}
          >
            {isKycPending ? (
              <>
                <FormattedMessage id='copy.processing' defaultMessage='Processing' />
                ...
              </>
            ) : isComplete ? (
              <FormattedMessage id='copy.complete' defaultMessage='Complete' />
            ) : (
              LinkExplanation[type]
            )}
          </Text>
        </CentralContainer>
      </MainSection>
      <CentralContainer>
        <ActionButton>
          {isComplete ? (
            <Image name='checkmark-circle-green' />
          ) : (
            <Icon name='chevron-right' size='24px' color={IconColors[type]} />
          )}
        </ActionButton>
      </CentralContainer>
    </ItemContainer>
  )
}

type Props = {
  isComplete: boolean
  isKycPending?: boolean
  onClick: () => void
  type: COMPLETE_PROFILE_STEPS
}

export default LinkItem
