<template>
  <div class="role">
    123
  </div>
</template>

<script>
import { getRoleList } from '@/api/auth'
export default {
  name: 'Role',
  data() {
    return {
      listLoading: false,
      list: [],
      total: 3,
      listQuery: {
        role_name: '',
        is_divider: ''
      },
      pageQuery: {
        page: 1,
        page_size: 10
      }
    }
  },
  created() {
    console.log('create')
    this.getList()
  },
  methods: {
    getList() {
      console.log(123)
      this.listLoading = true
      getRoleList(this.listQuery, this.pageQuery).then(response => {
        console.log(response)
        console.log(this.list)
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped>

</style>
