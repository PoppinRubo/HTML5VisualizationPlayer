# HTML5可视化播放器
## HTML5VisualizationPlayer
<br>
![](https://poppinrubo.github.io/HTML5VisualizationPlayer/images/1.gif)

![](https://poppinrubo.github.io/HTML5VisualizationPlayer/images/2.gif)

![](https://poppinrubo.github.io/HTML5VisualizationPlayer/images/3.gif)

![](https://poppinrubo.github.io/HTML5VisualizationPlayer/images/demo.png)

HTML5可视化播放器是一款能将音乐播放绘制出频谱的播放器  
> [查看DEMO](https://www.hiphopbl.com/radio/ "街舞部落,街舞音乐电台")  

<hr>

`使用方法`

<br>
1、引入播放器player.css与player.js

``` html
    <link type="text/css" rel="stylesheet" href="css/player.css">
    <script src="js/player.js" type="text/javascript"></script>    
```
2、HTML中加入下面标签,用于创建播放器

``` html
    <player></player>   
```
player外面可以用一个div包起来控制它的大小

3、调用生成播放器

``` javascript

    var play = new Player();
    play.init({
        autoPlay: false,//自动播放,2018年1月谷歌浏览器不支持自动播放，设置true不能自动播放
        effect: 0,//频谱效果,不设置或0为随机变化,1为条形柱状,2为环状声波
        color: null,//颜色 16进制颜色代码,不设置或设置为空(空字符或null)将随机使用默认颜色
        button: {//设置生成的控制按钮,不设置button默认全部创建
            prev: true,//上一首
            play: true,//播放,暂停
            next: true,//下一首
            volume: true,//音量
            progressControl: true,//是否开启进度控制
        },
        event: function (e) {
            //这是一个事件方法,点击控制按钮会到此方法
            //参数:e.eventType 事件类型
            //参数:e.describe 事件详情,或参数
            //e.eventType  prev: 点击上一首,next：点击下一首,play:点击 播放/暂停
            console.log(e);
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

### 改变频谱效果
    播放时如果想要改变效果调用下面方法
    
``` javascript
    
    player.change({
        effect: 3,//效果 0 还原随机, 1 为条形柱状,2为环状声波,3 心电图效果
        color: '#4395ff'//颜色 16进制颜色代码,不设置或设置为空(空字符或null)将随机使用默认颜色
    });
        
```

* 注意事项
<br>
    1、需要在服务器环境下
<br>
    2、mp3 资源如果存在跨域情况需要对资源进行跨域访问CORS设置，否则获取不到声源
