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
export default {
  data () {
    return {
      file: null
    }
  },
  watch: {
    file: function (newValue, oldValue) {
      if (newValue !== null) {
        let fileData = new FormData()
        fileData.append('pools_csv', this.file)

        this.$http
          .post('http://127.0.0.1:5000/import', fileData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            this.$toast.open({
              message: `File loaded succesfully`,
              position: 'is-bottom',
              type: 'is-success'
            })
          })
          .catch(error => {
            this.$toast.open({
              message: `Error`,
              position: 'is-bottom',
              type: 'is-danger'
            })
          })
      }
    }
  }
}
</script>
