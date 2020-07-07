<template>
    <div>
        <tree-item 
      
        v-for="(item, index) in data" 
        :key="index"
        :data="item" 
        :props="props"
        :selectedData='selectedData'
        :lazy='lazy'
        :loadNode='loadNode'
        :level='0'  
        
        @select='select'
        @unselect='unselect'

        ref="treeItem"
        ></tree-item>
    </div>
</template>
<script>
//  <tree 
//                 :data="treeData" 
//                 :selectedData="selectedMan" 
//                 @select="select" 
//                 @unselect="unselect"
//                 :props="{label: 'name', id:'loginUserId', children: 'children'}">
//                 </tree>

import treeItem from './tree-item'
import { Group } from 'vux'
export default {
    components: {
        treeItem, Group
    },
    props: {
        data: {
            type: Array,
            default: function(){
                return []
            }
        },
        props: {
            type: Object,
            default: function(){
                return {}
            }
        },
        selectedData : {
            type: Array,
            default: function(){
                return []
            }
        },
        lazy:{
            type:Boolean,
            default: false
        },
        loadNode : {
            type: Function,
            default: () => {}
        }
    },
    data () {
        return {
            selectedList: []
        }
    },
    methods: {
        select(data){
            this.$emit('select', data)
            var isHave = false
            for(let item of this.selectedList) {
                if (item[this.props.id] == data[this.props.id]) {
                    isHave = true
                }
            }
            if (!isHave) {
                this.selectedList.push(data)
            }
        },
        unselect(data){
            this.$emit('unselect', data)
            for(var i = this.selectedList.length - 1; i>=0; i--) {
                var item = this.selectedList[i]
                 if (item[this.props.id] == data[this.props.id]) {
                    this.selectedList.splice(i, 1)
                }
            }
        },
        allUnSelect(){
            
            for (let item of this.$refs.treeItem) {
                item.allUnSelect()
            }
        },
        allSelect(){
             for (let item of this.$refs.treeItem) {
                item.allSelect()
            }
        },
        getSelectedList () {
            return this.selectedList
        },
        isAllSelected () {
            var isAll = true
            for (let item of this.$refs.treeItem) {
                var flag = item.isAllSelected()
              
                if (!flag) {
                    isAll = false
                }
            }
            return isAll
        }
    }
    
}
</script>
<style scoped>

</style>
