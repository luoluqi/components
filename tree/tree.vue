<template>
    <div>
        <tree-item 
      
        v-for="(item, index) in data" 
        :key="index"
        :data="item" 
        :props="props"
        :selectedData='selectedData'  ></tree-item>
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
    props: ['data', 'props', 'selectedData'],
    methods: {
        
    }
    
}
</script>
<style scoped>

</style>
