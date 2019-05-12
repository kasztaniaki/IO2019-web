<template>
  <form action="">
    <div class="modal-card" style="width: 600px">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit</p>
      </header>
      <section class="modal-card-body">
        <b-field label="ID">
          <b-input
            value="newPoolID"
            v-model="newPoolID"
            required>
          </b-input>
        </b-field>

        <b-field label="Name">
          <b-input
            value="newDisplayName"
            v-model="newDisplayName"
            required>
          </b-input>
        </b-field>

        <div class="columns">
          <div class="column is-10">
            <b-field label="OS">
              <b-input
                value="newOSName"
                v-model="newOSName"
                required>
              </b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Version">
              <b-input
                value="newOSVersion"
                v-model="newOSVersion"
                required>
              </b-input>
            </b-field>
          </div>
        </div>
        <b-field label="Maximum Count">
          <b-input
            value="newMaximumCount"
            v-model="newMaximumCount"
            required>
          </b-input>
        </b-field>

        <b-field label="Enabled">
          <div @click="toggleEnabled">
            <b-icon id="enabled-icon" v-if="newEnabled" pack="fas" icon="check-circle"></b-icon>
            <b-icon v-else id="disabled-icon" pack="fas" icon="times-circle"></b-icon>
          </div>
        </b-field>

        <label class="label">Description</label>
        <b-field grouped group-multiline>
            <div class="control" v-for="(program, index) in newInstalledSoftware" :key="index">
              <div>
                <b-taglist v-if="program[0]" attached>
                  <b-tag type="is-dark">{{ program[0] }}</b-tag>
                  <b-tag type="is-info" closable @close="newInstalledSoftware.splice(index, 1)">{{ program[1] }}</b-tag>
                </b-taglist>
              </div>
            </div>
        </b-field>
        <br>
        <b-field>
          <b-input
            value="newSofwareName"
            placeholder="Program"
            v-model="newSoftwareName"
            required>
          </b-input>

          <b-input
            value="newSofwareVersion"
            placeholder="Version"
            v-model="newSoftwareVersion">
          </b-input>

          <b-button
            icon-right="plus"
            @click.native="addNewSofware">
          </b-button>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button
        class="button"
        type="is-success"
        icon-left="check"
        @click="$emit('savePool', { newPoolID, newOSName, newOSVersion, newMaximumCount, newInstalledSoftware, newEnabled, newDisplayName })">
          Save
        </b-button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    PoolID: {
      type: String,
      default: ''
    },
    OSVersion: {
      type: String,
      default: ''
    },
    OSName: {
      type: String,
      default: ''
    },
    MaximumCount: {
      type: Number,
      default: 0
    },
    InstalledSoftware: {
      type: Array,
      default: () => []
    },
    Enabled: {
      type: Number,
      default: 0
    },
    DisplayName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      newPoolID: JSON.parse(JSON.stringify(this.PoolID)),
      newOSVersion: JSON.parse(JSON.stringify(this.OSVersion)),
      newOSName: JSON.parse(JSON.stringify(this.OSName)),
      newMaximumCount: JSON.parse(JSON.stringify(this.MaximumCount)),
      newInstalledSoftware: JSON.parse(JSON.stringify(this.InstalledSoftware)),
      newEnabled: JSON.parse(JSON.stringify(this.Enabled)),
      newDisplayName: JSON.parse(JSON.stringify(this.DisplayName)),
      newSoftwareName: null,
      newSoftwareVersion: null
    }
  },
  methods: {
    toggleEnabled () {
      this.newEnabled = !this.newEnabled
    },
    addNewSofware () {
      if (this.newSoftwareName === null) {
        return
      }

      let program = [this.newSoftwareName, this.newSoftwareVersion]
      this.newInstalledSoftware.push(program)

      this.newSoftwareName = null
      this.newSoftwareVersion = null
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
