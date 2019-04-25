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
    description: Array
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
  }
}
</script>

<style lang="scss">
#program-tag {
  padding: 2px;
}
.description {
  max-width: 400px;
}
.rolled {
  max-height: 100px;
  overflow: hidden;
}
</style>
