import React from 'react'
import styled from 'styled-components'

import { BeneficiaryType } from 'core/types'
import { Icon, Text } from 'blockchain-info-components'
import { Props as OwnProps } from '../template.success'

const Container = styled.div`
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
    <Container>
      <Col>
        <Icon name='bank-filled' color='blue600' />
        <AccountName>
          <Text color='grey900' size='14px' weight={600}>
            {props.beneficiary.name}
          </Text>
          <Text
            color='grey600'
            size='12px'
            weight={500}
            style={{ marginTop: '4px' }}
          >
            Limit Here
          </Text>
        </AccountName>
      </Col>
      <Col>
        <Icon name='arrow-right' color='grey400' size='16px' role='button' />
      </Col>
    </Container>
  )
}

type Props = OwnProps & { beneficiary: BeneficiaryType }

export default Beneficary
