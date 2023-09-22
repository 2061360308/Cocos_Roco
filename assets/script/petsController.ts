import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

const allPets = {
    1: {
        name: '麻球',
        animation: "麻球图鉴",
        title: "麻球",
        attribute: "草",
        describe: ""
    },
    2: {
        name: '麻球',
        animation: "清水女皇图鉴",
        title: "麻球",
        attribute: "草",
        describe: ""
    },
    3: {
        name: '麻球',
        animation: "圣水守护图鉴",
        title: "麻球",
        attribute: "草",
        describe: ""
    },
    4: {
        name: '麻球',
        animation: "泽米亚图鉴",
        title: "麻球",
        attribute: "草",
        describe: ""
    },
    5: {
        name: '麻球',
        animation: "皇家圣水迪莫图鉴",
        title: "麻球",
        attribute: "草",
        describe: ""
    },
    6: {
        name: '麻球',
        animation: "苍流图鉴",
        title: "麻球",
        attribute: "草",
        describe: ""
    }
};

@ccclass('petsController')
export class petsController extends Component {

    @property(Node)
    pet1Node = null;

    @property(Node)
    pet2Node = null;

    @property(Node)
    pet3Node = null;

    @property(Node)
    pet4Node = null;

    @property(Node)
    pet5Node = null;

    @property(Node)
    pet6Node = null;

    @property(Node)
    petIdleNode = null;

    animationComponent = null; // 动画组件

    pets = {
        1: {
            name: '麻球',
            animation: "麻球图鉴",
            title: "麻球",
            attribute: "草",
            describe: ""
        },
        2: {
            name: '麻球',
            animation: "清水女皇图鉴",
            title: "麻球",
            attribute: "草",
            describe: ""
        },
        3: {
            name: '麻球',
            animation: "圣水守护图鉴",
            title: "麻球",
            attribute: "草",
            describe: ""
        },
        4: {
            name: '麻球',
            animation: "泽米亚图鉴",
            title: "麻球",
            attribute: "草",
            describe: ""
        },
        5: {
            name: '麻球',
            animation: "皇家圣水迪莫图鉴",
            title: "麻球",
            attribute: "草",
            describe: ""
        },
        6: {
            name: '麻球',
            animation: "苍流图鉴",
            title: "麻球",
            attribute: "草",
            describe: ""
        }
    }


    start() {

        this.loadAnimationClip();

        this.pet1Node.on(Node.EventType.TOUCH_START, (event: Touch) => {
            this.changePetIdel(1);
        }, this);

        this.pet2Node.on(Node.EventType.TOUCH_START, (event: Touch) => {
            this.changePetIdel(2);
        }, this);

        this.pet3Node.on(Node.EventType.TOUCH_START, (event: Touch) => {
            this.changePetIdel(3);
        }, this);

        this.pet4Node.on(Node.EventType.TOUCH_START, (event: Touch) => {
            this.changePetIdel(4);
        }, this);

        this.pet5Node.on(Node.EventType.TOUCH_START, (event: Touch) => {
            this.changePetIdel(5);
        }, this);

        this.pet6Node.on(Node.EventType.TOUCH_START, (event: Touch) => {
            this.changePetIdel(6);
        }, this);

        this.animationComponent = this.petIdleNode.getComponent(Animation);
        // this.playerOnState = this.animationComponent.getState(this.animationComponent.clips[0].name);

        let ws = new WebSocket("ws://service-gs5xkif6-1303709080.gz.apigw.tencentcs.com:80/release/websocket");
        ws.onopen = function (event) {
            console.log("Send Text WS was opened.");
            ws.send(JSON.stringify({ "title": "petList" }));
        };
        ws.onmessage = function (event) {
            console.log("response text msg: " + event.data);
        };
        ws.onerror = function (event) {
            console.log("Send Text fired an error");
        };
        ws.onclose = function (event) {
            console.log("WebSocket instance closed.");
        };

        setTimeout(function () {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send("Hello WebSocket, I'm a text message.");
                console.log("WebSocket instance send.");
            }
            else {
                console.log("WebSocket instance wasn't ready...");
            }
        }, 5000);

    }

    // 加载所需的动画资源
    loadAnimationClip() {
        // 加载 AnimationClip
        var self = this;
        cc.resources.load("animation/圣水守护图鉴", function (err, clip) {
            self.petIdleNode.getComponent(Animation).addClip(clip, "圣水守护图鉴");
        });
    }



    changePetIdel(index: number) {
        console.log(this.pets[index]);

        let self = this;
        this.animationComponent.clips.forEach((item) => {
            // console.log("item",item, "index", index);
            console.log("item", item.name);
            if (item.name === self.pets[index].animation) {
                self.animationComponent.getState(item.name).play();
                console.log("item.animation", item.name);
            } else {
                self.animationComponent.getState(item.name).stop();
            }
        });
        // this.animationComponent.getState(this.pets[index].animation).play();
    }

    update(deltaTime: number) {

    }
}


