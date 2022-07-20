import axios from 'axios'
export const httpGet = (url, params, callback) => {
  const paramsData = (params && typeof params === 'object') ? {
    timestamp: Date.now(),
    ...params
  } : params || {}

  return axios({
    method: 'get',
    url,
    params: paramsData,
    data: {'action': 'refreshToken'},
    headers: {
      'Cache-control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0
    }
  }).then(res => {
    if (callback) { callback(res) }
    return res
  })
}
