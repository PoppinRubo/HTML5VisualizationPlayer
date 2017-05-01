/**
 * HTML5 Audio Visualizer Player
 * HTML5音乐可视化播放器
 * 版本号:0.4.0.20170501_Alpha
 * Author：PoppinRubo
 * License: MIT
 */

//创建一个对象方法
function Player() {
    //时间计时器
    var timer;
    //先把自己用变量储存起来,后面要用
    var Myself = this;
    //默认设置
    Myself.button = {//设置生成的控制按钮,默认开启
        prev: true,//上一首
        play: true,//播放,暂停
        next: true,//下一首
        volume: true//音量
    }
    //频谱配置,外部调用就开始进行处理
    this.config = function (Object) {
        Myself.playList = Object.playList;
        Myself.canvasId = Object.canvasId;
        Myself.autoPlay = Object.autoPlay;
        Myself.button = Object.button;
        //记录是否处理过音频,保证createMediaElementSource只创建一次,多次创建会出现错误
        Myself.handle = 0;
        createParts();
    }

    //实例化一个音频类型window.AudioContext
    function windowAudioContext() {
        //下面这些是为了统一Chrome和Firefox的AudioContext
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
        try {
            Myself.audioContext = new AudioContext();
        } catch (e) {
            console.log(e + ',您的浏览器不支持 AudioContext');
        }
    }

    //创建播放部件
    function createParts() {
        //创建audio
        var audio = document.createElement("AUDIO");
        var player = document.getElementById("player");
        player.appendChild(audio);
        Myself.audio = audio;
        //创建控制按钮
        var control = document.getElementById("playerControl");
        var button = Myself.button;
        if (button.prev) {
            //上一首,按钮创建
            var prevBtn = document.createElement('i');
            prevBtn.className = "icon-previous";
            prevBtn.id = "playPrev";
            prevBtn.title = "上一首";
            prevBtn.innerHTML = "&#xeaaf";
            control.appendChild(prevBtn);
            //上一首,控制
            var playPrev = document.getElementById("playPrev");
            playPrev.onclick = function () {
                prev();
            }
        }
        if (button.play) {
            //播放,暂停,按钮创建
            var playBtn = document.createElement('i');
            playBtn.className = "icon-play";
            playBtn.id = "playControl";
            playBtn.title = "播放";
            playBtn.innerHTML = "&#xeaa8";
            playBtn.setAttribute('data', 'play');
            control.appendChild(playBtn);
            //播放,暂停,控制
            var playControl = document.getElementById("playControl");
            playControl.onclick = function () {
                play();
            }
        }
        if (button.next) {
            //下一首,按钮创建
            var nextBtn = document.createElement('i');
            nextBtn.className = "icon-next";
            nextBtn.id = "playNext";
            nextBtn.title = "下一首";
            nextBtn.innerHTML = "&#xeab0";
            control.appendChild(nextBtn);
            //下一首,控制
            var playNext = document.getElementById("playNext");
            playNext.onclick = function () {
                next();
            }
        }
        if (button.volume) {
            //音量,按钮创建
            var volumeBtn = document.createElement('i');
            volumeBtn.className = "icon-volume";
            volumeBtn.id = "playVolume";
            volumeBtn.title = "音量";
            playBtn.setAttribute('data', 'normal');
            volumeBtn.innerHTML = "&#xeab3";
            control.appendChild(volumeBtn);
            //音量,点击控制,静音-恢复
            var volumeBtn = document.getElementById("playVolume");
            volumeBtn.onclick = function () {
                volume();
            }
        }
        //显示时间
        var playerTime = document.getElementById("playerTime");
        Myself.playerTime = playerTime;

        //调用实例化AudioContext
        windowAudioContext();

        //加载地址方法,audio加入一个初始地址
        var playList = Myself.playList;
        //把列表第一个mp3地址设置到audio上
        Myself.audio.src = playList[0].mp3;
        //记录当前播放在数组里的位置
        Myself.nowPlay = 0;

        //设置自动播放,开始播放
        if (Myself.autoPlay) {
            play();
        }
    }

    //播放,暂停 控制
    function play() {
        if (Myself.button.play) {//判断是否设置播放按钮
            var playBtn = document.getElementById("playControl");
            var data = playBtn.getAttribute("data");
            //字符图标变化
            if (data == "play") {
                playBtn.setAttribute("data", "pause");
                playBtn.title = "暂停";
                playBtn.innerHTML = "&#xeaa9";
            } else {
                playBtn.setAttribute("data", "play");
                playBtn.title = "播放";
                playBtn.innerHTML = "&#xeaa8"
            }
        }
        //播放控制
        if (Myself.audio.paused) {
            Myself.audio.play();
            timer = setInterval(function () {
                showTime();
            }, 1000);
            //处理播放数据,处理过就不再处理
            if (Myself.handle == 0) {
                playHandle();
            }
        } else {
            window.clearInterval(timer);
            Myself.audio.pause();
        }
    }

    //显示时长
    function showTime() {
        var duration = Myself.audio.duration;
        var currentTime = Myself.audio.currentTime;
        var time = duration - currentTime;
        Myself.playerTime.innerHTML = "-&nbsp;" + Math.floor(time / 60) + ":" + (time % 60 / 100).toFixed(2).slice(-2) + "&nbsp;/&nbsp;" + Math.floor(duration / 60) + ":" + (duration % 60 / 100).toFixed(2).slice(-2);
    }

    //播放上一首
    function prev() {
        //数组播放最前移动到最后
        if (Myself.nowPlay == 0) {
            Myself.nowPlay = Myself.playList.length;
        }
        //记录当前播放在数组里的位置位置移动,减小
        Myself.nowPlay = Myself.nowPlay - 1;
        //取出mp3地址
        Myself.audio.src = Myself.playList[Myself.nowPlay].mp3;
        play();
    }

    //播放下一首
    function next() {
        //数组播放最后移动到最前
        if (Myself.nowPlay == Myself.playList.length - 1) {
            Myself.nowPlay = -1;
        }
        //记录当前播放在数组里的位置位置移动,增加
        Myself.nowPlay = Myself.nowPlay + 1;
        //取出mp3地址
        Myself.audio.src = Myself.playList[Myself.nowPlay].mp3;
        play();
    }

    //音量点击控制,静音-恢复
    function volume() {
        if (Myself.button.volume) {//判断是否设置音量按钮
            var volumeBtn = document.getElementById("playVolume");
            var data = volumeBtn.getAttribute("data");
            //字符图标变化
            if (data == "normal") {
                volumeBtn.setAttribute("data", "mute");
                volumeBtn.innerHTML = "&#xeab6";
            } else {
                volumeBtn.setAttribute("data", "normal");
                volumeBtn.innerHTML = "&#xeab3"
            }
        }
        //点击音量控制
        if (Myself.audio.muted) {
            Myself.audio.muted = false;
        } else {
            Myself.audio.muted = true;
        }
    }

    //播放处理,提取数据
    function playHandle() {
        windowAudioContext();
        var audioContext = Myself.audioContext;
        var analyser = audioContext.createAnalyser();
        var playData = audioContext.createMediaElementSource(Myself.audio);
        // 将播放数据与分析器连接
        playData.connect(analyser);
        analyser.connect(audioContext.destination);
        //接下来把分析器传出去创建频谱
        drawSpectrum(analyser);
        Myself.handle = 1;
    }

    //画出频谱
    function drawSpectrum(analyser) {
        //颜色数组
        var colorArray = ['#f82466', '#00FFFF', '#AFFF7C', '#FFAA6A', '#6AD5FF', '#D26AFF', '#FF6AE6', '#FF6AB8', '#FF6A6A'];
        //颜色随机数
        var colorRandom = Math.floor(Math.random() * colorArray.length);
        //效果随机数
        var effectRandom = Math.floor(Math.random() * 1);
        //随机选取颜色
        Myself.color = colorArray[colorRandom];
        //随机选取效果
        switch (effectRandom) {
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
            capStyle = '#FFFFFF',
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