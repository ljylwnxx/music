import { httpGet } from '@/utils/axios.js'
export const commentObj = {
  0: (newQuery) => {
    return httpGet(`/api/comment/music?id=${newQuery.id}&offset=${newQuery.offset}&limit=20&before=0&timestamp=${Date.now()}`)
  },
  1: (newQuery) => {
    return httpGet(`/api/comment/mv?id=${newQuery.id}&offset=${newQuery.offset}&limit=20&before=0&timestamp=${Date.now()} `)
  },
  2: (newQuery) => {
    return httpGet(`/api/comment/playlist?id=${newQuery.id}&offset=${newQuery.offset}&limit=20&before=0&timestamp=${Date.now()} `)
  },
  3: (newQuery) => {
    return httpGet(`/api/comment/album?id=${newQuery.id}&offset=${newQuery.offset}&limit=20&before=0&timestamp=${Date.now()} `)
  },
  4: (newQuery) => {
    return httpGet(`/api/comment/dj?id=${newQuery.id}&offset=${newQuery.offset}&limit=20&before=0&timestamp=${Date.now()}  `)
  },
  5: (newQuery) => {
    return httpGet(`/api/comment/video?id=${newQuery.id}&offset=${newQuery.offset}&limit=20&before=0&timestamp=${Date.now()} `)
  }
}
