<template>
  <div v-bind:class="{ rolled: !expanded }">

      <div class="columns">

        <div class="column">
          <div v-for="program in description" :key="program.name">
               <div id="program-tag">
                 <b-taglist attached>
                              <b-tag type="is-dark">{{program[0]}}</b-tag>
                              <b-tag type="is-info">{{program[1]}}</b-tag>
                  </b-taglist>
               </div>
          </div>
        </div>
        <div @click="toggleDescription()" class="column is-one-quarter">
          <b-icon
                pack="fas"
                :icon="icon"
                size="is-small">
          </b-icon>
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
.rolled {
  max-height:100px;
  max-width:400px;
  overflow: hidden;
}

</style>
