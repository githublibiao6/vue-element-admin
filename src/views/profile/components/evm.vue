<template>
  <el-card style="margin-bottom:20px;">
    <div class="user-education user-bio-section">
      <div class="user-block">
        <img class="img-circle" :src="img_url">
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getImg } from '@/api/system/evm'
// import user from '../../../store/modules/user'

export default {
  name: 'Newbase',
  data() {
    return {
      img_url: ''
    }
  },
  computed: {
    ...mapGetters([
      'id'
    ])
  },
  // 页面初始化
  created() {
    this.getImgData()
  },
  methods: {
    getImgData() {
      getImg(this.id).then(response => {
        this.img_url = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
