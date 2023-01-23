import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'

import { learnColumns, Wrapper } from './Learn.model'
import { LearnColumnType } from './Learn.types'
import LearnColumn from './LearnColumn'

const Learn = () => {
  const dispatch = useDispatch()
  const isActiveRewardsEnabled = useSelector(
    (state: RootState) =>
      selectors.core.walletOptions.getActiveRewardsEnabled(state).getOrElse(false) as boolean
  )
  const handleCompareClick = () => {
    dispatch(actions.modals.showModal(ModalName.EARN_COMPARE, { origin: 'EarnPage' }))
  }

  return (
    <Wrapper>
      {learnColumns({ handleCompareClick }).map(
        (
          { description, handleClick, icon, id, isActiveRewards, link, title }: LearnColumnType,
          i: number
        ) => {
          if (!isActiveRewardsEnabled && isActiveRewards) return null
          return (
            <LearnColumn
              description={description}
              handleClick={handleClick}
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
