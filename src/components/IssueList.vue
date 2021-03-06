<template>
    <div class="columns is-centered">
      <div class="column is-7">
        <b-tabs position="is-centered" :animated="false">

          <b-tab-item>
            <template slot="header">
              <b-icon icon="clock"></b-icon>
              <span> Opened <b-tag rounded> {{ this.openedIssues.length }} </b-tag> </span>
            </template>
            <article v-for="issue in openedIssues" :key="issue.IssueID" class="message is-info">
              <div class="message-header" style="height: 50px">
                <div v-if="isAdmin">
                  <b-button type="is-light" size="is-small" rounded @click="showPoolForm(issue.PoolID)">{{issue.PoolName}}</b-button>
                </div>
                <div v-else > ({{issue.PoolName}}) </div>
                <div style="is-centered">
                  {{ issue.Subject }}
                </div>
                <div class="buttons">
                  <b-button v-if="isAdmin"
                    rounded
                    size="is-small"
                    icon-left="check"
                    @click.native="resolveIssueConfirm(issue.IssueID)">
                  </b-button>
                  <b-button
                    rounded
                    size="is-small"
                    icon-left="times"
                    @click.native="rejectIssueConfirm(issue.IssueID)">
                  </b-button>
                </div>
              </div>
              <div class="message-body">
                {{ issue.Message }}
              </div>
            </article>
          </b-tab-item>

          <b-tab-item>
            <template slot="header">
              <b-icon icon="check"></b-icon>
              <span>Resolved<b-tag rounded> {{ this.resolvedIssues.length }}</b-tag></span>
            </template>
            <article v-for="issue in resolvedIssues" :key="issue.IssueID" class="message is-success">
              <div class="message-header" style="height: 50px">
                <p>{{ issue.Subject }} ({{issue.PoolName}})</p>
                <div class="buttons">
                  <b-button v-if="isAdmin"
                    rounded
                    size="is-small"
                    icon-left="undo"
                    @click.native="reopenIssueConfirm(issue.IssueID)">
                  </b-button>
                </div>
              </div>
              <div class="message-body">
                {{ issue.Message }}
              </div>
            </article>
          </b-tab-item>

          <b-tab-item label="Rejected" icon="times">
            <template slot="header">
              <b-icon icon="times"></b-icon>
              <span>Rejected<b-tag rounded> {{ this.rejectedIssues.length }}</b-tag></span>
            </template>
            <article v-for="issue in rejectedIssues" :key="issue.IssueID" class="message is-danger">
              <div class="message-header" style="height: 50px">
                <p>{{ issue.Subject }} ({{issue.PoolName}})</p>
                <div class="buttons">
                  <b-button v-if="isAdmin"
                    rounded
                    size="is-small"
                    icon-left="undo"
                    @click.native="reopenIssueConfirm(issue.IssueID)">
                  </b-button>
                </div>
              </div>
              <div class="message-body">
                {{ issue.Message }}
              </div>
            </article>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
</template>

<script>
import { loadIssuesReq, resolveIssueReq, rejectIssueReq, reopenIssueReq, loadPoolReq, editPoolReq } from '@/api'
import EditPoolForm from '@/components/EditPoolForm.vue'

export default {
  data () {
    return {
      issues: [],
      poolData: null
    }
  },
  methods: {
    loadIssues () {
      const email = this.$store.getters.getUserData.email

      loadIssuesReq(email)
        .then(response => {
          this.issues = response.data.issues
        })
        .catch(error => this.handleError(error))
    },
    resolveIssueConfirm (issueID) {
      this.$dialog.confirm({
        title: 'Resolving issue',
        message: 'Are you sure you want to <b>resolve</b> this issue?',
        confirmText: 'Resolve',
        type: 'is-success',
        hasIcon: true,
        onConfirm: () => this.resolveIssue(issueID)
      })
    },
    resolveIssue (issueID) {
      resolveIssueReq(issueID)
        .then(response => {
          this.loadIssues()
          this.$toast.open({
            message: `Issue resolved successfully`,
            position: 'is-top',
            type: 'is-success'
          })
        })
        .catch(error => this.handleError(error))
    },
    rejectIssueConfirm (issueID) {
      this.$dialog.confirm({
        title: 'Rejecting issue',
        message: 'Are you sure you want to <b>reject</b> this issue?',
        confirmText: 'Reject',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.rejectIssue(issueID)
      })
    },
    rejectIssue (issueID) {
      rejectIssueReq(issueID)
        .then(response => {
          this.loadIssues()
          this.$toast.open({
            message: `Issue rejected successfully`,
            position: 'is-top',
            type: 'is-success'
          })
        })
        .catch(error => this.handleError(error))
    },
    reopenIssueConfirm (issueID) {
      this.$dialog.confirm({
        title: 'Reopening issue',
        message: 'Are you sure you want to <b>reopen</b> this issue?',
        confirmText: 'Reopen',
        type: 'is-info',
        hasIcon: true,
        onConfirm: () => this.reopenIssue(issueID)
      })
    },
    reopenIssue (issueID) {
      reopenIssueReq(issueID)
        .then(response => {
          this.loadIssues()
          this.$toast.open({
            message: `Issue reopened successfully`,
            position: 'is-top',
            type: 'is-success'
          })
        })
        .catch(error => this.handleError(error))
    },
    editPool (poolID, poolProps) {
      editPoolReq(poolID, poolProps)
        .then(response => {
          this.$toast.open({
            message: `Pool edited successfully`,
            position: 'is-top',
            type: 'is-success'
          })
        })
        .catch(error => this.handleError(error))
    },
    showPoolForm (poolID) {
      loadPoolReq(poolID)
        .then(response => {
          const pool = response.data.pool
          this.$modal.open({
            parent: this,
            component: EditPoolForm,
            hasModalCard: true,
            props: pool,
            events: {
              'poolRequest': (poolProps) => {
                this.editPool(poolID, poolProps)
              }
            }
          })
        })
        .catch(error => this.handleError(error))
    }
  },
  mounted () {
    this.loadIssues()
  },
  computed: {
    openedIssues () {
      return this.issues.filter((issue) => {
        return issue.Rejected === 'false' && issue.Resolved === 'false'
      })
    },
    rejectedIssues () {
      return this.issues.filter((issue) => {
        return issue.Rejected === 'true'
      })
    },
    resolvedIssues () {
      return this.issues.filter((issue) => {
        return issue.Resolved === 'true'
      })
    },
    isAdmin () {
      return this.$store.getters.getIsAdmin
    }
  },
  components: {
    // eslint-disable-next-line
    EditPoolForm
  }
}
</script>

<style lang="scss" scoped>
.pool-link:hover {
  color: blueviolet !important;
  text-decoration-line: none !important;
}
.pool-link {
  text-decoration-line: none !important;
}

</style>
