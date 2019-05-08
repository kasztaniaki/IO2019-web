<template>
  <div class="container">
    <form @submit.prevent="validateBeforeSubmit">
      <p class="message"> Create an account </p>
      <div class="form_styling">
        <b-field :type="{'is-danger': errors.has('firstname')}" :message="errors.first('firstname')">
          <b-input placeholder="First name" v-model="firstname" name="firstname" v-validate="'required|alpha'" />
        </b-field>

        <b-field :type="{'is-danger': errors.has('lastname')}" :message="errors.first('lastname')">
          <b-input placeholder="Last name" v-model="lastname" name="lastname" v-validate="'required|alpha'" />
        </b-field>

        <b-field :type="{'is-danger': errors.has('email')}" :message="errors.first('email')">
          <b-input placeholder="Email" type="text" v-model="email" name="email" v-validate="'required|email'" />
        </b-field>

        <b-field :type="{'is-danger': errors.has('password')}" :message="errors.first('password')">
          <b-input placeholder="Password" type="password" v-model="password" name="password"
            v-validate="'required|min:8'" />
        </b-field>

        <b-field :type="{'is-danger': errors.has('confirm-password')}" :message="[{'The confirm password field is required' : errors.firstByRule('confirm-password', 'required'),
                'The confirm password is not valid' : errors.firstByRule('confirm-password', 'is')}]">
          <b-input placeholder="Confirm password" type="password" v-model="confirmPassword" name="confirm-password"
            v-validate="{ required: true, is: password }" />
        </b-field>

        <button type="submit" class="button is-primary"> Sign up </button>
      </div>

      <div class="information">
        <p>Already have an account? <a href="http://localhost:8080/#/users/signin">Log in</a> </p>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      firstname: null,
      lastname: null,
      email: null,
      password: null,
      confirmPassword: null
    }
  },
  methods: {
    register () {
      this.$http
        .post('http://127.0.0.1:5000/users/signup', {
          first_name: this.first_name,
          last_name: this.last_name,
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

<style lang="scss">
  .message {
    padding: 4px;
    font-size: large;
  }

  .information {
    text-align: left;
  }

  .form_styling {
    width: 38%;
    margin-left: auto;
    margin-right: auto;
  }
</style>
