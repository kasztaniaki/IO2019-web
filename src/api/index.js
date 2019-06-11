import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export default {
  http: axios,
  setHeader (header, value) {
    this.http.defaults.headers.common[header] = value
  }
}

export function authenticate (userData) {
  return axios.post(`${API_URL}/users/signin`, userData)
}

export function register (userData) {
  return axios.post(`${API_URL}/users/signup`, userData)
}

export function updatePassword (userData) {
  return axios.post(`${API_URL}/users/password`, userData)
}

export function importFile (fileData, isForced) {
  return axios.post(`${API_URL}/import`, fileData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: {
      force: isForced
    }
  })
}

export function loadPoolsReq () {
  return axios.get(`${API_URL}/pools`)
}

export function addPoolReq (poolProps) {
  return axios.post(`${API_URL}/add_pool`, poolProps, {
    headers: { 'Content-Type': 'application/json' }
  })
}

export function editPoolReq (poolId, poolProps) {
  return axios.post(`${API_URL}/edit_pool`, poolProps, {
    params: { id: poolId },
    headers: { 'Content-Type': 'application/json' }
  })
}

export function removePoolReq (poolId) {
  return axios.get(`${API_URL}/remove_pool`, {
    params: { id: poolId }
  })
}

export function resetDBReq () {
  return axios.get(`${API_URL}/init_db`)
}

export function loadUsersReq () {
  return axios.get(`${API_URL}/users`)
}

export function removeUserReq (emailToRemove, password) {
  return axios.post(`${API_URL}/users/remove_user`, {
    email: emailToRemove,
    password: password
  },
  {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function editUser (userData) {
  return axios.post(`${API_URL}/users/edit_user`, userData, {
    params: { email: userData.email },
    headers: { 'Content-Type': 'application/json' }
  })
}

export function loadReservationsReq (startDate, endDate, showCancelled) {
  return axios.get(`${API_URL}/reservations`, {
    params: { startDate: startDate, endDate: endDate, showCancelled: showCancelled }
  })
}

export function cancelReservationReq (reservationID, type) {
  return axios.post(`${API_URL}/reservations/cancel`, {
    ReservationID: reservationID,
    Type: type
  })
}

export function addReservationReq (reservationProps) {
  return axios.post(`${API_URL}/reservations/create`, reservationProps, {
    headers: { 'Content-Type': 'application/json' }
  })
}

export function editReservationReq (reservationProps) {
  return axios.post(`${API_URL}/reservations/edit`, reservationProps, {
    headers: { 'Content-Type': 'application/json' }
  })
}
export function getUserReq (email) {
  return axios.get(`${API_URL}/user`, {
    params: { email: email }
  })
}
export function getPopularPoolsReq (startDate, endDate, poolsToView) {
  return axios.get(`${API_URL}/statistics/popular_pools`, {
    params: {
      startDate: startDate,
      endDate: endDate,
      poolsToView: poolsToView
    }
  })
}

export function getPopularUsersReq (startDate, endDate, usersToView) {
  return axios.get(`${API_URL}/statistics/popular_users`, {
    params: {
      startDate: startDate,
      endDate: endDate,
      usersToView: usersToView
    }
  })
}

export function getBottleneckedPoolsReq (startDate, endDate, poolsToView, threshold) {
  return axios.get(`${API_URL}/statistics/bottlenecked_pools`, {
    params: {
      startDate: startDate,
      endDate: endDate,
      poolsToView: poolsToView,
      threshold: threshold
    }
  })
}

export function getUnusedPoolsReq (startDate, endDate, poolsToView) {
  return axios.get(`${API_URL}/statistics/unused_pools`, {
    params: {
      startDate: startDate,
      endDate: endDate,
      poolsToView: poolsToView
    }
  })
}
