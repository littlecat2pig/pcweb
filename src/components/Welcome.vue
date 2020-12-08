<template>
  <div>
    <el-button type="info" @mouseover.native ="resetBackgroundColor" :style="{backgroundColor: bgColor}">信息按钮</el-button>
    <div>
      <span>welcome</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data(){
    return{
      bgColor: '#F5CEC7'
    }
  },
  methods:{
    resetBackgroundColor(){
      this.bgColor = '#C6C09C'
    }
  }
}
</script>

<style scoped>
</style>