import request from '../utils/request'

export default {
  reqLatestList() {
    return request.get('/api/seriesLatest')
  },
  reqLatestItem(id) {
    return request.get(`/api/seriesLatest/${id}`)
  },
  saveLatestItem(itemInfo) {
    if (itemInfo.id) {
      return request.put(`/api/seriesLatest/${itemInfo.id}`, itemInfo)
    } else {
      return request.post(`/api/seriesLatest`, itemInfo)
    }
  },
  deleteLatestItem(id) {
    return request.delete(`/api/seriesLatest/${id}`)
  }
}