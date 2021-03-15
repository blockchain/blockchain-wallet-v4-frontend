import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { SceneWrapper } from 'components/Layout'

const Header = styled.div`
  width: 100%;
`
const PageTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

class PricesContainer extends React.PureComponent {
  render() {
    return (
      <SceneWrapper>
        <Header>
          <PageTitle>
            <Text color='grey800' size='32px' weight={600}>
              <FormattedMessage id='copy.prices' defaultMessage='Prices' />
            </Text>
          </PageTitle>
        </Header>
      </SceneWrapper>
    )
  }
}

export default PricesContainer
