# HTML5VisualizationPlayer
HTML5可视化播放器
<br>
![](https://poppinrubo.github.io/HTML5VisualizationPlayer/images/demo.gif)  

![](https://poppinrubo.github.io/HTML5VisualizationPlayer/images/demo3.png)  

HTML5可视化播放器是一款能将播放音乐画出频谱的播放器,基于[AudioSpectrumVisualizer](https://github.com/Poppinrubo/AudioSpectrumVisualizer "音频可视化插件")  
<br>

> [查看DEMO](https://www.hiphopbl.com/radio/ "街舞部落,街舞音乐电台")  

<hr>

`使用方法`

<br>
1、引入播放器player.css与player.js

``` html

    <link type="text/css" rel="stylesheet" href="css/player.css">
    <script src="js/player.js" type="text/javascript"></script>    
```
2、加入下面HTML标签,用于创建播放器

``` html

    <player></player>   
```
player外面可以用一个div包起来控制它的大小

3、调用生成播放器

``` javascript

    var play = new Player();
    play.config({
        autoPlay: false,//自动播放,2018年1月谷歌浏览器不支持自动播放只能设置为false
        effect: 0,//频谱效果,不设置或0为随机变化,1为条形柱状,2为环状声波
        button: {//设置生成的控制按钮,不设置button默认全部创建
            prev: true,//上一首
            play: true,//播放,暂停
            next: true,//下一首
            volume: true,//音量
            progressControl: true,//是否开启进度控制
        },
        event: function (e) {
            //这是一个事件方法,点击控制按钮会传到此方法,点击想要扩展可以写在这个事件方法里
            //参数:e.eventType 事件类型
            //参数:e.describe 事件详情,或参数
            //类型为 prev:上一首,next：下一首,play:播放/暂停
            if (e.eventType == "prev" || e.eventType == "next") {
                //如果点击了下一首或上一首就执行事件事件
            }
        },
        energy: function (value) {
            //此时播放的能量值,时刻变化
            //console.log(value);
        },
        playList: [//播放列表
            {
                title: "Kandy",//音乐标题
                album: "",//所属专辑
                artist: "",//艺术家
                mp3: "music/Kandy.mp3",//音乐路径
            },
            {
                title: "Paper Gangsta",//音乐标题
                album: "",//所属专辑
                artist: "",//艺术家
                mp3: "music/PaperGangsta.mp3",//音乐路径
            },
        ]
    });
    
```

* 注意事项
1、需要在服务器环境下
2、mp3 资源如果存在跨域情况需要对资源进行跨域访问CORS设置，否则获取不到声源
