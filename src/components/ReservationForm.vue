<template>
  <div class="modal-card" style="width:500px">
    <header class="modal-card-head">
      <p class="modal-card-title"><b>{{ this.PoolName }}</b></p>
    </header>
    <section class="modal-card-body">
        <b-field>
          <div class="columns">
            <div class="column">
              <b-datepicker
                inline
                v-model="selectedDate"
                :min-date="today">
                  <b-field grouped group-multiline>
                    <b-radio-button type="is-primary" v-for="(slot, index) in timeSlots" :key="index" v-model="selectedSlot" :native-value="index"
                      :disabled="slot.start < now && today.getDate() === selectedDate.getDate()">
                      <span>
                      {{ printTimeSlot(slot) }}
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
              :max="this.MaxCount"
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
    </footer>
  </div>
</template>

<script>
import { TIME_SLOTS } from '@/consts.js'

export default {
  props: {
    PoolName: {
      type: String,
      default: ''
    },
    PoolID: {
      type: String,
      default: ''
    },
    MaxCount: {
      tpye: Number,
      default: 10000
    },
    Count: {
      type: Number,
      default: 0
    },
    StartDate: {
      type: Date,
      default: new Date()
    },
    ReservationID: {
      type: Number,
      default: null
    }
  },
  data () {
    const today = new Date()
    return {
      today: new Date(today.getUTCFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0),
      now: new Date(today.getUTCFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), 0, 0),
      selectedDate: this.StartDate,
      machinesCount: this.Count,
      timeSlots: TIME_SLOTS,
      selectedSlot: null
    }
  },
  methods: {
    saveForm () {
      const startTime = this.timeSlots[this.selectedSlot]['start']
      const endTime = this.timeSlots[this.selectedSlot]['end']
      const startDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), startTime.getHours(), startTime.getMinutes())
      const endDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), endTime.getHours(), endTime.getMinutes())

      const reservationProps = {
        PoolID: this.PoolID,
        Count: this.machinesCount,
        StartDate: startDate,
        EndDate: endDate,
        ReservationID: this.ReservationID,
        Email: this.$store.getters.getUserData.email
      }

      this.$emit('saveReservation', reservationProps)
      this.$emit('close')
    },
    printTimeSlot (slot) {
      return slot['start'].toLocaleTimeString('pl-PL').split(':').slice(0, 2).join(':') + ' - ' + slot['end'].toLocaleTimeString('pl-PL').split(':').slice(0, 2).join(':')
    }
  }
}
</script>
