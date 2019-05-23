<template>
  <div class="modal-card" style="width:800px;height:800px">
    <header class="modal-card-head">
      <p class="modal-card-title">Reservation for <b>{{ this.poolID }}</b></p>
    </header>
    <section class="modal-card-body">
      <b-field>
        <div class="columns">
          <div class="column is-half">
            <label class="label">Start Date</label>
            <b-datepicker
              inline
              v-model="startDate"
              placeholder="Click to select..."
              icon="calendar-today">
            </b-datepicker>
          </div>

          <div class="column is-half">
            <label class="label">End Date</label>
            <b-datepicker
              inline
              v-model="endDate"
              :min-date="startDate"
              placeholder="Click to select..."
              icon="calendar-today">
            </b-datepicker>
          </div>
        </div>
      </b-field>

      <b-field label="Machines Count">
        <b-numberinput
          value="machinesCount"
          v-model="machinesCount"
          :min=0
          :max="poolMaxCount"
          expanded>
        </b-numberinput>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button
        class="button"
        type="is-success"
        icon-left="check"
        :disabled="startDate === null || endDate === null"
        @click="saveForm()">
          Save
      </b-button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    poolID: {
      type: String
    },
    poolMaxCount: {
      type: Number
    }
  },
  data () {
    return {
      startDate: null,
      endDate: null,
      machinesCount: 0
    }
  },
  methods: {
    saveForm () {
      const reservationProps = {
        poolID: this.poolID,
        poolMaxCount: this.poolMaxCount,
        startDate: this.startDate,
        endDate: this.endDate
      }

      this.$emit('saveReservation', reservationProps)
      this.$emit('close')
    }
  }
}
</script>
