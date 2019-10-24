import styled, { keyframes, createGlobalStyle } from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon, Image, Text } from 'blockchain-info-components'

export const Scale = () => {
  return keyframes`
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `
}

export const TooltipBody = styled.div`
  position: relative;
  width: 100%;
  max-width: 256px;
  background-color: ${props => props.theme['white']};
  border-radius: 8px;
  box-shadow: 0 4px 32px rgba(5, 24, 61, 0.4);
  padding: 32px;
  animation: ${Scale} 0.3s ease-in-out;

  > span:first-child {
    position: absolute;
    top: 24px;
    right: 24px;

    &:hover {
      cursor: pointer;
    }
  }
`
export const TooltipContent = styled.div`
  color: ${props => props.theme['white']};
  margin-bottom: 24px;
  text-align: center;
`
export const TooltipFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props =>
    props.isLastStep ? 'flex-end' : 'space-between'};
  align-content: center;
  align-items: center;
  color: ${props => props.theme['white']};
`

export const StepIcon = styled(Icon)`
  margin: 0 auto 12px auto;
  width: fit-content;
`

export const StepImg = styled(Image)`
  margin-bottom: 32px;
`

export const StepTitle = styled(Text)`
  font-size: 20px;
  text-align: center;
  margin-bottom: 8px;
  line-height: 24px;
`

export const StepContent = styled(Text)`
  line-height: 24px;
`

export const CloseTourIcon = styled(Icon)`
  &:hover {
    color: ${({ theme }) => theme['grey600']};
  }

  &:active {
    color: ${({ theme }) => theme['grey800']};
  }
`

export const PitJoyrideStyles = createGlobalStyle`
  .__floater__open {
    transition: none !important;
    filter: none !important;
    margin-left: 170px !important;
  }
`

export const SpotlightLinkContainer = styled(LinkContainer)`
  position: relative;
`

export const JoyrideSpotlight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto 11px;
  width: 28px;
  height: 28px;
`
