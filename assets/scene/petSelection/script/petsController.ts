import { _decorator, Component, Node, Animation, resources, Button, Label, director } from 'cc';
const { ccclass, property } = _decorator;
import { GlobalState } from '../../../script/globalState';

const globalState = GlobalState.getInstance()

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

    @property(Button)
    startButton = null;

    @property(Label)
    tipLabel = null;

    animationComponent = null; // 动画组件

    websocket: any = null;
    state: boolean = false;

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

        // this.tipLabel.active = false;

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

        this.websocket = globalState.webSocket;  // 获取websocket对象
        this.websocket.listionSignal(this, "playerSend", this.onPlayerSend);

    }

    // 加载所需的动画资源
    loadAnimationClip() {
        // 加载 AnimationClip
        var self = this;
        resources.load("animation/圣水守护图鉴", function (err, clip) {
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

    onPlayerSend(self, data){
        console.log("playerSend", data);
        if(data.title == "beigin"){
            console.log("对方已经可以开始游戏");
            globalState.set("rivalState", true);
            if (self.state) {
                console.log("开始游戏");
                director.loadScene("play");
            }
        }
    }

    onStarButtonClicked() {
        this.state = true;
        this.websocket.socketSend(this, "send", {id: globalState.get("rivalID"), data: {"id": globalState.get("connectID"), "title": "beigin"}});

        if (globalState.get("rivalState")) {
            console.log("开始游戏", globalState.get("rivalState"));
            director.loadScene("play");
        }else{
            this.tipLabel.string = "等待对方准备";
        }
    }



    update(deltaTime: number) {

    }
}


