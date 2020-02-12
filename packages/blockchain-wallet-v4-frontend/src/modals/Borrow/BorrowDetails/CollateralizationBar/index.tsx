import { model } from 'data'
import { OfferType } from 'core/types'
import { OwnProps, SuccessStateType } from '..'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Bar = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.grey100};
  margin-top: 16px;
  margin-bottom: 48px;
  border-radius: 8px;
`
const Line = styled.div<{ position: number }>`
  top: 0;
  position: absolute;
  z-index: 3;
  left: ${props => props.position * 100}%;
  &:before {
    content: '';
    width: 1px;
    top: -8px;
    position: relative;
    display: block;
    height: 24px;
    border-right: 2px dashed ${props => props.theme.grey400};
  }
`
const Percentage = styled(Text)`
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  left: 50%;
  bottom: -8px;
  transform: translateX(-50%);
`
const Current = styled.div<{ color: string; width: number }>`
  z-index: 2;
  width: ${props => props.width * 100}%;
  height: 8px;
  background-color: ${props => props.theme[props.color]};
  border-radius: 8px;
  transition: width 0.3s;
  position: relative;
`
const CurrentBackground = styled(Current)`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
`

type Props = OwnProps &
  SuccessStateType & { offer: OfferType; showPercentages?: boolean }

const PADDING = 0.363636
const {
  getCollateralizationColor,
  getCollateralizationDisplayName
} = model.components.borrow

export const percentageFormatter = (n: number) => {
  return (
    Number(n * 100).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }) + '%'
  )
}

const CollateralizationBar: React.FC<Props> = props => {
  const { offer } = props

  const max = Math.ceil(
    offer.terms.collateralRatio * PADDING + offer.terms.collateralRatio
  )
  const currentRatio = props.loan.collateralisationRatio
  const currentCollateralStatus = getCollateralizationDisplayName(
    currentRatio,
    offer
  )
  const currentWidth = currentRatio >= max ? 1 : currentRatio / max

  return (
    <Bar>
      <Current
        width={currentWidth}
        color={getCollateralizationColor(currentCollateralStatus)}
      />
      <CurrentBackground width={currentWidth + 0.01} color={'white'} />
      <Line position={offer.callTerms.liquidationHardRatio / max}>
        {props.showPercentages && (
          <Percentage color='red600'>
            {percentageFormatter(offer.callTerms.liquidationHardRatio)}
          </Percentage>
        )}
      </Line>
      <Line position={offer.callTerms.callTriggerRatio / max}>
        {props.showPercentages && (
          <Percentage color='orange600'>
            {percentageFormatter(offer.callTerms.callTriggerRatio)}
          </Percentage>
        )}
      </Line>
      <Line position={offer.terms.collateralRatio / max}>
        {props.showPercentages && (
          <Percentage color='green600'>
            {percentageFormatter(offer.terms.collateralRatio)}
          </Percentage>
        )}
      </Line>
    </Bar>
  )
}

export default CollateralizationBar
