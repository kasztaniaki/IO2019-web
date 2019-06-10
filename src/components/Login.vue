<template>
  <div class="container">
    <form>
      <p class="message"> Log in with your email address </p>
      <div class="form_styling">
        <b-field :type="{'is-danger': errors.has('email')}" :message="errors.first('email')">
          <b-input placeholder="Email" type="email" v-model="email" name="email" v-validate="'required|email' " />
        </b-field>

        <b-field :type="{'is-danger': errors.has('password')}" :message="errors.first('password')">
          <b-input placeholder="Password" type="password" password-reveal v-model="password" name="password"
            v-validate="'required'" />
        </b-field>

        <div @click="forgotPassword()">
          <p> Forgot Password?  </p>
        </div>

        <button class="button is-primary" @click.prevent="validateBeforeSubmit()"> Log in </button>
      </div>
      <div class="information">
        <p>Don't have an account? <router-link to="/users/signup">Sign up</router-link> </p>
      </div>
    </form>
  </div>
</template>

<script>
import EventBus from './EventBus'
import ResetPassword from '@/components/ResetPassword.vue'

export default {
  data () {
    return {
      email: null,
      password: null,
      errorMsg: null
    }
  },
  methods: {
    authenticate () {
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      })
        .then(() => {
          var token = this.$store.getters.getJwt
          this.$api.setHeader('Auth-Token', token)
          this.$router.push('/')
        }
        )
        .catch(error => {
          if (error) {
            this.$toast.open({
              message: 'Incorrect email or password.',
              type: 'is-danger',
              position: 'is-top'
            })
          }
        })
    },
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.$toast.open({
            message: 'Form is not valid! Please check the fields.',
            type: 'is-danger',
            position: 'is-top'
          })
        } else {
          this.authenticate()
        }
      })
    },
    forgotPassword () {
      this.$modal.open({
        parent: this,
        component: ResetPassword,
        width: 720
      })
    }
  },
  mounted () {
    EventBus.$on('failedAuthentication', (msg) => {
      this.errorMsg = msg
    })
  },
  beforeDestroy () {
    EventBus.$off('failedAuthentication')
  }
}

</script>
