import React from 'react'
import styled from 'styled-components'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  z-index: 20;
  padding-bottom: 8px;
  background: ${(props) => props.theme.white};
  position: sticky;
  top: 0;
  margin-bottom: 8px;
`

const TabsContainer = styled.div`
  display: inline-block;
`

const NftHeader: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <Wrapper>
      <TabsContainer>
        <TabMenu>
          <TabMenuItem onClick={() => setActiveTab('explore')} selected={activeTab === 'explore'}>
            Explore
          </TabMenuItem>
          <TabMenuItem
            onClick={() => setActiveTab('my-collection')}
            selected={activeTab === 'my-collection'}
          >
            My Collection
          </TabMenuItem>
        </TabMenu>
      </TabsContainer>
    </Wrapper>
  )
}

type Props = {
  activeTab: 'explore' | 'my-collection'
  setActiveTab: React.Dispatch<React.SetStateAction<'explore' | 'my-collection'>>
}

export default NftHeader
