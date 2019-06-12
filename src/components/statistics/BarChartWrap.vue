<template>
  <div class="column">
    <b-collapse class="card" @open="this.$refs.chart.renderChart()" :open.sync="open">
      <div class="card-header"
        slot="trigger"
        slot-scope="props"
        role="button">
            <div class="card-header-title title" id='chart-title'>
              {{chartTitle}}
            </div>           
            <a class="card-header-icon">
              <b-icon
                :icon="props.open ? 'menu-down' : 'menu-up'">
              </b-icon>
            </a>
      </div>
      <div class="card-content">
          <b-message type="is-info" has-icon icon-size="small">
            {{tooltip}}
          </b-message>
        <div class="columns">
          <div class="column is-4">
            <div class="level">
              <b-button class="level-item my-button"
                icon-left="minus"
                @click.native="updateNumber(-1)" >
              </b-button>
              <div class="level-item expanded">
                Rows: {{number}}
              </div>
              <b-button class="level-item my-button"
                icon-left="plus"
                @click.native="updateNumber(1)" >
              </b-button>
            </div>
          </div>
          <div v-if="threshold" class="column is-4">
            <div class="level">
              <b-button class="level-item my-button"
                icon-left="minus"
                @click.native="updateThreshold(-0.05)" >
              </b-button>
              <div class="level-item">
                Threshold: {{Number(threshold * 100).toFixed(0) + '%'}}
              </div>
              <b-button class="level-item my-button"
                icon-left="plus"
                @click.native="updateThreshold(0.05)" >
              </b-button>
            </div>
          </div>
        </div>
        <div>
          <BarChart :percent="percent" @click='(event) => console.log(event)' v-if="open" ref='chart' :chart-data='chartData(labels,dataPoints)' />
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import BarChart from '@/components/statistics/BarChart.vue'

export default {
  props: {
    labels: Array,
    dataPoints: Array,
    chartTitle: String,
    loading: Boolean,
    number: Number,
    threshold: Number,
    tooltip: String,
    percent: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loadingComponent: null,
      open: false
    }
  },
  methods: {
    chartData (dataLabels, dataPoints) {
      var colors = []
      for (const label of dataLabels) {
        colors.push(this.generateColor(label))
      }
      return { labels: dataLabels, datasets: [{ backgroundColor: colors, data: dataPoints }] }
    },
    generateColor (value) {
      var hash = 0
      for (var i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) * 34 + hash
      }
      return 'hsl(' + hash % 360 + ', 50%, 30%)'
    },
    updateNumber (offset) {
      this.number += offset
      this.$emit('update:number', this.number)
      this.$emit('hey')
    },
    updateThreshold (offset) {
      this.threshold = Number((this.threshold + offset).toFixed(2))
      this.$emit('update:threshold', this.threshold)
    }
  },
  watch: {
    loading (loading) {
      if (loading) {
        this.loadingComponent = this.$loading.open({
          container: this.$refs.chart.$el
        })
      } else {
        this.loadingComponent.close()
      }
    }
  },
  components: {
    BarChart
  }
}
</script>

<style lang="scss">
@import "@/variables.scss";

.title {
  margin: 0px !important;
}

.my-button {
  border-color: transparent !important;
}
</style>
