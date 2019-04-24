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
import axios from 'axios'

export default {
  data () {
    return {
      file: null,
      content: ''
    }
  },
  watch: {
    file: function (newValue, oldValue) {
      var reader = new FileReader()

      reader.onload = event => {
        this.content = event.target.result
      }
      reader.readAsText(this.file)
    },
    content: function (newValue, oldValue) {
      if (newValue !== '') {
        axios({
          method: 'post',
          url: 'http://127.0.0.1:5000/import',
          data: {
            files: newValue
          }
        })
          .then(response => {
              this.$toast.open({
                message: 'File loaded successfully',
                type: 'is-success'
              })
            })
          .catch(error => {
            this.$toast.open({
              message: 'Fail',
              type: 'is-danger'
            })
          })
      }
    }
  }
}
</script>
