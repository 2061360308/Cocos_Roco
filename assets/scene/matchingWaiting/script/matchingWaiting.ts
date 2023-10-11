import { _decorator, Component, Label, Node, director, sys, log } from 'cc';
const { ccclass, property } = _decorator;

import { GlobalState } from '../../../script/globalState';

const globalState = GlobalState.getInstance()

@ccclass('matchingWaiting')
export class matchingWaiting extends Component {

    @property(Label)
    public timingLabel: Label | null = null;

    public timmer: any = null;

    private websocket: any = globalState.webSocket;

    @property(Label)
    public idLabel: Label | null = null;

    start() {
        // console.log("waitingMatching start",this, this.socket)

        let jc = 1;

        let self = this;
        this.timmer =  setInterval(() => {
            jc++;
            try{
                this.timingLabel.string = jc.toString();
            }catch(e){
                console.log(e)
                clearInterval(self.timmer);
            }
            
        }, 1000);

        this.idLabel.string = "当前ID: "+globalState.get("connectID");

        this.websocket.listionSignal(this, "playerSend", this.onPlayerSend);

    }

    onCopyButtonClick() {
        this.copyToClipBoard(globalState.get("connectID"));
    }

    //设置剪切板
    public copyToClipBoard(str) :boolean {
        if (sys.isNative) {
        //原生自己实现
        } else if (sys.isBrowser) {
            var textarea = document.createElement("textarea");
            textarea.textContent = str;
            document.body.appendChild(textarea);
            textarea.readOnly = true;
            textarea.select();
            textarea.setSelectionRange(0, textarea.textContent.length);
            try {
                const flag = document.execCommand('copy');
                document.body.removeChild(textarea);
                if(flag){
                    log("已经复制到剪贴板");
                    return true;
                }else{
                    log("复制到剪贴板失败");
                    return false;
                }
            } catch (err) {
                log("复制到剪贴板失败");
                return false;
            }
        }
    }

    // quitRoom() {
    //     console.log("quitRoom", this, this.socket);
    //     this.socket.socketSend(JSON.stringify({ title: "quitRoom", roomId: this.roomId, roomName: this.roomName }));
    //     director.loadScene("玩家匹配", () => {
    //         clearInterval(this.timmer);
    //     });
    // }

    onPlayerSend(self, data){
        console.log("playerSend", data);
        if (data.title == "join") {
            log("匹配成功");
            globalState.set("rivalID", data.id);
            globalState.set("rivalState", false);
            self.websocket.socketSend(this, "send", {id: data.id, data: {"id": globalState.get("connectID"), "title": "join"}});
            director.loadScene("petSelection",()=>{
                clearInterval(self.timmer);
            });
        }
    }

    update(deltaTime: number) {
        
    }
}


