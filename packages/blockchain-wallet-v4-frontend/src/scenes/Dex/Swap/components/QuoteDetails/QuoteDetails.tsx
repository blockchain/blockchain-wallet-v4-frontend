import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import styled, { keyframes } from 'styled-components'

import { Text } from 'blockchain-info-components'
import { model, selectors } from 'data'
import { DexSwapSettingsForm } from 'data/components/dex/types'
import { RootState } from 'data/rootReducer'

import { Props as OwnProps } from '../../Swap'

const { DEX_SWAP_SETTINGS_FORM } = model.components.dex

const slideInTop = keyframes`
  0% {
    transform: scaleY(0.25);
    transform-origin: 100% 0;
  }
  100% {
    transform: scaleY(1);
    transform-origin: 100% 0;
  }
`

const QuoteWrapper = styled.div<{ animate: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  animation: ${slideInTop} 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 16px;
  > :last-child {
    border-bottom: none;
  }
`
const RowDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`
const RowTitle = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.textBlack};
`
const RowValue = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-between;
  align-items: flex-end;
`
const ValueText = styled(Text)`
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.textBlack};
`
const ValueSubText = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.grey600};
`
const EditSlippageText = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.blue600};
  &:hover {
    cursor: pointer;
  }
`

const QuoteDetails = ({
  handleSettingsClick,
  quoteR,
  swapDetailsOpen,
  swapSettingsFormValues
}: Props) => {
  return (
    <QuoteWrapper animate={swapDetailsOpen}>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.allowed_slippage' defaultMessage='Allowed Slippage' />
        </RowTitle>
        <RowValue>
          <ValueText>
            {swapSettingsFormValues?.activeSlippage
              ? `${parseFloat(swapSettingsFormValues?.activeSlippage) * 100}%`
              : 'Auto'}
          </ValueText>
          <EditSlippageText onClick={handleSettingsClick}>
            <FormattedMessage id='buttons.edit' defaultMessage='Edit' />
          </EditSlippageText>
        </RowValue>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.minimum_received' defaultMessage='Minimum Received' />
        </RowTitle>
        <RowValue>
          <ValueText>$3,091.30</ValueText>
          <ValueSubText>3,091.3 USDC</ValueSubText>
        </RowValue>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.send_amount' defaultMessage='Send Amount' />
        </RowTitle>
        <RowValue>
          <ValueText>$3,254.00</ValueText>
          <ValueSubText>1.001 ETH</ValueSubText>
        </RowValue>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.network_fee' defaultMessage='Network Fee' />
        </RowTitle>
        <RowValue>
          <ValueText>$9.52</ValueText>
          <ValueSubText>0.005 ETH</ValueSubText>
        </RowValue>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.blockchain_fee' defaultMessage='Blockchain.com Fee' />
        </RowTitle>
        <RowValue>
          <ValueText>$2.40</ValueText>
          <ValueSubText>0.0005 ETH</ValueSubText>
        </RowValue>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.total' defaultMessage='Total' />
        </RowTitle>
        <RowValue>
          <ValueText>$3,265.92</ValueText>
          <ValueSubText>1.009 ETH</ValueSubText>
        </RowValue>
      </RowDetails>
    </QuoteWrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  swapSettingsFormValues: selectors.form.getFormValues(DEX_SWAP_SETTINGS_FORM)(
    state
  ) as DexSwapSettingsForm
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  handleSettingsClick: () => void
  swapDetailsOpen: boolean
} & Pick<OwnProps, 'quoteR'>

export default connector(QuoteDetails)
