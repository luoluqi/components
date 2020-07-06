function Slider (opt) {
    this.id = opt.id
    this.time = opt.time || 3000
    this.showDot = opt.showDot || true
    this.transition = 0.5
    this.index = 0
    this.slidesLength = 1
    this.timer = null
    this.timer1 = null
    this.timer2 = null

    this.init()

   this.update()
    
}

Slider.prototype.init = function () { 
    var self = this
    // var sliderCon = document.querySelector('#' + this.id)
    // sliderCon.onmouseenter = function(){
    //     self.clear()
    // }
    // sliderCon.onmouseleave = function(){
    //     self.timer = setTimeout(function (){
       
    //         self.next()
    //     }, self.time)
    // }

    this.imgList = sliderCon.getElementsByClassName('slider-img')
    for (let i = 0; i < this.imgList.length; i++) {
        this.imgList[i].onclick = function(){
            self.spring(i)
        }
    }

    this.slidesLength = this.imgList.length
    
    sliderCon.style.position = 'relative'
    for (var i = 0;i<this.imgList.length; i++) {
        this.imgList[i].style.position = 'absolute'
        this.imgList[i].style.transition = '0.5s'
    }
}
Slider.prototype.update = function () {
    

    var list = this.setCenter(this.imgList, this.index)
    var ban  = Math.ceil((list.length - 1) / 2)
   
    var centerIndex = Math.floor(list.length / 2)
    for (var i = 0; i<list.length; i++) {
        var img = list[i]
        
        var offset = i - centerIndex
        
        if (offset == 0) {
            img.style.zIndex = 100
        }else {
            img.style.zIndex = this.imgList.length - offset
        }

        img.style.top = '0px'
        img.style.left = (50 + offset * (50 / (ban + 1))) + '%'
        var scale = 1 - Math.abs(offset) * 0.2
        img.style.transform = 'translateX(-50%) scale(' + scale + ')'

    }

    var self = this
    this.timer = setTimeout(function (){
       
        self.next()
    }, this.time)
}
Slider.prototype.setCenter = function (arr, index) {

    var ban  = Math.ceil((arr.length - 1) / 2)
   
    var newArr = []
    for (var i = 0; i <= ban;i++) {
        var num = index + i
        if (num > arr.length - 1) {
            num = num - arr.length

        }
        newArr.push(arr[num])
        
    }
    for (var i = 0; i < ban;i++) {
        var num = index - i - 1
        if (num < 0) {
            num = arr.length + num

        }
        newArr.unshift(arr[num])
        
    }
   return newArr
}

Slider.prototype.prev = function(){
    this.index -- 
    if (this.index < 0) {
        this.index = this.slidesLength - 1
    }

    this.clear()
    this.update()
}
Slider.prototype.next = function(){
    this.index ++
    if (this.index > this.slidesLength - 1) {
        this.index = 0
    }
    this.clear()
    this.update()
}

Slider.prototype.spring = function(index){
    this.index = index
    this.clear()
    this.update()
}

Slider.prototype.clear = function(){
    clearTimeout(this.timer)
}