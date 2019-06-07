export default {
  methods: {
    commonError (error) {
      this.$toast.open({
        message: error.response.data,
        position: 'is-top',
        type: 'is-danger'
      })
      console.log(error)
    },
    authError (error) {
      this.$toast.open({
        message: error.response.data,
        position: 'is-top',
        type: 'is-danger'
      })
      console.log(error.message)
      this.$router.push('/users/signin')
    }
  }
}
