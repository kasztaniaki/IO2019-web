import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

// WROCTU w register userData to: imie, nazwisko, email i haslo
// a w authenticate powinno byc tylko email i haslo

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

export function removeUserReq(idToRemove) {
  console.log(idToRemove);
  
  return axios.post(`${API_URL}/users/remove_user`,null, {
    params: {
      id: idToRemove
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
