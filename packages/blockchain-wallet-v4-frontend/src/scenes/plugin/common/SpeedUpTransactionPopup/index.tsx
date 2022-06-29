import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconCloseCircle } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

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

const ButtonWrapper = styled.div`
  width: 100%;
  #speed-up-button-save {
    background: ${(props) => props.theme.black};
  }
`

enum GasPriorities {
  high = 'High',
  low = 'Low',
  medium = 'Medium'
}

type SpeedUpTransactionPopupProps = {
  close: () => void
  save: (gasPriority: string) => void
}

const SpeedUpTransactionPopup: React.FC<SpeedUpTransactionPopupProps> = ({ close, save }) => {
  // TODO: mock data replace with real
  const EXPECTED_FEE_VALUE = 0.00286997
  const MAX_GAS_FEE_ETH_VALUE = 0.00302092
  const MAX_GAS_FEE_USD_VALUE = 9.09

  const [gasPriority, setGasPriority] = useState<string>(GasPriorities.medium)

  const changeGasPriority = (gasPriority) => {
    setGasPriority(gasPriority)
  }

  // saves gas priority and closes popup
  const saveGasPriority = () => {
    save(gasPriority)
    close()
  }

  // indicates if specific gas priority level choosen
  const isLowGasPriorityChoosen: boolean = gasPriority === GasPriorities.low
  const isMediumGasPriorityChoosen: boolean = gasPriority === GasPriorities.medium
  const isHighGasPriorityChoosen: boolean = gasPriority === GasPriorities.high

  return (
    <Wrapper>
      <IconWrapper>
        <IconCloseCircle
          height='24px'
          width='24px'
          color='black'
          cursor='pointer'
          onClick={close}
        />
      </IconWrapper>
      <Text size='20px' lineHeight='30px' weight={700} color='black'>
        <FormattedMessage
          id='plugin.common.speed-up-popup.title'
          defaultMessage='Sped up transaction'
        />
      </Text>
      <Flex flexDirection='column' alignItems='center'>
        <Text size='32px' lineHeight='40px' weight={600} color='black'>
          ~{EXPECTED_FEE_VALUE}
        </Text>
        <Text size='12px' lineHeight='18px' weight={500} color='black'>
          <FormattedMessage
            id='plugin.common.speed-up-popup.max_fee_label'
            defaultMessage='Max fee'
          />
          : {MAX_GAS_FEE_ETH_VALUE} ({MAX_GAS_FEE_USD_VALUE} USD)
        </Text>
      </Flex>
      <Text size='12px' lineHeight='18px' weight={500} color='black'>
        <FormattedMessage
          id='plugin.common.speed-up-popup.time_label'
          defaultMessage='Likely in < 30 seconds'
        />
      </Text>
      <PriorityList>
        <PriorityItem>
          <label className='outer' htmlFor='low'>
            <input
              checked={isLowGasPriorityChoosen}
              type='checkbox'
              id='low'
              onClick={() => changeGasPriority(GasPriorities.low)}
            />
            <Text lineHeight='18px' size='12px' weight={500} color='black'>
              <FormattedMessage
                id='plugin.common.speed-up-popup.low_priority'
                defaultMessage='Low'
              />
            </Text>
          </label>
          <LeftDivider />
        </PriorityItem>
        <PriorityItem>
          <label className='outer' htmlFor='medium'>
            <input
              checked={isMediumGasPriorityChoosen}
              type='checkbox'
              id='medium'
              onClick={() => changeGasPriority(GasPriorities.medium)}
            />
            <Text lineHeight='18px' size='12px' weight={500} color='black'>
              <FormattedMessage
                id='plugin.common.speed-up-popup.medium_priority'
                defaultMessage='Medium'
              />
            </Text>
          </label>
        </PriorityItem>
        <PriorityItem>
          <label className='outer' htmlFor='high'>
            <input
              checked={isHighGasPriorityChoosen}
              type='checkbox'
              id='high'
              onClick={() => changeGasPriority(GasPriorities.high)}
            />
            <Text lineHeight='18px' size='12px' weight={500} color='black'>
              <FormattedMessage
                id='plugin.common.speed-up-popup.high_priority'
                defaultMessage='High'
              />
            </Text>
          </label>
          <RightDivider />
        </PriorityItem>
      </PriorityList>
      <Text size='12px' lineHeight='18px' weight={600} color='black'>
        <FormattedMessage
          id='plugin.common.speed-up-popup.help_label'
          defaultMessage='Need Help?'
        />
      </Text>
      <ButtonWrapper>
        <Button
          id='speed-up-button-save'
          width='100%'
          height='48px'
          data-e2e='pluginSpeedUpSaveButton'
          onClick={saveGasPriority}
        >
          <Text size='16px' lineHeight='24px' weight={600} color='white'>
            <FormattedMessage id='plugin.common.speed-up-popup.button_save' defaultMessage='Save' />
          </Text>
        </Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

export default SpeedUpTransactionPopup
