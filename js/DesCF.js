/*
*
* des 查分分析类
*
*
* */


/*
* 构造函数
* 输入差分值，同时构建数据
* @param differential 差分数值，input输入
* @param bitnum 计算差分的位数，默认就是6位
* */
function DesCF(paraminput) {

    this.paramobj = {
        differential:1,
        bitnum:4,

    }
    this.extend(this.paramobj,paraminput);


    this.CFArray  = [];//差分分析的数据，默认16维
    this.differential = this.paramobj.differential;//差分数值，input输入
    this.bitnum  = Math.pow(2,4);
    //s盒
    this.S1 = [
                [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],
                [0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],
                [4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],
                [15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]
              ];


    //bitnum 不存在或者不是数字或者不是正整数，就默认为4 也就是4位
    if( (!this.paramobj.bitnum) || isNaN(this.paramobj.bitnum)|| (!this.isInteger(this.paramobj.bitnum)) ){
        this.bitnum = this.paramobj.bitnum = 4;
    }else {
        this.bitnum = this.paramobj.bitnum;
    }
    this.bitnum  = Math.pow(2,this.paramobj.bitnum);

    //构建差分分析结构二维数组
    for (var i=0 ; i<this.bitnum ;i++){
        this.CFArray[i] = [];
    }


    /*
    * 初始化16维的差分分析数据数组
    *
    * */
    this.setCFArray = function () {

        for (var i=0;i<64;i++){
            var j = this.differential^i;//异或运算的异或等于本身，得到64对差分位differential的数字对
            //注入对象属性
            var S_i = this.getNumberOfS1ByN(i);
            var S_j = this.getNumberOfS1ByN(j);
            var value = S_i^S_j;
            var i2 = this.to2(i);
            var j2 = this.to2(j);
            var cfnum =[i2,j2];

            //还没添加重复项，就push
            if(!this.isHavingInCFArrayValue(cfnum,this.CFArray[value])){
                this.CFArray[value].push({
                    cfnum :cfnum ,
                    cf: value
                })
            }

        }


        //把下标格式化为二进制
        for (var j=0;j<this.CFArray.length;j++){
            this.CFArray[j].index = this.to2(j);
        }


    }

    this.setCFArray();









}

/*
*
* 判断是否存在于数组里面，避免添加重复
*
* */
DesCF.prototype.isHavingInCFArrayValue =function(cfnum,CFArrayOfValue){
    var cfal = CFArrayOfValue.length;
    for(var i=0;i<cfal;i++){
       if( cfnum.sort().equals(CFArrayOfValue[i].cfnum.sort()) ){
           return true;
       }
    }

    return false;

}





/*
*
* 转二进制
*
* */
DesCF.prototype.to2= function(n){
    n = parseInt(n);
    n = n.toString(2);
    var l = n.length;
    if(l < 6 ){
        for (var i = 0 ;i<(6-l);i++){
            n = '0'+n;
        }

    }
    return n;

}


/*
*
* 获得s和里面的值，通过传入的数值
* */
DesCF.prototype.getNumberOfS1ByN = function (n) {
    var n2=this.to2(n) ;//转做二进制


    var row = n2.substr(0,1) + n2.substr(-1);
    var colunm = n2.substr(1,n2.length-2);
    row = parseInt(row,2);
    colunm = parseInt(colunm,2);
    return this.S1[row][colunm];
}


DesCF.prototype.isInteger = function (obj) {
    return Math.floor(obj) === obj
}


DesCF.prototype.extend=function(o,n){
    for (var p in n){
        if(n.hasOwnProperty(p)){
            o[p]=n[p];
        }

    }
};

