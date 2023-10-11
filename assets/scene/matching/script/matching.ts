import { _decorator, Component, director, EditBox, Node } from 'cc';
const { ccclass, property } = _decorator;

import { GlobalState } from '../../../script/globalState';

const globalState = GlobalState.getInstance()

@ccclass('matching')
export class matching extends Component {

    @property(EditBox)
    public rivalIdEditBox: EditBox | null = null;

    public websocket: any = null;

    start() {
        this.websocket = globalState.webSocket;  // 获取websocket对象

        this.websocket.listionSignal(this, "playerSend", this.onPlayerSend);
    }

    onInviteButtonClicked() {
        director.loadScene("matchingWaiting");
    }

    onJoinButtonClicked() {
        let rivalId = this.rivalIdEditBox.string;
        this.websocket.socketSend(this, "send", {id: rivalId, data: {"id": globalState.get("connectID"), "title": "join"}});
    }

    onPlayerSend(self, data){
        console.log("playerSend", data);
        if (data.title == "join") {
            globalState.set("rivalID", data.id);
            globalState.set("rivalState", false);
            director.loadScene("petSelection");
        }
    }

    update(deltaTime: number) {
        
    }
}


