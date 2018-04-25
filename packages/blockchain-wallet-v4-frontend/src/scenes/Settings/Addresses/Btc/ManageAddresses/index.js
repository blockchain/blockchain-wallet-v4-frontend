import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'

import HorizontalMenu from 'components/HorizontalMenu'
import { Icon, TabMenu, TabMenuItem } from 'blockchain-info-components'
import UnusedAddresses from './UnusedAddresses'
import UsedAddresses from './UsedAddresses'

const Wrapper = styled.div`
  width: 100%;
`
const InnerWrapper = styled.div`
  padding: 40px 30px;
`

class ManageAddressesContainer extends React.PureComponent {
  render () {
    const walletIndex = this.props.computedMatch.params.index

    return (
      <Wrapper>
        <HorizontalMenu>
          <TabMenu>
            <LinkContainer to='/settings/addresses'>
              <TabMenuItem selected={0}>
                <Icon name='left-arrow' />
              </TabMenuItem>
            </LinkContainer>
          </TabMenu>
        </HorizontalMenu>
        <InnerWrapper>
          <UnusedAddresses walletIndex={walletIndex} />
          <UsedAddresses />
        </InnerWrapper>
      </Wrapper>
    )
  }
}

export default ManageAddressesContainer
