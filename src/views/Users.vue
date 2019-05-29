<template>
  <div class="container">
    <UserList/>
  </div>
</template>

<script>
import UserList from '@/components/UserList.vue'
export default {
  name: 'Users',
  components: {
    UserList
  }
}
</script>
