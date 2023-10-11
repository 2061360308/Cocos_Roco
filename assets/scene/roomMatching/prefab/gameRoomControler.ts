import { _decorator, Component, Label, Node, Button, director} from 'cc';
const { ccclass, property } = _decorator;

import { websocket } from './websocket';

@ccclass('gameRoomControler')
export class gameRoomControler extends Component {

    @property(Label)
    public id = null;
    @property(Label)
    public num: Label = null;
    @property(Label)
    public roomName: Label = null;

    @property(Button)
    public joinButton: Button = null;

    socket: websocket = null;

    start() {

    }

    init(data: object) {

        this.id.string = data.id;

        this.socket = window['websocket'];  // 获取websocket对象
        let socketCallBack = [this.onMessage, this]
        if(this.socket.onMessageCallBack.indexOf(socketCallBack) ===-1 ){
            this.socket.onMessageCallBack.push(socketCallBack);
        }

        let num = 0;
        if(data.player1===''){
            num++;
        }
        if(data.player2===''){
            num++;
        }
        this.num.string = num.toString();
        
        this.roomName.string = data.name;
        this.joinButton.clickEvents[0].customEventData = data.id;

    }

    roomClick(event: any, id: string) {
        this.socket.socketSend(JSON.stringify({ title: "joinRoom", roomId: id}));
    }

    onMessage(self: gameRoomControler, data: string) {
        let dataObj: object = JSON.parse(data);
        console.log("waitingMatching onMessage", dataObj);
        if (dataObj.title === "joinRoom") {
            if (dataObj.status === "ok") {
                window['otherPlayerId'] = dataObj.result.otherPlayerID;
                window['roomId'] = dataObj.result.roomId;
                director.loadScene("宠物选择", () => {
                    clearInterval(self.timmer);
                });
            }
        }
    }

    update(deltaTime: number) {
        
    }
}


