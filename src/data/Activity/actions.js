import * as actions from '../actionTypes.js'

export const fetchActivities = () => ({ type: actions.FETCH_ACTIVITIES })
export const fetchActivitiesSuccessful = (activities) => ({ type: actions.FETCH_ACTIVITIES_SUCCESSFUL, activities })
export const fetchActivitiesFailed = (error) => ({ type: actions.FETCH_ACTIVITIES_FAILED, error })
