<template>
  <div class="modal-card" style="width: auto">
    <form>
      <header class="modal-card-head">
        <p class="modal-card-title">Reset password</p>
      </header>
      <section class="modal-card-body">
        <b-field>
          <p> Please enter your e-mail address and we’ll send you an e-mail where you can reset your password. </p>
        </b-field>
          <b-field :type="{'is-danger': errors.has('email')}" :message="errors.first('email')">
            <b-input placeholder="Email" type="text" v-model="email" name="email" v-validate="'required|email|max:80'" />
          </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary is-centered" @click.prevent="validateBeforeSubmit()">Reset Password</button>
      </footer>
    </form>
  </div>
</template>

<script>
import { resetPasswordReq } from '@/api'

export default {
  data () {
    return {
      email: null
    }
  },
  methods: {
    resetPassword () {
      resetPasswordReq(this.email)
        .then(response => {
          this.$toast.open({
            message: `An email has been sent. Check your inbox.`,
            position: 'is-top',
            type: 'is-success'
          })
          this.$emit('close')
        })
      // eslint-disable-next-line
        .catch(error => this.handleError(error))
    },
    validateBeforeSubmit () {
      this.$validator.validateAll()
        .then((result) => {
          if (!result) {
            this.$toast.open({
              message: 'Form is not valid! Please check the fields.',
              type: 'is-danger',
              position: 'is-top'
            })
          } else {
            this.resetPassword()
          }
        })
    }
  }
}
</script>
