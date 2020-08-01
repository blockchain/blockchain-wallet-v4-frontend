import React from 'react'
import styled from 'styled-components'

import { BeneficiaryIcon, BeneficiaryName } from './model'
import { BeneficiaryType } from 'core/types'
import { Col } from 'components/Flyout'
import { Content, DisplayPaymentIcon } from 'components/SimpleBuy'
import { Icon } from 'blockchain-info-components'
import { Props as OwnProps } from '../template.success'

const Container = styled.div<{ onClick }>`
  border: 1px solid ${props => props.theme['grey100']};
  border-radius: 8px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
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
        <Content>
          <BeneficiaryName {...props} />
        </Content>
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
