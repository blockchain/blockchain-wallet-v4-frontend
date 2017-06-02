import { FETCH_ACTIVITIES, FETCH_ACTIVITIES_SUCCESSFUL, FETCH_ACTIVITIES_FAILED } from 'data/actionTypes'

export const fetchActivities = () => ({ type: FETCH_ACTIVITIES })
export const fetchActivitiesSuccessful = (activities) => ({ type: FETCH_ACTIVITIES_SUCCESSFUL, activities })
export const fetchActivitiesFailed = (error) => ({ type: FETCH_ACTIVITIES_FAILED, error })
