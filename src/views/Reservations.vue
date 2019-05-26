<template>
  <div class="container">
    <ReservationList/>
  </div>
</template>

<script>
import ReservationList from '@/components/ReservationList.vue'
export default {
  name: 'Reservations',
  components: {
    ReservationList
  }
}
</script>
