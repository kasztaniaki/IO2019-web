<template>
  <div class="modal-card" style="width:800px">
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
              </b-datepicker>
            </div>

            <div class="column">
                <label v-if="selectedSlot !== null" class="label">{{ this.slots[selectedSlot]['start'].getHours() }}</label>

              <b-dropdown aria-role="list" v-model="selectedSlot">
                <button class="button is-primary" slot="trigger">
                    <span>Time</span>
                    <b-icon icon="menu-down"></b-icon>
                </button>

                <b-dropdown-item v-for="(slot, index) in slots" :key="index" :value="index" aria-role="listitem">
                  <label class="label">
                    {{ slot['start'].toLocaleTimeString('pl-PL').split(':').slice(0, 2).join(':') + " - " + slot['end'].toLocaleTimeString('pl-PL').split(':').slice(0, 2).join(':') }}
                  </label>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </b-field>
      <div class="columns">
        <div class="column is-7">
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
        class="button"
        type="is-success"
        icon-left="check"
        :disabled="selectedDate === null || selectedSlot === null"
        @click="saveForm()">
          Save
      </b-button>
      <b-button @click="timeSlots()">Test</b-button>
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
      slots: TIME_SLOTS,
      selectedSlot: null
    }
  },
  methods: {
    saveForm () {
      const startTime = this.slots[this.selectedSlot]['start']
      const endTime = this.slots[this.selectedSlot]['end']
      const startDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDay(), startTime.getHours(), startTime.getMinutes())
      const endDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDay(), endTime.getHours(), endTime.getMinutes())

      const reservationProps = {
        poolID: this.poolID,
        poolMaxCount: this.poolMaxCount,
        startDate: startDate,
        endDate: endDate
      }

      console.log(startDate)
      console.log(endDate)

      // this.$emit('saveReservation', reservationProps)
      // this.$emit('close')
    },
    timeSlots () {
      this.slots.forEach(slot => {
        console.log(slot['start'].getHours() + ':' + slot['start'].getMinutes())
      })
    }
  }
}
</script>
