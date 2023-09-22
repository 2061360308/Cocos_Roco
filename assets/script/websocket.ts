import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export class websocket extends Component {
    //心跳定时器
    private _heartBeatTimer: number;
    //心跳间隔时间
    private HBIntervalTime: number = 5000;
    private HEARTBEAT: string = "HeartBeat";
    //延迟等待定时器
    private _delayWaitTime: number;

    public onMessage: Function = null;
    public caller: object = null;
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
    public connectWebSocket(callfunc?: Function) {
        if (!this._ws) {
            this._ws = new WebSocket("ws://service-gs5xkif6-1303709080.gz.apigw.tencentcs.com:80/release/websocket");

            let self = this;
            this._ws.onopen = function (event) {
                console.log("send text WS was opened");
                //开始心跳检测
                self.resetHeartBeatTimer();
                if (callfunc) {
                    callfunc();
                }

            }
            //消息到达就回调
            this._ws.onmessage = function (event) {
                if (event.data == self.HEARTBEAT) {
                    self.resetHeartBeatTimer();
                    console.debug("心跳测试通过!")
                    return;
                }
                self.onMessage(self.caller, event.data);
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
    
    public socketSend(data: string) {
        if (this._ws.readyState == WebSocket.OPEN) {
            this._ws.send(data)
            console.log("send text msg: " + data);
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
}


