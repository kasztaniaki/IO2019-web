<template>
  <div id="description">
 
      <div v-for="program in description" :key="program.name">
         <div id="program-tag">
           <b-taglist attached>
                        <b-tag type="is-dark">{{program[0]}}</b-tag>
                        <b-tag type="is-info">{{program[1]}}</b-tag>
            </b-taglist>
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

    }
  }
}
</script>

<style lang="scss">
#program-tag {
  padding: 2px;
}
#description {
  max-height:100px;
  max-width:400px;
  overflow: auto;
}
</style>
