<template>
  <b-field class="file">
    <b-upload v-model="file" accept=".csv">
      <a class="button is-primary">
        <b-icon icon="upload"></b-icon>
        <span>Click to upload</span>
      </a>
    </b-upload>
  </b-field>
</template>

<script>
import ImportErrors from '@/components/ImportErrors.vue'
export default {
  data () {
    return {
      file: null,
      errors: []
    }
  },
  methods: {
    sendRequest (isForced) {
      this.$parent.loading = true
      let fileData = new FormData()
      fileData.append('pools_csv', this.file)
      this.$http
        .post('http://127.0.0.1:5000/import', fileData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          params: {
            force: isForced
          }
        })
        .then(response => {
          this.$toast.open({
            message: `File loaded succesfully`,
            position: 'is-top',
            type: 'is-success'
          })
          this.$emit('import')
        })
      // eslint-disable-next-line
          .catch(error => {
          if (error) {
            this.$toast.open({
              message: `Error`,
              position: 'is-top',
              type: 'is-danger'
            })
            this.$modal.open({
              parent: this,
              component: ImportErrors,
              props: {
                errors: error.response.data.errors[0]
              }
            })
            // this.file = null
          }
        })
    }
  },
  watch: {
    file: function (newValue, oldValue) {
      if (newValue !== null) {
        this.sendRequest(false)
      }
    }
  }
}
</script>
