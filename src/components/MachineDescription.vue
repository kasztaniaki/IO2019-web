<template>
  <div>
    <ul>
      <li v-for="program in description" :key="program.name">

         <div id="program-tag">
           <b-taglist attached>
                        <b-tag type="is-dark">{{program.name}}</b-tag>
                        <b-tag type="is-info">{{program.version}}</b-tag>
            </b-taglist>
         </div>

      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    description: Object
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
</style>
