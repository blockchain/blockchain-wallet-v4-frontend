import React from 'react'

import { useMedia } from 'services/styles'

import { SuccessStateType } from '..'
import CoinFilter from './CoinFilter'
import DownloadTransactions from './DownloadTransactions'
import { LeftContainer, MenuRow, RightContainer } from './Filter.model'
import Tabs from './Tabs'
import { TabsPropsType } from './Tabs/Tabs.types'

const Filter = ({
  earnTab,
  handleTabClick,
  rates,
  txPages,
  walletCurrency
}: TabsPropsType & SuccessStateType) => {
  const isMobile = useMedia('mobile')
  return (
    <MenuRow>
      <LeftContainer>
        <Tabs earnTab={earnTab} handleTabClick={handleTabClick} />
      </LeftContainer>
      <RightContainer>
        <CoinFilter rates={rates} txPages={txPages} walletCurrency={walletCurrency} />
        <DownloadTransactions isMobile={isMobile} />
      </RightContainer>
    </MenuRow>
  )
}

export default Filter
