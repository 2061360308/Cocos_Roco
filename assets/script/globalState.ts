/**
 * 全局状态管理
 */
import { websocket } from "./websocket"

export class GlobalState {
    private WebSocket: websocket

    private constructor() {
        this.WebSocket = new websocket();
        this.WebSocket.connectWebSocket()

        let self = this

        this.WebSocket.safeRun(()=>{
            console.log("安全运行 getConnectID")
            // 获取会话id
            this.WebSocket.socketSend(self, "getConnectID", null, (self, data)=>{
                self.set("connectID", data)
                console.log("connectID: ", self.connectID)
            })
        }, this)
    }

    private keyDict: { [key: string]: any } = {
        Debug: false,
    }


    // private 只允许在类内访问
    private static instance: GlobalState | null


    // 获取单例
    public static getInstance(): GlobalState {
        // 判断系统是否已经有这个单例
        if (GlobalState.instance === (null || undefined)) {
            GlobalState.instance = new GlobalState()
        }

        return GlobalState.instance // 单例模式
    }

    set(key: string, value: any) {
        /**
         * setter key
         * @param key
         * @param value
         */

        this.keyDict[key] = value
    }

    get(key: string): any {
        /**
         * getter key
         * @returns any
         * @param key
         */

        let value = this.keyDict[key]

        // 不返回null
        if (value === null) {
            throw new Error('The key is not found in globalState!');
        }
        
        return this.keyDict[key]
    }

    get webSocket(): websocket {
        /**
         * getter webSocket
         */
        return this.WebSocket
    }
}