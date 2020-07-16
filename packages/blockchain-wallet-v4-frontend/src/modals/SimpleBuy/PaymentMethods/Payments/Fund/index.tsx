import { Icon } from 'blockchain-info-components'
import { SBPaymentMethodType } from 'core/types'
import { Title, Value } from 'components/Flyout'
import React from 'react'
import styled from 'styled-components'

const DisplayContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: 16px 40px;
  border-bottom: 1px solid ${props => props.theme.grey000};
  &hover {
    background-color: ${props => props.theme.grey100};
  }
`
const Display = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
`
const DisplayTitle = styled(Title)`
  margin-top: 4px;
  display: flex;
  align-items: center;
`

type Props = {
  onClick: (string) => void
  value: SBPaymentMethodType
}

const Fund: React.FC<Props> = ({ value, onClick }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}CurrencySelector`}
    role='button'
    onClick={onClick}
  >
    {/* <Icon size='32px' color={color} name={icon} /> */}
    <Display>
      <Value style={{ marginTop: '0px' }}>{value.limits.max}</Value>
      <DisplayTitle>{value.currency}</DisplayTitle>
    </Display>
    <Icon name='chevron-right' size='32px' color='grey600' />
  </DisplayContainer>
)

export default Fund
