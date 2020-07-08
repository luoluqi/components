<template>
    <div class="tree-item">
       
        <div v-if="data[props.children] && data[props.children].length > 0" @click="selectHandle()"  class="tree-name">
          
            <img v-if="isSelected" class="checkbox middle" src="./img/checkbox-a.png" alt="">
             <img v-else class="checkbox middle" src="./img/checkbox.png" alt="">
            <div class="middle dept-info"> 
                 <div class="middle dept-name">{{data[props.label]}}</div> 
                 <div class="xiaji"  @click.stop="open">
                     <img src="./img/subsd.png" class="subsd middle" alt="">
                     下级
                 </div>
                 
             </div>
        </div>
         <div  v-else class="tt-name" @click="selectHandle()" :class="{'selected': isSelected}">
             <img v-if="isSelected" class="checkbox middle" src="./img/checkbox-a.png" alt="">
             <img v-else class="checkbox middle" src="./img/checkbox.png" alt="">
             <div class="middle man-info"> 
                 <!-- <img v-if="data.img" :src="data.img" @error="defaultBackImg" class="head-img middle">
                 <img v-else src="@/assets/img/default_head.png" class="head-img middle" alt=""> -->
                 <div class="middle">{{data[props.label]}}</div> 
             </div>
           
        </div>
        <div class="tree-list" :class="{'open': isOpen, 'close': !isOpen}" v-if="data[props.children]">
            <tree-item 
           
            v-for="(item, index) in data[props.children]" 
            :key="index"
            
           
            :data="item" 
            :props="props"
            :lazy="lazy"
            :level='level + 1'
             :loadNode='loadNode'
            
              @select='select'
              @unselect='unselect'

                ref="treeItem"
            ></tree-item>
        </div>
        
    </div>
</template>
<script>
import { Group } from 'vux'
export default {
    name: 'treeItem',
    components: {
        Group
    },
    props: {
        data: {
            type: Object,
            default: function(){
                return Object
            }
        },
        props: {
            type: Object,
            default: function(){
                return {}
            }
        },
         lazy:{
            type:Boolean,
            default: false
        },
         loadNode : {
            type: Function,
            default: () => {}
        },
        level: {
            type:Number,
            default: 0
        }
    },
   
    computed:{
      
    },
    data () {
        return {
            isOpen: false,
            isSelected: false,
            countNum: 0
        }
    },
    methods: {
        getSelected(){
            return this.isSelected
        },
        isAllSelected () {
            if (this.$refs.treeItem) {
                 var isAllSelected = true
                 for (let item of this.$refs.treeItem) {
                    var isSelected = item.getSelected()
                    if (!isSelected) {
                        isAllSelected = false
                    }
                }
                return isAllSelected
            } else {
                return true
            }
        },
        defaultBackImg() {
            if(event.type == "error") {
            event.target.src = require("../../assets/img/default_head.png")
            }
        },
        open () {
            this.isOpen = !this.isOpen
            if (this.lazy && this.data[this.props.children].length == 0) {
                this.data.level = this.level
               new Promise((resolve, reject) => {
                   this.loadNode(this.data ,resolve)
               }).then(res => {
                   this.data[this.props.children] = res
               })
            }
        },
        selectHandle () {
            
            this.isSelected = !this.isSelected
            if (this.isSelected) {
                
                this.$emit('select', this.data)
                this.allSelect()
            } else {
                
                 this.$emit('unselect', this.data)
                 this.allUnSelect()
            }
        },
        selectTrueOrFalse(flag){
            this.isSelected = flag
        },

        select(data){
            this.$emit('select', data)

            var flag = true
            if (this.$refs.treeItem) {
                 for (let item of this.$refs.treeItem) {
                    var isSelected = item.getSelected()
                    if (!isSelected) {
                        flag = false
                    }
                }
            }
            if (flag) {
                this.selectTrueOrFalse(true)
            }
        },
        unselect(data){
            this.$emit('unselect', data)

            this.selectTrueOrFalse(false)
        },
       
        count(arr){
           if(!arr){
               return
           }
                for(var item of arr){
                    if(item.children){
                        this.count(item.children)
                    }else {
                        this.countNum++
                    }
                }
            
        },

        allSelect(){
            this.isSelected = true
            if (this.$refs.treeItem) {
                 for (let item of this.$refs.treeItem) {
                    item.allSelect(true)
                }
            }
        },
         allUnSelect(){
            this.isSelected = false
            if (this.$refs.treeItem) {
                 for (let item of this.$refs.treeItem) {
                    item.allUnSelect(false)
                }
            }
        },

        clear(){
            this.isSelected = false
            if (this.$refs.treeItem) {
                 for (let item of this.$refs.treeItem) {
                    item.clear()
                }
            }
           
        }
    },
    mounted () {
        this.data.level = this.level
    }    
}
</script>
<style scoped>
.tree-item{
    padding: 0rem 0 0rem 0.3rem;
    background: #fff;
    font-size: 0.3rem;
    /* border-top: 1px solid #D9D9D9; */
}
.tree-list{
  transition: 0.5s;
  overflow: hidden;
}
.close{
    height: 0px;
     transition: 0.5s;
}
.open{
     transition: 0.5s;
     height: auto;
}
.icon-p{
    display: inline-block;
    vertical-align: middle;
     fill:#1AAD19;
}

.name-p{
    display: inline-block;
    vertical-align: middle;
}
.tt-name{
   
}
.selected{
   
}
.checkbox{
    display:inline-block;
    width: 0.4rem;
    height: 0.4rem;
}
.middle{
    display:inline-block;
    vertical-align: middle;
}
.head-img{
    display: inline-block;
    width: 0.72rem;
    height: 0.72rem;
    border-radius: 50%;
    margin:0 0.18rem;
}
.man-info{
   padding: 0.2rem 0;
        width: calc(100% - 0.5rem);
    border-bottom: 1px solid rgba(229,229,229,1);
}
.dept-info{
     padding: 0.3rem 0;
        width: calc(100% - 0.5rem);
    border-bottom: 1px solid rgba(229,229,229,1);
}
.subsd{
    display: inline-block;
    width: 0.32rem;
    height: 0.28rem;
}
.dept-name{
    display: inline-block;
     margin:0 0.18rem;
}
.xiaji{
    float:right;
    color:#128FEF;
    margin: 0 0.3rem 0 0;
}
</style>
