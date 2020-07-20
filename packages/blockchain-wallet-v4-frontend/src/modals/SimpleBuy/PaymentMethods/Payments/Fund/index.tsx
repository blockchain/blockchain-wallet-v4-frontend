import { fiatToString } from 'core/exchange/currency'
import { FiatType, SBPaymentMethodType } from 'core/types'
// import { Icon } from 'blockchain-info-components'
import { Title, Value } from 'components/Flyout'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const DisplayContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: 16px 40px;
  flex-direction: row;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.grey000};
  &hover {
    background-color: ${props => props.theme.grey100};
  }
`
const DisplayMoney = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 120px;
  color: ${props => props.theme.grey800};
`
const DisplayIcon = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
`
const DisplayTitle = styled(Title)`
  margin-top: 4px;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`
const MainValue = styled(Value)`
  margin-top: 0;
  text-align: right;
  font-size: 16px;
  color: ${props => props.theme.grey900};
`
const SubValue = styled(Value)`
  margin-top: 0;
  color: ${props => props.theme.textBody};
  text-align: right;
  font-size: 14px;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  value: SBPaymentMethodType
}

const Fund: React.FC<Props> = ({ value, icon, onClick }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}Fund`}
    role='button'
    onClick={onClick}
  >
    <DisplayIcon>{icon}</DisplayIcon>
    <DisplayTitle>{value.currency}</DisplayTitle>
    <DisplayMoney>
      <MainValue>
        {fiatToString({
          value: value.limits.max,
          unit: String(value.currency) as FiatType
        })}
      </MainValue>
      {value.limits.min && (
        <SubValue>
          {fiatToString({
            value: value.limits.min,
            unit: String(value.currency) as FiatType
          })}
        </SubValue>
      )}
    </DisplayMoney>
  </DisplayContainer>
)

export default Fund
