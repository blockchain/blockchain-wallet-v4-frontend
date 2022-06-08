import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Amount } from './Amount'
import { Receive } from './Receive'
import { SelectAccount } from './SelectAccount'
import { Success } from './Success'

export const FundingWrapper = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: Inter, sans-serif;
  letter-spacing: 0em;
  color: white;
  background-color: #0e121b;
  padding: 24px;
`

export const Funding = (props) => {
  const [fundingStep, setFundingStep] = useState<number>(1)
  const handleFundingStep = (fundingStep: number) => {
    switch (fundingStep) {
      case 1:
        return <SelectAccount setFundingStep={setFundingStep} />
      case 2:
        return <Amount setFundingStep={setFundingStep} />
      case 3:
        return <Receive />
      case 4:
        return <Success />
      default:
        return <SelectAccount setFundingStep={setFundingStep} />
    }
  }

  const goBack = () => {
    setFundingStep((step) => step - 1)
  }

  const BackButton = styled.div`
    display: ${fundingStep > 3 ? 'none' : 'block'};
  `

  /** TODO: Neded to update react-router-dom to version 5 for useLocation and useHistory hooks */
  return (
    <FundingWrapper>
      {fundingStep ? (
        <BackButton onClick={goBack}>
          <Icon color='white060' label='Icon Activity' size='md'>
            <IconArrowLeft />
          </Icon>
        </BackButton>
      ) : (
        <Link to='/extension/home'>
          <Icon color='white060' label='IconActivity' size='md'>
            <IconArrowLeft />
          </Icon>
        </Link>
      )}
      {handleFundingStep(fundingStep)}
    </FundingWrapper>
  )
}
