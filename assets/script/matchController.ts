import { _decorator, Component, Node, instantiate, Prefab, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import { websocket } from './websocket';

@ccclass('matchController')
export class matchController extends Component {

    @property(Node)
    parentNode = null;

    @property(Prefab)
    roomNode: Prefab | null = null;

    socket: websocket = null;

    start() {

        this.socket = window['websocket'];  // 获取websocket对象
        console.log("matchController start")
        // console.log(window['testglobal'])
        // this.parentNode.addChild(instantiate(this.roomNode));
        console.log("matchController end")

        // const item = instantiate(this.roomNode);
        // const data = this.items[i];
        // this.parentNode.addChild(item);

        console.log("self.roomNode",this.roomNode)

        let socketInitInterval = setInterval(() => {
            if (this.socket.isOpen()) {
                this.socket.socketSend(JSON.stringify({ title: "getRoomInfo" }));
                clearInterval(socketInitInterval);
            }
        }, 1000);

        // this.socket.socketSend("hello world");
        console.log(this.socket)
        this.socket.onMessage = this.onMessage;
        this.socket.caller = this;
    }

    initRoom(data: object) {

    }

    onMessage(self: matchController, data: string) {
        let dataObj: object = JSON.parse(data);

        if (dataObj.title === "getRoomInfo") {
            console.log("dataObj.result",dataObj.result);

            self.parentNode.getComponent(UITransform).setContentSize(900, dataObj.result.length*110);

            dataObj.result.forEach((data, index) => {
                let item = instantiate(self.roomNode);
                item.setPosition(0, -index * 110 - 60, 0);
                console.log("item", item.children[1], item, item.getComponentInChildren('roomData'))
                self.parentNode.addChild(item);
                console.log(item.getComponent('roomData'))
                item.getComponentInChildren('roomData').init(data);
                console.log("创建", item)
            });
            
        }
    }

    update(deltaTime: number) {

    }
}


