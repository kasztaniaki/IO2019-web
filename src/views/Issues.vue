<template>
  <div class="container">
    <IssueList/>
  </div>
</template>

<script>
import IssueList from '@/components/IssueList.vue'

export default {
  name: 'Issues',
  components: {
    IssueList
  }
}
</script>
