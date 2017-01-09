<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2, $event)" class="block positive" :class="{'active': defaultType === 2}">
        {{ desc.all }}
        <span class="count">{{ ratings.length }}</span>
      </span>
      <span @click="select(0, $event)" class="block positive" :class="{'active': defaultType === 0}">
        {{ desc.positive }}
        <span class="count">{{ positives.length }}</span>
      </span>
      <span @click="select(1, $event)" class="block negative" :class="{'active': defaultType === 1}">
        {{ desc.negative }}
        <span class="count">{{ negatives.length }}</span>
      </span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on': defaultOnlyContent}">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0 // 推荐的评论
  const NEGATIVE = 1 // 吐槽的评论
  const ALL = 2 // 全部评论（推荐和吐槽）

  export default {
    props: {
      ratings: { // 所有评论
        type: Array,
        default() {
          return []
        }
      },
      selectType: { // 选择评论的种类（全部 / 推荐 / 吐槽）
        type: Number,
        default: ALL
      },
      onlyContent: { // 选择只看有内容的评论
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    data() {
      return {
        defaultType: this.selectType,
        defaultOnlyContent: this.onlyContent
      }
    },
    methods: {
      select(type, event) {
        if(!event._constructed) {
          return
        }

        this.defaultType = type
        this.$parent.$emit('ratingtype.select', type)
      },
      toggleContent(event) {
        if(!event._constructed) {
          return
        }

        this.defaultOnlyContent = !this.defaultOnlyContent
        // 把改变了查看类型传到父组件内
        this.$parent.$emit('content.toggle', this.defaultOnlyContent)
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          // 把 rateType（决定是吐槽的还是推荐的值）是推荐的评论组成一个新数组
          return rating.rateType === POSITIVE
        })
      },
      negatives() {
         return this.ratings.filter((rating) => {
          // 把 rateType（决定是吐槽的还是推荐的值）是吐槽的评论组成一个新数组
          return rating.rateType === NEGATIVE
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, .1))
      font-size: 0

      & > span
        cursor: pointer

      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        transition: all .1s ease

        &.active
          color: #FFF

        .count
          margin-left: 2px
          font-size: 8px

        &.positive
          background-color: rgba(0, 160, 220, .2)
          &.active
            background-color: rgb(0, 160, 220)
            
        &.negative
          background-color: rgba(77, 85, 93, .2)
          &.active
            background-color: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: rgba(7, 17, 27, .1)
      color: rgb(147,153,159)
      font-size: 0

      &.on
        .icon-check_circle
          color: #00c850

      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
        
      .text
        vertical-align: top
        font-size: 12px
            
          
</style>