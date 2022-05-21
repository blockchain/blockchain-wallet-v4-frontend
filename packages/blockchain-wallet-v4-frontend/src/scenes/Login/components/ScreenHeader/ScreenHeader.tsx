import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import BackArrow from '../BackArrow'

const SupHeaderWrapper = styled.div`
  display: inline-flex;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 1.75rem;
  width: 100%;
`

const HeaderContentWrapper = styled.div`
  margin-bottom: 1.5rem;
`

const CenteredTitle = styled(Text)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
`

const CenteredDescription = styled(Text)`
  display: block;
  margin: 0 0.5rem;
  text-align: center;
`

const HeadingIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
`

const ScreenHeader: React.FC<{
  description?: React.ReactNode
  handleBack?: () => void
  hasBackArrow?: boolean
  icon?: React.ReactNode
  steps?: { actualStep: number; totalSteps: number }
  title?: React.ReactNode
}> = ({ description, handleBack, hasBackArrow, icon, steps, title }) => {
  const hasSteps = !!steps && Object.keys(steps).length > 0
  const hasSupHeader = !!hasSteps || hasBackArrow

  return (
    <>
      {hasSupHeader && (
        <SupHeaderWrapper>
          {(hasBackArrow || handleBack) && <BackArrow handleBack={handleBack} />}
          {((!hasBackArrow && !handleBack) || !hasSteps) && <span />}
          {hasSteps && (
            <Text color='blue600' variant='micro'>
              <FormattedMessage
                id='scenes.login.upgrade.unable_retry.steps'
                defaultMessage='Steps {actualStep} of {totalSteps}'
                values={steps}
              />
            </Text>
          )}
        </SupHeaderWrapper>
      )}
      <HeaderContentWrapper>
        {!!icon && <HeadingIcon>{icon}</HeadingIcon>}
        {!!title && (
          <CenteredTitle color='black' variant='title-3'>
            {title}
          </CenteredTitle>
        )}
        {!!description && (
          <CenteredDescription color='grey900' variant='paragraph-1'>
            {description}
          </CenteredDescription>
        )}
      </HeaderContentWrapper>
    </>
  )
}

export default ScreenHeader
