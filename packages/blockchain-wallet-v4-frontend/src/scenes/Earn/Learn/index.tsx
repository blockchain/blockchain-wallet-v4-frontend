import React from 'react'
import { useSelector } from 'react-redux'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { learnColumn, Wrapper } from './Learn.model'
import { LearnColumnType } from './Learn.types'
import LearnColumn from './LearnColumn'

const Learn = () => {
  const isActiveRewardsEnabled = useSelector(
    (state: RootState) =>
      selectors.core.walletOptions.getActiveRewardsEnabled(state).getOrElse(false) as boolean
  )

  return (
    <Wrapper>
      {learnColumn.map(
        ({ description, icon, id, isActiveRewards, link, title }: LearnColumnType, i: number) => {
          if (!isActiveRewardsEnabled && isActiveRewards) return null
          return (
            <LearnColumn
              description={description}
              icon={icon}
              isActiveRewards={isActiveRewards}
              key={id}
              link={link}
              showDivider={i !== 0}
              title={title}
            />
          )
        }
      )}
    </Wrapper>
  )
}

export default Learn
