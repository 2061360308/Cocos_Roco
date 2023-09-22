import { _decorator, Component, Node, screen, director } from 'cc';
import { websocket } from './websocket';
const { ccclass, property } = _decorator;

@ccclass('startController')
export class startController extends Component {
    start() {}

    clickedStart() {
        if(! screen.fullScreen()){
            // screen.requestFullScreen();
            console.log("全屏")
        }

        director.loadScene("玩家匹配",()=>{
            window['websocket'] = new websocket();
            window['websocket'].connectWebSocket(()=>{
                /**
                 * 请求房间信息
                 */
                console.log("连接成功")
            });
        });
    }

    update(deltaTime: number) {
        
    }
}


