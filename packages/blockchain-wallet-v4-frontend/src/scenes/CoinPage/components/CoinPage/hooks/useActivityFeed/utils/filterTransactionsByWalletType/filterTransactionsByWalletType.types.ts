import { ActivityFilters } from '../../useActivityFeed.types'

type SupportedFilters = Exclude<ActivityFilters, 'INTEREST'>

export type { SupportedFilters }
