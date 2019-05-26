<template>
  <div class="container">
    <form @submit.prevent="validateBeforeSubmit">
      <p class="message"> Log in with your email address </p>
      <div class="form_styling">
        <b-field :type="{'is-danger': errors.has('email')}" :message="errors.first('email')">
          <b-input placeholder="Email" type="email" v-model="email" name="email" v-validate="'required|email' " />
        </b-field>

        <b-field :type="{'is-danger': errors.has('password')}" :message="errors.first('password')">
          <b-input placeholder="Password" type="password" password-reveal v-model="password" name="password"
            v-validate="'required|min:8'" />
        </b-field>

        <button type="submit" class="button is-primary" @click="authenticate()"> Log in </button>
      </div>
      <div class="information">
        <p>Don't have an account? <router-link to="/users/signup">Sign up</router-link> </p>
      </div>
    </form>
  </div>
</template>

<script>
  import EventBus from './EventBus'

  export default {
    data() {
      return {
        email: null,
        password: null,
        errorMsg: null
      }
    },
    methods: {
      authenticate() {
        this.$store.dispatch('login', {
            email: this.email,
            password: this.password
          })
          .then(() => {
            var token = this.$store.getters.getJwt
            this.$api.setHeader("Auth-Token",token)
            this.$router.push('/')}
            )
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$toast.open({
              message: 'Form is valid!',
              type: 'is-success',
              position: 'is-bottom'
            })
            return
          }
          this.$toast.open({
            message: 'Form is not valid! Please check the fields.',
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
      }
    },
    mounted() {
      EventBus.$on('failedAuthentication', (msg) => {
        this.errorMsg = msg
      })
    },
    beforeDestroy() {
      EventBus.$off('failedAuthentication')
    }
  }

</script>
