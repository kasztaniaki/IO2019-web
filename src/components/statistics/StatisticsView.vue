<template>
  <div>
    <div class="columns">
      <div class="column is-5">
        <div class="level">
          <b-button class="level-item my-button"
                icon-left="chevron-left"
                @click.native="weekChange(-1)" ></b-button>
              <div class="level-item">
                June 2019
              </div>
              <b-button class="level-item my-button"
                icon-left="chevron-right"
                @click.native="weekChange(1)" ></b-button>
        </div>
      </div>
      <div class="column">
        <b-field>
          <b-radio-button
            v-model="timeRange"
            native-value='week'
            >
            Week
          </b-radio-button>
          <b-radio-button
            v-model="timeRange"
            native-value='month'
            >
            Month
          </b-radio-button>
          <b-radio-button
            v-model="timeRange"
            native-value='year'
            >
            Year
          </b-radio-button>
        </b-field>
      </div>
    </div>
    <BarChartWrap :labels='pools' :data='stats' chartTitle='Popular Pools' />
    <BarChartWrap :labels='pools' :data='stats' chartTitle='Popular Users'/>
    <BarChartWrap :labels='pools' :data='stats' chartTitle='Bottlenecks'/>
    <BarChartWrap :labels='pools' :data='stats' chartTitle='Least Used'/>
  </div>
</template>

<script>
import BarChartWrap from '@/components/statistics/BarChartWrap.vue'

export default {
  data () {
    return {
      pools: [
        'Gramatyki',
        'Programowanie aplikacji z baza danych',
        'Systemy ekspertowe i sztuczna inteligencja'
      ],
      stats: [
        133, 242, 17
      ],
      timeRange: 'week'
    }
  },
  computed: {
    chartStyles () {
      return {
        position: 'relative',
        height: '200px'
      }
    }
  },
  methods: {
    loadUsers () {
      this.isLoading = true
    },
    chartData (dataLabels, dataPoints, label) {
      var colors = []
      for (const label of dataLabels) {
        colors.push(this.generateColor(label))
      }
      return { labels: dataLabels, datasets: [{ backgroundColor: colors, label: label, data: dataPoints }] }
    },
    generateColor (value) {
      var hash = 0
      for (var i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) * 34 + hash
      }
      return 'hsl(' + hash % 360 + ', 50%, 30%)'
    }
  },
  mounted () {
    this.loadUsers()
  },
  components: {
    BarChartWrap
  }
}
</script>

<style lang="scss">
@import "@/variables.scss";

.chart {
  height: 300px;
}
.my-button {
  border-color: transparent !important;
}
</style>
