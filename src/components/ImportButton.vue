<template>
  <b-field class="file">
    <b-upload v-model="file" accept=".csv">
      <a class="button is-primary">
        <b-icon icon="upload"></b-icon>
        <span>Click to upload</span>
      </a>
    </b-upload>
    <span class="file-name" v-if="file">
        {{ file.name }}
    </span>
    <button v-on:click="showContent">

    </button>
  </b-field>
</template>

<script>
export default {
  data () {
    return {
      file: null,
      content: ''
    }
  },
  methods: {
    showContent: function () {
      console.log(this.content)
    }
  },
  watch: {
    file: function (newValue, oldValue) {
      var reader = new FileReader()

      reader.onload = function (event) {
        this.content = event.target.result
      }.bind(this)
      reader.readAsText(this.file)
    },
    content: function (newValue, oldValue) {
      console.log(newValue)
      if (newValue !== '') {
        this.$toast.open({
          message: 'File loaded successfully',
          type: 'is-success'
        })
      }
    }
  }
}
</script>
