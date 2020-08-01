import { BeneficiaryIcon, BeneficiaryName } from './model'
import { BeneficiaryType } from 'core/types'
import { DisplayPaymentIcon } from 'components/SimpleBuy'
import { Icon } from 'blockchain-info-components'
import { Props as OwnProps } from '../template.success'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div<{ onClick }>`
  border: 1px solid ${props => props.theme['grey100']};
  border-radius: 8px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`
const Col = styled.div`
  display: flex;
  align-items: center;
`
const AccountName = styled.div`
  margin-left: 16px;
`

const Beneficary: React.FC<Props> = props => {
  return (
    <Container
      onClick={() =>
        props.handleBankSelection(props.userData, props.beneficiary)
      }
    >
      <Col>
        <DisplayPaymentIcon showBackground>
          <BeneficiaryIcon {...props} />
        </DisplayPaymentIcon>
        <AccountName>
          <BeneficiaryName {...props} />
        </AccountName>
      </Col>
      <Col>
        <Icon name='arrow-right' color='grey400' size='20px' role='button' />
      </Col>
    </Container>
  )
}

export type Props = OwnProps & {
  beneficiary?: BeneficiaryType
}

export default Beneficary
