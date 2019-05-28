<template>
  <div class="modal-card" style="width:500px">
    <header class="modal-card-head">
      <p class="modal-card-title">Reservation for <b>{{ this.poolID }}</b></p>
    </header>
    <section class="modal-card-body">
        <b-field>
          <div class="columns">
            <div class="column">
              <b-datepicker
                inline
                v-model="selectedDate">
                  <b-field grouped group-multiline>
                    <b-radio-button type="is-primary" v-for="(slot, index) in timeSlots" :key="index" v-model="selectedSlot" :native-value="index">
                      <span>
                      {{ slot['start'].toLocaleTimeString('pl-PL').split(':').slice(0, 2).join(':') + " - " + slot['end'].toLocaleTimeString('pl-PL').split(':').slice(0, 2).join(':') }}
                      </span>
                    </b-radio-button>
                  </b-field>
              </b-datepicker>
            </div>
          </div>
        </b-field>
      <div class="columns is-centered">
        <div class="column">
          <b-field label="Machines Count">
            <b-numberinput
              value="machinesCount"
              v-model="machinesCount"
              :min=0
              :max="poolMaxCount"
              expanded>
            </b-numberinput>
          </b-field>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button
        class="button level-left"
        type="is-success"
        icon-left="check"
        :disabled="selectedDate === null || selectedSlot === null"
        @click="saveForm()">
          Save
      </b-button>
      <b-button
        class="button level-right"
        type="is-danger"
        icon-left="times"
        @click="saveForm()">
          Cancel
      </b-button>
    </footer>
  </div>
</template>

<script>
import { TIME_SLOTS } from '@/consts.js'

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
      selectedDate: new Date(),
      machinesCount: 0,
      timeSlots: TIME_SLOTS,
      selectedSlot: null
    }
  },
  methods: {
    saveForm () {
      const startTime = this.timeSlots[this.selectedSlot]['start']
      const endTime = this.timeSlots[this.selectedSlot]['end']
      const startDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDay(), startTime.getHours(), startTime.getMinutes())
      const endDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDay(), endTime.getHours(), endTime.getMinutes())

      const reservationProps = {
        poolID: this.poolID,
        poolMaxCount: this.poolMaxCount,
        startDate: startDate,
        endDate: endDate
      }

      this.$emit('saveReservation', reservationProps)
      this.$emit('close')
    }
  }
}
</script>
