export type Location = {
  latitude: number
  longitude: number
}

export type Report = {
  id: number
  title: string
  description: string
  date: string
  author: string
  done: boolean
  location?: Location | null
}

export type Sort = {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export type Pageable = {
  pageNumber: number
  pageSize: number
  offset: number
  paged: boolean
  unpaged: boolean
  sort: Sort
}

export type GetReportsResponse = {
  content: Report[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export type GetReportsParams = {
  page?: number
  size?: number
}
