export const FETCH_ACTIVITIES = 'FETCH_ACTIVITIES'
export const fetchActivities = () => ({ type: FETCH_ACTIVITIES })

export const FETCH_ACTIVITIES_SUCCESSFUL = 'FETCH_ACTIVITIES_SUCCESSFUL'
export const fetchActivitiesSuccessful = (activities) => ({ type: FETCH_ACTIVITIES_SUCCESSFUL, activities })

export const FETCH_ACTIVITIES_FAILED = 'FETCH_ACTIVITIES_FAILED'
export const fetchActivitiesFailed = (error) => ({ type: FETCH_ACTIVITIES_FAILED, error })
