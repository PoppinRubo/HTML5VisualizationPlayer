/**
 * HTML5 Audio Visualizer API
 * HTML5音频频谱可视化API
 * Author：PoppinRubo
 * License: MIT
 */

//创建一个对象方法
function Visualizer() {
    //先把自己用变量储存起来,后面要用
    var Myself = this;
    //频谱配置,外部调用就开始进行处理
    this.config = function (Object) {
        Myself.audioUrl = Object.audioUrl;
        Myself.canvasId = Object.canvasId;
        windowAudioContext();
    }
    //下面这些为内部方法,外部不可访问

    //实例化一个音频类型window.AudioContext
    function windowAudioContext() {
        //下面这些是为了统一Chrome和Firefox的AudioContext
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
        try {
            Myself.audioContext = new AudioContext();
            //AudioContext实例化后就拉取音频
            loadSound();
        } catch (e) {
            console.log(e + ',您的浏览器不支持 AudioContext');
        }
    }

    //加载音频对象方法
    function loadSound() {
        var request = new XMLHttpRequest(); //建立一个请求
        request.open('GET', Myself.audioUrl, true); //配置请求类型，文件路径,路径不可跨域
        request.responseType = 'arraybuffer'; //配置数据返回类型
        request.onload = function () {
            //拉取成功返回ArrayBuffer(一块内存空间,缓冲),调用播放
            play(request.response);
        }
        request.send();
    }

    //解码播放,提取数据
    function play(audioData) {
        var audioContext = Myself.audioContext;
        //解码ArrayBuffer
        audioContext.decodeAudioData(audioData).then(function (decodedData) {
            //进来到这里代表解码完成
            //AudioBuffer接口表示存在存储器里的短音频资产，利用AudioContext.decodeAudioData()方法从音频文件构建，
            // 或者利用 AudioContext.createBuffer()构建于原数据。
            // 一旦将其放入AudioBuffer，可以传递到一个 AudioBufferSourceNode进行播放
            var audioBufferSouceNode = audioContext.createBufferSource(),
                analyser = audioContext.createAnalyser();
            //将source与分析器连接
            audioBufferSouceNode.connect(analyser);
            //将分析器与destination连接，形成到达扬声器的通路
            analyser.connect(audioContext.destination);
            //将上面解码得到的decodedData数据赋值给source
            audioBufferSouceNode.buffer = decodedData;
            //播放,到这里就可以听到声音了
            audioBufferSouceNode.start(0);
            //AudioBufferSourceNode 接口代表一个由存储器中的音频数据组成的音频源,它通过AudioBuffer来进行存储. 它是一个AudioNode,现在把它存储一下
            Myself.AudioBufferSourceNode=audioBufferSouceNode;
            //接下来把分析器传出去创建频谱
            drawSpectrum(analyser);
        }, function (e) {
            console.log(e + ",文件解码失败!");
        });

    }
    //画出频谱
    function drawSpectrum(analyser) {
        //颜色数组
        var colorArray=['#f82466','#00FFFF','#AFFF7C','#FFAA6A','#6AD5FF','#D26AFF','#FF6AE6','#FF6AB8','#FF6A6A'];
        //颜色随机数
        var colorRandom=Math.floor(Math.random()*colorArray.length);
        //效果随机数
        var effectRandom=Math.floor(Math.random()*1);
        //随机选取颜色
        Myself.color=colorArray[colorRandom];
        //随机选取效果
        switch(effectRandom)
        {
            case 0:
                //条形
                bar(analyser);
                break;
            default:
                //条形
                bar(analyser);
        }

    }
    //条状效果
    function bar(analyser) {
        var canvas = document.getElementById(Myself.canvasId),
            cwidth = canvas.width,
            cheight = canvas.height - 2,
            meterWidth = 10, //频谱条宽度
            gap = 2, //频谱条间距
            capHeight = 2,
            capStyle = '#fff',
            meterNum = 800 / (10 + 2), //频谱条数量
            capYPositionArray = []; //将上一画面各帽头的位置保存到这个数组
        ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, Myself.color);
        var drawMeter = function () {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var step = Math.round(array.length / meterNum); //计算采样步长
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < meterNum; i++) {
                var value = array[i * step]; //获取当前能量值
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value); //初始化保存帽头位置的数组，将第一个画面的数据压入其中
                }
                ;
                ctx.fillStyle = capStyle;
                //开始绘制帽头
                if (value < capYPositionArray[i]) { //如果当前值小于之前值
                    ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight); //则使用前一次保存的值来绘制帽头
                } else {
                    ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight); //否则使用当前值直接绘制
                    capYPositionArray[i] = value;
                }
                ;
                //开始绘制频谱条
                ctx.fillStyle = gradient;
                ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
            }
            requestAnimationFrame(drawMeter);
        }
        requestAnimationFrame(drawMeter);
    }

}