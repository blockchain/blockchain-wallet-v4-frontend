import * as AT from './actionTypes'

export const fetchActivities = () => ({ type: AT.FETCH_ACTIVITIES })

export const fetchActivitiesSuccessful = (activities) => ({ type: AT.FETCH_ACTIVITIES_SUCCESSFUL, activities })

export const fetchActivitiesFailed = (error) => ({ type: AT.FETCH_ACTIVITIES_FAILED, error })
