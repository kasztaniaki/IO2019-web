<template>
  <div class="container">
    <form @submit.prevent="validateBeforeSubmit">
      <p class="message"> Change your password </p>
      <div class="form_styling">

        <b-field :type="{'is-danger': errors.has('password')}" :message="errors.first('password')">
          <b-input placeholder="Old password" type="password" v-model="oldPassword" name="password"
            v-validate="'required|min:8'" />
        </b-field>

        <b-field :type="{'is-danger': errors.has('new-password')}" :message="errors.first('new-password')">
          <b-input placeholder="New password" type="password" v-model="newPassword" name="new-password"
            v-validate="'required|min:8'" />
        </b-field>

        <b-field :type="{'is-danger': errors.has('confirm-password')}" :message="[{'The confirm password field is required' : errors.firstByRule('confirm-password', 'required'),
                'The confirm password is not valid' : errors.firstByRule('confirm-password', 'is')}]">
          <b-input placeholder="Confirm new password" type="password" v-model="confirmNewPassword" name="confirm-password"
            v-validate="{ required: true, is: newPassword }" />
        </b-field>

        <button type="submit" class="button is-primary" @click="changePassword()"> Save </button>
      </div>
    </form>
  </div>
</template>

<script>
import EventBus from './EventBus'

export default {
  data () {
    return {
      oldPassword: null,
      newPassword: null,
      confirmNewPassword: null
    }
  },
  methods: {
    changePassword () {
      this.$store.dispatch('changePassword', { oldPassword: this.oldPassword, newPassword: this.newPassword })
        .then(() => this.$router.push('/'))
    },
    validateBeforeSubmit () {
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
  mounted () {
    EventBus.$on('failedRegistering', (msg) => {
      this.errorMsg = msg
    })
  },
  beforeDestroy () {
    EventBus.$off('failedRegistering')
  }
}
</script>
