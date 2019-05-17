<template>
  <div class="description" v-bind:class="{ rolled: !expanded }">
    <div class="columns">
      <div class="column">
        <b-field grouped group-multiline>
          <div v-for="program in description" :key="program.name">
            <div id="program-tag">
              <b-taglist v-if="program[0]" attached>
                <b-tag type="is-dark">{{program[0]}}</b-tag>
                <b-tag type="is-info">{{program[1]}}</b-tag>
              </b-taglist>
            </div>
          </div>
        </b-field>
      </div>
      <div @click="toggleDescription()" class="column is-one-quarter">
        <b-icon pack="fas" :icon="icon" size="is-small"></b-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    description: Array,
    query: String
  },
  data () {
    return {
      expanded: false,
      icon: 'chevron-down'
    }
  },
  methods: {
    toggleDescription () {
      console.log(this.$data.expanded)
      this.$data.expanded = !this.$data.expanded
      if (this.$data.expanded) {
        this.$data.icon = 'chevron-up'
      } else {
        this.$data.icon = 'chevron-down'
      }
    }
  },
  filters: {
    highlight: function (value, query) {
      var re = RegExp(query, 'i')
      var result = value.toString().replace(re, function (matchedText, a, b) {
        if (matchedText !== '') {
          var res = '<span class="highlight has-background-success">' + matchedText + '</span>'
          return res
        } else return ''
      })
      console.log(result)

      return result
    }
  }
}
</script>

<style lang="scss">
#program-tag {
  padding: 2px;
}
.description {
  max-width: 500px;
  margin-bottom: 10px;
}
.rolled {
  max-height: 64px;
  overflow: hidden;
}
.highlight{
  padding: 3px 0px;
  border-color:hsl(141, 71%, 48%);
  border-style: solid;
  border-width: 0px 2px 0px 2px;
  margin: 0px -2px 0px -2px;
}
</style>
