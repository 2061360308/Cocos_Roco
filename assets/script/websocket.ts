import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

export class websocket extends Component {
    //心跳定时器
    private _heartBeatTimer: number;
    //心跳间隔时间
    private HBIntervalTime: number = 5000;
    private HEARTBEAT: string = "HeartBeat";
    //延迟等待定时器
    private _delayWaitTime: number;

    // 参数信号监听
    private signal: any = {
        // 信号名: [回调函数, 回调函数所在对象]
        // "getRoomInfo": [this.onMessage, this]
        "onopen": [],
    };
    
    /**
     * 创建心跳定时器
     */
    private resetHeartBeatTimer() {
        clearTimeout(this._heartBeatTimer)
        clearTimeout(this._delayWaitTime)
        let self = this;
        this._heartBeatTimer = setTimeout(function () {
            if (self._ws) {
                console.log("send：" + self.HEARTBEAT);
                self._ws.send(self.HEARTBEAT);
                //发送超过20秒未响应就自动关闭socket
                self._delayWaitTime = setTimeout(function () {
                    self.closeSocket(1)
                }, 20000)
            }
        }, this.HBIntervalTime)
    }


    private _ws: WebSocket;
    /**
     * socket
     */
    public connectWebSocket() {
        if (!this._ws) {
            this._ws = new WebSocket("ws://service-gs5xkif6-1303709080.gz.apigw.tencentcs.com:80/release/websocket");

            let self = this;
            this._ws.onopen = function (event) {
                console.log("send text WS was opened");
                
                self.signal["onopen"].forEach((element: any) => {
                    try{
                        element[0](element[1]);
                    }catch (error) {
                        console.log(error);
                    }
                });

                //开始心跳检测
                self.resetHeartBeatTimer();
            }
            //消息到达就回调
            this._ws.onmessage = function (event) {
                if (event.data == self.HEARTBEAT) {
                    self.resetHeartBeatTimer();
                    console.debug("心跳测试通过!")
                    return;
                }

                console.log("response text msg: " + event.data);
                let dataObj: object | null = null;

                try{
                    dataObj = JSON.parse(event.data);
                } catch (error) {
                    console.log(error, event.data);
                    return;
                }

                console.log("dataObj", dataObj);

                self.signal[dataObj.title].forEach((element: any) => {
                    try{
                        element[0](element[1], dataObj.result);
                    }catch (error) {
                        console.log(error);
                    }
                });
                
                console.log("response text msg: " + dataObj);
            }
            this._ws.onerror = function (event) {
                console.log("Send Text fired an error");
            };
            this._ws.onclose = function (event) {
                console.log("WebSocket instance closed.");
            };
        }

    }

    /**
     * 判断是否连接成功
     * @returns boolean
     */

    public isOpen(): boolean {
        return this._ws.readyState == WebSocket.OPEN;
    }


    /**
     * socketSend
     */
    
    public socketSend(caller: any, title: string, data: any = null, callfunc: Function | null = null) {

        let sendData = {}
        if (data === null) {
            sendData["title"] = title
        }else{
            sendData["title"] = title
            sendData["data"] = data
        }
        let sendDataStr = JSON.stringify(sendData);

        // 绑定信号回调

        let callfuncList = []
        if (callfunc !== null) {
            callfuncList.push([callfunc, caller])
        }

        this.signal[title] = callfuncList

        if (this._ws.readyState == WebSocket.OPEN) {
            this._ws.send(sendDataStr)
            console.log("send text msg: " + JSON.stringify(sendData));
        }
        else {
            console.log("WebSocket instance wasn't ready...");
        }
    }
    //最后一次重连延迟器
    private _lastReconnectTime: number;
    /**
     * closeSocket
     * @param closeCount 断开次数
     */
    private closeSocket(closeCount: number) {
        if (this._ws) {
            this._ws.close();
            this._ws = null;
            if (closeCount == 1) {
                //断线重连
                console.log("*******************reconncet**********************");
                this.connectWebSocket();
                let self = this;
                //10秒时间，如果没有连接成功就关闭连接，并且再也不重连
                this._lastReconnectTime = setTimeout(function () {
                    if (self._ws && self._ws.readyState != WebSocket.OPEN) {
                        self._ws.close();
                        this._ws = null;
                    }
                }, 10000)
            }
        }
    }


    public listionSignal(caller: any, title: string, callfunc: Function) {
        if(this.signal[title] === undefined){
            this.signal[title] = []
        }
        this.signal[title].push([callfunc, caller])
    }

    public safeRun(callfunc: Function, caller: any) {
        if (this.isOpen()){
            callfunc(caller)
        }else{
            this.listionSignal(caller, "onopen", callfunc)
        }
    }
}


