import { _decorator, screen, Component, view, Node, tween, UITransform, v3,Animation, Camera,CCFloat, SpriteFrame, Sprite} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {

    @property(CCFloat)
    private speed: number = 1/200;  // 移动速度

    private uiTransBg: any = null;

    private animationComponent=null; // 动画组件
    private playerMoveOnState=null;  // 向前走
    private playerMoveDownState=null;  // 向后走
    private playerOnState=null;  // 朝前站立
    private playerDownState=null;  // 朝后站立
    
    @property(Camera)
    camera: Camera = null

    @property(Node)
    NodeBg: Node = null

    @property(Node)
    NodePlayer: Node = null

    private deltaTotal = {x: 0, y: 0};  // 总偏移量

    private deltaTotalMax = {x: 0, y: 0};  // 最大偏移量
    private touchFlag: boolean = false;  // 点击标志

    start () {
        this.NodeBg.on(Node.EventType.TOUCH_START, (event: Touch)=>{
            this.touchFlag = true;
        }, this);
        this.NodeBg.on(Node.EventType.TOUCH_MOVE, (event: Touch)=>{
            if(this.touchFlag){
                this.touchFlag = false;
                this.onClick(event)
            }
        }, this)
        this.NodeBg.on(Node.EventType.TOUCH_END, (event: Touch)=>{
            if(this.touchFlag){
                this.touchFlag = false;
                this.onClick(event)
            }
        },this)

        this.NodeBg.on(Node.EventType.TOUCH_CANCEL, (event: Touch)=>{
            if(this.touchFlag){
                this.touchFlag = false;
            }
        })

        this.NodeBg.on(Node.EventType.MOUSE_DOWN, (event: MouseEvent)=>{
            this.touchFlag = true;
        })

        this.NodeBg.on(Node.EventType.MOUSE_MOVE, (event: MouseEvent)=>{
            if(this.touchFlag){
                this.touchFlag = false;
                this.onClick(event)
            }
        })

        this.NodeBg.on(Node.EventType.MOUSE_UP, (event: MouseEvent)=>{
            if(this.touchFlag){
                this.touchFlag = false;
                this.onClick(event)
            }
        })

        view.setResizeCallback(this.onViewResize)
        
        this.uiTransBg =this.NodeBg.getComponent(UITransform)

        this.deltaTotalMax.x = 1280 - this.uiTransBg.contentSize.x
        this.deltaTotalMax.y = 720 - this.uiTransBg.contentSize.y

        this.animationComponent = this.NodePlayer.getComponent(Animation);
        this.playerOnState = this.animationComponent.getState(this.animationComponent.clips[0].name);
        this.playerDownState = this.animationComponent.getState(this.animationComponent.clips[1].name);
        this.playerMoveOnState = this.animationComponent.getState(this.animationComponent.clips[2].name);
        this.playerMoveDownState = this.animationComponent.getState(this.animationComponent.clips[3].name);
        
        
        
        if(! screen.fullScreen()){
            screen.autoFullScreen();
            console.log("全屏")
        }
    }

    onViewResize(){
        console.log("View change")
    }

    onTouchMove(event: Touch | MouseEvent){

        let delta = event.getDelta()

        this.deltaTotal.x += delta.x;
        this.deltaTotal.y += delta.y;

        let pos = this.camera.node.getPosition()

        this.camera.node.setPosition(v3(pos.x - delta.x, pos.y - delta.y, pos.z))
    }

    onClick(event:Touch | MouseEvent) {
        let pos = event.getUILocation() // 获取点击坐标 (世界坐标)
        let pos_node = this.uiTransBg.convertToNodeSpaceAR(v3(pos.x,pos.y,0)) // 转换为节点坐标

        // console.log("点击坐标:",pos, pos_node)

        pos_node = v3(pos_node.x - this.deltaTotal.x , pos_node.y - this.deltaTotal.y, 0)  // 纠正z为0  纠正偏移量

        /*计算移动距离 */
        let last_pos = this.NodePlayer.getPosition()
        let dx = pos_node.x - last_pos.x;
        let dy = pos_node.y - last_pos.y;
        let dis = Math.sqrt(dx*dx + dy*dy);

        let self = this

        // 缓动系统移动人物
        tween(this.NodePlayer)
            .to(dis*this.speed, {position: pos_node}, {
                onStart:()=>{
                    if(dy<=0){
                        self.playerOnState.stop();
                        self.playerDownState.stop();
                        self.playerMoveOnState.play();
                    }else{
                        self.playerOnState.stop();
                        self.playerDownState.stop();
                        self.playerMoveDownState.play();
                    }
                },
                onComplete:()=>{
                    if(dy<=0){
                        self.playerMoveOnState.stop();
                        
                        self.playerOnState.play();
                    }else{
                        self.playerMoveDownState.stop();
                        self.playerDownState.play();
                    }

                    // 查看是否需要更换地图场景
                    self.checkChangeMap(pos_node);
                }
            })
            .start()
            
    }

    checkChangeMap(pos_node: any){

        console.log("当前位置:",pos_node)
        let x = pos_node.x
        let y = pos_node.y
        let self = this;
        if( 397 < x && x < 640 && -300 < y && y < -160){
            console.log("进入彼得大道")
            cc.resources.load("img/map/彼得大道/spriteFrame", SpriteFrame, (err, sp)=>{
                console.log(err,sp)
                self.NodeBg.getComponent(Sprite).spriteFrame = sp;
            });  // 加载彼得大道地图

            // 重新定位人物位置

            this.NodePlayer.setPosition(v3(0, -200, 0))

            // cc.resources.load("img/map/国王城堡/spriteFrame", SpriteFrame, (err, spriteFrame) => {
            //     this.NodeBg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            // });
        }else if(-640 < x && x < -370 && -290 < y && y < -160 ){

            console.log("进入商店街")
            cc.resources.load("img/map/商店街/spriteFrame", SpriteFrame, (err, sp)=>{
                console.log(err,sp)
                self.NodeBg.getComponent(Sprite).spriteFrame = sp;
            });  // 加载彼得大道地图

            // 重新定位人物位置

            this.NodePlayer.setPosition(v3(0, -200, 0))


        }
    }

    update (deltaTime: number) {
    }
}


