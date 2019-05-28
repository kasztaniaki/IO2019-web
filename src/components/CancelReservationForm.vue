<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Cancel reservation</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
            <b-radio v-model="radio"
                native-value="one">
                Cancel only this reservation
            </b-radio>
        </div>
        <div class="field">
            <b-radio v-model="radio"
                native-value="series"
                disabled
                type="is-warning">
                Cancel every reservation in
                {{new Date(reservationData.StartDate).toLocaleString('pl-PL',timeOptions)}} -
                {{new Date(reservationData.EndDate).toLocaleString('pl-PL',timeOptions)}}
                for {{reservationData.PoolName}}
            </b-radio>
        </div>
        <div class="field">
            <b-radio v-model="radio"
                native-value="all"
                disabled
                type="is-danger">
                Cancel every reservation for {{reservationData.PoolName}}
            </b-radio>
        </div>
      </section>
      <footer class="modal-card-foot">
        <b-button
        type="is-danger"
        icon-left="trash"
        @click="$emit('cancel',radio); $emit('close')">
          Confirm cancellation
        </b-button>
        <b-button
        type="is-default"
        @click="$emit('close')">
          Abort
        </b-button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    reservationData: {
      type: Object
    }
  },
  data () {
    return {
      radio: 'one',
      timeOptions: { hour: 'numeric', minute: 'numeric' }
    }
  }
}
</script>

<style lang="scss">
#enabled-icon {
  color: green;
}
#disabled-icon {
  color: red;
}
</style>
