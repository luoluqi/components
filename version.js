const fs = require("fs");
const path = require("path");
function addVersion(dir) {
   
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file

       
      
        var stat = fs.statSync(file)
      
        if (stat && stat.isDirectory()){
            addVersion(file)
        }else{
            var extname = path.extname(file);
            if(extname==".html" || extname==".css"){
                replaceVersion(file);
            }
        }
       
    })
   
}

function replaceVersion(file){
  


    console.log(file);
    var html = fs.readFileSync(file, 'utf8');
   

   
    //var reg = /("|')[^"']+.(js|css|png|jpg|jpeg)(\?[^"']+)?("|')/ig;
    var reg = /[^"'()]+\.(js|css|png|jpg|jpeg)(\?[^"'()]+)?/ig;
    var list = [];
    while(true){
        var item = reg.exec(html);
        
        if(item){
            var obj = {};

            var url = item[0];
          

            obj.o = url

            url = url.split("?")[0] + "?v=" + version;

            obj.n = url
           
            list.push(obj);
        }else{
            
            break;
        }
    }
    console.log(list);
  
    for(var obj of list){
        var s = obj.o;
        s = s.replace(/\./g,"\\.");
        s = s.replace(/\?/g,"\\?");
      
        var r = new RegExp(s,"gi");
        html = html.replace(r,obj.n);
       
        
    }
    fs.writeFileSync(file,html,"utf-8");

}


//var version="6.0.0";
//addVersion("C:/Users/luqi/Desktop/王文");



version= (Math.random()  + '').replace('.', '')
// console.log('请输入版本号：')
// process.stdin.setEncoding('utf8');
//   process.stdin.on('data', function(chunk) {
//     version = chunk.replace(/\s/g,'')
//     addVersion(__dirname)
//     process.stdin.pause();
//   });

  addVersion(__dirname)