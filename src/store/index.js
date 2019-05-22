import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { authenticate, register, updatePassword } from '@/api'
import EventBus, { isValidJwt } from '@/components/EventBus'

Vue.use(Vuex)

const state = {
  userData: { email: 'ala@makota.d17' }, // todo dehardcode
  jwt: ''
}

const actions = {
  login (context, userData) {
    context.commit('setUserData', { userData })
    console.log(userData)
    return authenticate(userData)
      .then(response => {
        context.commit('setJwtToken', { jwt: response.data })
        console.log(state.jwt)
      })
      .catch(error => {
        console.log('Error Authenticating: ', error)
        EventBus.emit('failedAuthentication', error)
      })
  },
  register (context, userData) {
    // context.commit('setUserData', { userData }) //todo commented because I think it is done in the login() method
    console.log(userData)
    console.log({ email: state.userData.email })
    return register(userData)
      .then(context.dispatch('login', { email: userData.email, password: userData.password }))
      .catch(error => {
        console.log('Error Registering: ', error)
        EventBus.emit('failedRegistering: ', error)
      })
  },
  changePassword (context, userData) {
    return authenticate({ email: state.userData.email, password: userData.oldPassword }) // weryfy with the old password
      .then(res => {
        return updatePassword({ email: state.userData.email, password: userData.newPassword })
          .then(newResponse => context.commit('setJwtToken', { jwt: newResponse.data })) // todo werify the newResponse
          .catch(error => {
            console.log('Error while changing password: ', error)
            EventBus.emit('failedChangingPassword: ', error)
          })
      })
      .catch(error => {
        console.log('Old password does not match: ', error)
        EventBus.emit('failedChangingPassword: ', error)
      })
  },
  logout (context) {
    // WROCTU wywolanie this.$store.dispatch('logout') + zeby guzik do logowania dzialal + naprawic ten warn z navbarem
    context.commit('clearJwtToken')
    context.commit('clearUserData')
  }
}

const mutations = {
  setUserData (state, payload) {
    console.log('setUserData payload = ', payload)
    state.userData.email = payload.userData.email
  },
  setJwtToken (state, payload) {
    console.log('setJwtToken payload = ', payload)
    localStorage.setItem('token', payload.jwt)
    state.jwt = payload.jwt
  },
  clearJwtToken (state) {
    localStorage.removeItem('token')
    state.jwt = ''
    console.log(state.jwt)
  },
  clearUserData (state) {
    state.userData.email = ''
    console.log(state.userData.email)
  }
}

const getters = {
  isAuthenticated (state) {
    return isValidJwt(state.jwt)
  },
  getUserData (state) {
    return state.userData
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
