# HTML5VisualizationPlayer
HTML5可视化播放器
<br>
![](https://poppinrubo.github.io/HTML5VisualizationPlayer/images/demo.gif)  

HTML5可视化播放器是一款能将播放音乐画出频谱的播放器
<br>

`使用方法`

<br>
1、引入播放器css与js
```html
    <link type="text/css" rel="stylesheet" href="css/player.css">
    <script src="js/player.js" type="text/javascript"></script>
```
2、加入下面HTML标签
```html
    <div id="player">
        <div id="songInfo"></div>
        <div id="playerControl"></div>
        <div id="playerShow">
            <div id="playerTime"></div>
            <div id="progress">
                <div id="playerProgressBar"></div>
            </div>
        </div>
    </div>
    <!--player外面可以用一个div包起来控制它的大小-->
```

3、调用生成播放器
```Javascript
<script>
    var play = new Player();
    play.config({
        autoPlay: false,//自动播放
        canvasId: "show",//canvas标签id
        button: {//设置生成的控制按钮,不设置button默认全部创建
            prev: true,//上一首
            play: true,//播放,暂停
            next: true,//下一首
            volume: true,//音量
            progressControl: true,//是否开启进度控制
        },
        event: function (e) {//这是一个事件方法,点击控制按钮会传到此方法,点击想要扩展可以写在这个事件方法里
            //参数:e.eventType 事件类型
            //参数:e.describe 事件描述
            if(e.eventType=="prev"||e.eventType=="next"){
                //如果点击了下一首或上一首就执行你的某个方法}
        },
        playList: [//播放列表,mp3地址不可跨域,需要在服务器模式下
            {
                title: "歌曲标题",//音乐标题
                album:"所属专辑",//所属专辑
                artist:"艺术家",//艺术家
                mp3: "music/1.mp3",//音乐路径
            },
            {
                title: "歌曲标题",
                album:"所属专辑",//所属专辑
                artist:"艺术家",//艺术家
                mp3: "music/2.mp3",
            },
            {
                title: "歌曲标题",
                album:"所属专辑",//所属专辑
                artist:"艺术家",//艺术家
                mp3: "music/3.mp3",
            }
        ]
    });
</script>
```

