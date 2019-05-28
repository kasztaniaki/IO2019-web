import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { authenticate, register, editUser } from '@/api'
import EventBus, { isValidJwt } from '@/components/EventBus'

Vue.use(Vuex)

const state = {
  userData: {
    email: '',
    name: '',
    surname: '',
    is_admin: ''
  },
  jwt: {
    token: ''
  }
}

const actions = {
  login (context, userData) {
    context.commit('setUserData', userData)
    return authenticate(userData)
      .then(response => {
        context.commit('setJwtToken', response.data.Token)
        context.commit('setIsAdmin', response.data.UserData.IsAdmin)
        context.commit('setName', response.data.UserData.Name)
        context.commit('setSurname', response.data.UserData.Surname)
      })
      .catch(error => {
        console.log('Error Authenticating: ', error)
        EventBus.emit('failedAuthentication', error)
      })
  },
  register (context, userData) {
    return register(userData)
      .then(context.dispatch('login', { email: userData.email, password: userData.password }))
      .catch(error => {
        console.log('Error Registering: ', error)
        EventBus.emit('failedRegistering: ', error)
      })
  },
  editUser (context, userData) {
    return authenticate({ email: store.getters.getUserData.email, password: userData.current_password })
      .then(res => {
        return editUser({
          email: userData.email,
          new_name: userData.new_name,
          new_surname: userData.new_surname,
          new_password: userData.new_password,
          is_admin: userData.is_admin,
          new_email: userData.new_email
        })
          .then(console.log('OK'))
          // newResponse => context.commit('setJwtToken', { jwt: newResponse.data })
          .catch(error => {
            console.log('Error while changing user data: ', error)
            EventBus.emit('failedChangingUserData: ', error)
          })
      })
      .catch(error => {
        console.log('Old password does not match: ', error)
        EventBus.emit('failedChangingPassword: ', error)
      })
  },
  logout (context) {
    context.commit('clearJwtToken')
    context.commit('clearUserData')
  }
}

const mutations = {
  setUserData (state, payload) {
    state.userData.email = payload.email
  },
  setJwtToken (state, payload) {
    state.jwt.token = payload
  },
  setIsAdmin (state, payload) {
    state.userData.is_admin = payload
  },
  setName (state, payload) {
    state.userData.name = payload
  },
  setSurname (state, payload) {
    state.userData.surname = payload
  },
  clearJwtToken (state) {
    state.jwt.token = ''
  },
  clearUserData (state) {
    state.userData.email = ''
    state.userData.name = ''
    state.userData.surname = ''
    state.userData.is_admin = ''
  }
}

const getters = {
  isAuthenticated (state) {
    return isValidJwt(store.getters.getJwt)
  },
  getUserData (state) {
    return state.userData
  },
  getJwt (state) {
    return state.jwt.token
  },
  getIsAdmin (state) {
    return state.userData.is_admin
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  plugins: [createPersistedState()]
})

export default store
