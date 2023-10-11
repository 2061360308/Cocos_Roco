import { _decorator, Component, Node, instantiate, Prefab, UITransform, director } from 'cc';
const { ccclass, property } = _decorator;

import { GlobalState } from '../../../script/globalState';

const globalState = GlobalState.getInstance()

@ccclass('matchController')
export class matchController extends Component {

    @property(Node)
    parentNode = null;

    @property(Prefab)
    roomNode: Prefab | null = null;

    socket: any = null;

    @property(Prefab)
    dialogNode: Prefab | null = null;

    @property(Node)
    rootNode: Node | null = null;

    @property(Node)
    creatRoomButton: Node | null = null;


    start() {
        this.socket = globalState.webSocket;  // 获取websocket对象

        let socketInitInterval = setInterval(() => {
            if (this.socket.isOpen()) {
                this.socket.socketSend(JSON.stringify({ title: "getRoomInfo" }));
                clearInterval(socketInitInterval);
            }
        }, 1000);

        console.log(this.socket)
        let socketCallBack = [this.onMessage, this]
        if(this.socket.onMessageCallBack.indexOf(socketCallBack) ===-1 ){
            this.socket.onMessageCallBack.push(socketCallBack);
        }
    }

    onMessage(self: matchController, data: string) {
        let dataObj: object = JSON.parse(data);

        if (dataObj.title === "getRoomInfo") {

            /**
             * 获取并展示房间信息
             */

            // console.log("dataObj.result",dataObj.result);

            self.parentNode.getComponent(UITransform).setContentSize(900, dataObj.result.length*110);

            dataObj.result.forEach((data, index) => {
                let item = instantiate(self.roomNode);
                item.setPosition(0, -index * 110 - 60, 0);
                // console.log("item", item.children[1], item, item.getComponentInChildren('gameRoomControler'))
                self.parentNode.addChild(item);
                // console.log(item.getComponent('gameRoomControler'))
                item.getComponentInChildren('gameRoomControler').init(data);
                // console.log("创建", item)
            });
            
        }
        else if (dataObj.title === "createRoom") {
            director.loadScene("匹配等待", () => {
                window['roomId'] = dataObj.result.roomId;
                window['roomName'] = dataObj.result.roomName;
                // window['websocket'] = this.socket;  // 获取websocket对象
            });
        }
    }

    

    showCreateRoomDialog() {
        let dialogNode = instantiate(this.dialogNode);
        //当父节点不存在时，使用当前组件为父节点
        this.rootNode.addChild(dialogNode);
        console.log("dialogNode",dialogNode.children, dialogNode.children[1].getComponent("dialogController"))
        dialogNode.children[1].getComponent("dialogController").init(this, this.diaglogCommit);
        // dialogNode.parent = this.parent || this.node;
        // this.socket.socketSend(JSON.stringify({ title: "createRoom" }));
    }

    diaglogCommit(self, name) {
        self.socket.socketSend(JSON.stringify({ title: "createRoom", name: name }));
    }

    update(deltaTime: number) {

    }
}


