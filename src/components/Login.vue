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

        <button type="submit" class="button is-primary"> Log in </button>
      </div>
      <div class="information">
        <p>Don't have an account? <a href="http://localhost:8080/#/users/signup">Sign up</a> </p>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: null,
      password: null
    }
  },
  methods: {
    login () {
      this.$http
        .post('http://127.0.0.1:5000/users/signin', {
          email: this.email,
          password: this.password
        }).then((response) => {
          console.log(response)
          this.$router.push({
            name: 'pools'
          })
        }).catch((err) => {
          console.log(err)
        })
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
  }
}
</script>
