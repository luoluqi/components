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
        },
        unselect(data){
            this.$emit('unselect', data)
        },
        allUnSelect(){
            if (this.$refs.treeItem) {
                for (let item of this.$refs.treeItem) {
                    item.allUnSelect()
                }
            }
            
        },
        allSelect(){
            if (this.$refs.treeItem) {
                for (let item of this.$refs.treeItem) {
                    item.allSelect()
                }
            }
        },
        getSelectedList () {
            var self = this
            var list = []
            function getList(children){
             
                if (children) {
                    for (let item of children) {
                        if(item.getSelected()){
                            list.push(item.data)
                        }

                        getList(item.$refs.treeItem)
                    }
                }
            }
            getList(this.$refs.treeItem)

            return list
        },
        isAllSelected () {
            var isAll = true
            if (this.$refs.treeItem) {
                for (let item of this.$refs.treeItem) {
                    var flag = item.isAllSelected()
                
                    if (!flag) {
                        isAll = false
                    }
                }
            }
            
            return isAll
        }
    }
    
}
</script>
<style scoped>

</style>
