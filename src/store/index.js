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
    isAdmin: ''
  },
  jwt: {
    token: ''
  }
}

const actions = {
  login (context, userData) {
    console.log('EMAIL PRZED SETEM ' + state.userData.email)
    context.commit('setUserData', userData)
    console.log('USERDATA ' + userData)
    var myCurrent = store.getters.getUserData
    console.log('EMAIL PO SETCIE ' + myCurrent.email)
    return authenticate(userData)
      .then(response => {
        console.log(':::::::::::::::::RESPONSE ' + response)
        console.log(':::::::::::::::::DATA ' + response.data.data)
        console.log(':::::::::::::::::EMAIL ' + response.data.UserData.Email)

        context.commit('setJwtToken', response.data.Token)
        //         context.commit('setIsAdmin', response.data) // todo podpodmieniac dane
        var current = store.getters.getJwt
        console.log('JWT PO LOGINIE ' + current)
        // var adminField = store.getters.getIsAdmin //todo uncomment
        // console.log('JWT PO LOGINIE ' + adminField) //todo uncomment
      })
      .catch(error => {
        console.log('Error Authenticating: ', error)
        EventBus.emit('failedAuthentication', error)
      })
  },
  register (context, userData) {
    console.log(userData)
    console.log({ email: state.userData.email })
    return register(userData)
      .then(context.dispatch('login', { email: userData.email, password: userData.password }))
      .catch(error => {
        console.log('Error Registering: ', error)
        EventBus.emit('failedRegistering: ', error)
      })
  },
  editUser (context, userData) {
    console.log(userData)
    return authenticate({ email: store.getters.getUserData.email, password: userData.current_password }) // weryfy with the old password
      .then(res => {
        return editUser({ email: store.getters.getUserData.email, new_name: userData.new_name, new_surname: userData.new_surname, new_password: userData.new_password })
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
    console.log('setUserData payload = ', payload)
    state.userData.email = payload.email
  },
  setJwtToken (state, payload) {
    console.log('setJwtToken payload = ', payload)
    localStorage.setItem('token', payload)
    console.log('SAMO JTW ', payload)
    console.log('TYP JTW ', typeof (payload))
    state.jwt.token = payload
  },
  setIsAdmin (state, payload) {
    console.log('SET ADMIN payload = ', payload)
    state.userData.isAdmin = payload.is_admin
    console.log('ADMIN FIELD AFTER SET = ', store.getters.getUserData.isAdmin)
  },
  setName (state, payload) {
    console.log('SET NAME payload = ', payload)
    state.userData.name = payload.name
    console.log('NAME FIELD AFTER SET = ', store.getters.getUserData.name)
  },
  setSetSurname (state, payload) {
    console.log('SET SURNAME payload = ', payload)
    state.userData.surname = payload.surname
    console.log('SURNAME FIELD AFTER SET = ', store.getters.getUserData.surname)
  },
  clearJwtToken (state) {
    localStorage.removeItem('token')
    state.jwt.token = ''
    console.log(state.jwt.token)
  },
  clearUserData (state) {
    state.userData.email = ''
    console.log(state.userData.email)
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
    return true // todo state.isAdmin
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
