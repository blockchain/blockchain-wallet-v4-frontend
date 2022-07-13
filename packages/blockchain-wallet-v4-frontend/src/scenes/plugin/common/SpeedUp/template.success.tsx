import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconCloseCircle } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import { actions } from 'data'

const Wrapper = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 264px;
  height: 532px;
  padding: 17px 24px;
  border-radius: 8px;
  background: ${(props) => props.theme.white};
`

const IconWrapper = styled(Flex)`
  justify-content: flex-end;
  width: 100%;
`

const PriorityList = styled.ul`
  display: flex;
  padding: 0;
  margin: 0;
  width: 172px;
  justify-content: space-between;
`

const PriorityItem = styled.li`
  position: relative;
  list-style-type: none;
  color: ${(props) => props.theme.black};

  .outer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #low,
  #medium,
  #high {
    position: relative;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    vertical-align: middle;
    border: 1px solid ${(props) => props.theme.black};
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;

    :checked {
      border: 1px solid ${(props) => props.theme.black};
      ::after {
        position: absolute;
        content: '';
        top: 4px;
        left: 4px;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        background: ${(props) => props.theme.black};
      }
    }
  }
`

const LeftDivider = styled.div`
  position: absolute;
  left: 30px;
  top: 15px;
  width: 45px;
  height: 1px;
  background: ${(props) => props.theme.black};
`

const RightDivider = styled.div`
  position: absolute;
  right: 29px;
  top: 15px;
  width: 45px;
  height: 1px;
  background: ${(props) => props.theme.black};
`

const SaveButton = styled(Button)`
  background: black;
  :hover {
    background: black;
  }
`

const SpeedUpPopup: React.FC<Props> = (props) => {
  const {
    changePopupVisibility,
    coin,
    fee,
    feeInGwei,
    minFee,
    priorityFee,
    regularFee,
    sendActions,
    totalCrypto
  } = props

  const savedFee = useMemo(() => feeInGwei, [])

  const calculateMinimumFee = () => {
    sendActions.sendEthFirstStepMinimumFeeClicked()
  }

  const calculateRegularFee = () => {
    sendActions.sendEthFirstStepRegularFeeClicked()
  }

  const calculatePriorityFee = () => {
    sendActions.sendEthFirstStepPriorityFeeClicked()
  }

  const closePopup = () => {
    switch (savedFee) {
      case minFee:
        calculateMinimumFee()
        break
      case priorityFee:
        calculatePriorityFee()
        break
      case regularFee:
      default:
        calculateRegularFee()
        break
    }
    changePopupVisibility()
  }

  const saveGasPriority = () => {
    sendActions.sendEthFirstStepSubmitClicked()
    changePopupVisibility()
  }

  // indicates if specific fee level choosen
  const isMinimumFeeChoosen: boolean = feeInGwei === minFee
  const isRegularFeeChoosen: boolean = feeInGwei === regularFee
  const isPriorityFeeChoosen: boolean = feeInGwei === priorityFee

  return (
    <Wrapper>
      <IconWrapper>
        <IconCloseCircle
          cursor='pointer'
          height='24px'
          width='24px'
          color='black'
          onClick={closePopup}
        />
      </IconWrapper>
      <Text size='20px' lineHeight='30px' weight={700} color='black'>
        <FormattedMessage
          id='plugin.scenes.common.speed-up.title'
          defaultMessage='Sped up transaction'
        />
      </Text>
      <Flex flexDirection='column' alignItems='center'>
        <Flex>
          <Text size='32px' lineHeight='40px' weight={600} color='black'>
            ~
          </Text>
          <CoinDisplay width='20px' size='32px' color='black' weight={600} coin={coin}>
            {totalCrypto}
          </CoinDisplay>
        </Flex>
        <Flex>
          <Text size='12px' lineHeight='18px' weight={500} color='black'>
            <FormattedMessage
              id='plugin.scenes.common.speed-up.max_fee_label'
              defaultMessage='Max fee: '
            />
          </Text>
          <CoinDisplay color='black' size='12px' weight={500} coin={coin} hideCoinTicker>
            {fee}
          </CoinDisplay>
          (
          <FiatDisplay color='black' size='12px' weight={500} coin={coin}>
            {fee}
          </FiatDisplay>
          )
        </Flex>
      </Flex>
      <Text size='12px' lineHeight='18px' weight={500} color='black'>
        <FormattedMessage
          id='plugin.scenes.common.speed-up.expiration_time_label'
          defaultMessage='Likely in < 30 seconds'
        />
      </Text>
      <PriorityList>
        <PriorityItem>
          <label className='outer' htmlFor='low'>
            <input
              checked={isMinimumFeeChoosen}
              type='checkbox'
              id='low'
              onClick={calculateMinimumFee}
            />
            <Text lineHeight='18px' size='12px' weight={500} color='black'>
              <FormattedMessage
                id='plugin.scenes.common.speed-up.low_priority'
                defaultMessage='Low'
              />
            </Text>
          </label>
          <LeftDivider />
        </PriorityItem>
        <PriorityItem>
          <label className='outer' htmlFor='medium'>
            <input
              checked={isRegularFeeChoosen}
              type='checkbox'
              id='medium'
              onClick={calculateRegularFee}
            />
            <Text lineHeight='18px' size='12px' weight={500} color='black'>
              <FormattedMessage
                id='plugin.scenes.common.speed-up.medium_priority'
                defaultMessage='Medium'
              />
            </Text>
          </label>
        </PriorityItem>
        <PriorityItem>
          <label className='outer' htmlFor='high'>
            <input
              checked={isPriorityFeeChoosen}
              type='checkbox'
              id='high'
              onClick={calculatePriorityFee}
            />
            <Text lineHeight='18px' size='12px' weight={500} color='black'>
              <FormattedMessage
                id='plugin.scenes.common.speed-up.high_priority'
                defaultMessage='High'
              />
            </Text>
          </label>
          <RightDivider />
        </PriorityItem>
      </PriorityList>
      <Text size='12px' lineHeight='18px' weight={600} color='black'>
        <FormattedMessage
          id='plugin.scenes.common.speed-up.subtitle_label'
          defaultMessage='Need Help?'
        />
      </Text>
      <SaveButton
        width='100%'
        height='48px'
        data-e2e='pluginSendNextButton'
        onClick={saveGasPriority}
      >
        <Text size='16px' lineHeight='24px' weight={600} color='white'>
          <FormattedMessage id='plugin.scenes.common.speed-up.save_button' defaultMessage='Save' />
        </Text>
      </SaveButton>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  amount: string
  changePopupVisibility: () => void
  coin: string
  fee: string
  feeInGwei: number
  minFee: number
  priorityFee: number
  regularFee: number
  totalCrypto: string
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(SpeedUpPopup)
