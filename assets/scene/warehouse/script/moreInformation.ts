import { _decorator, Component, Node, Prefab,instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('moreInformation')
export class moreInformation extends Component {

    private isPop: boolean = false; 

    private popPanelNode: Node|null = null;

    @property(Prefab)
    public popPanelPrefab: Prefab|null = null;

    @property(Node)
    public parentNode: Node|null = null;

    start() {

        this.popPanelNode = instantiate(this.popPanelPrefab);
        console.log(this.popPanelNode);
    }

    public onClick() {
        this.isPop = this.popPanelNode.isChildOf(this.parentNode)

        if(this.isPop) {
            this.parentNode.removeChild(this.popPanelNode);
            this.isPop = false;
        } else {
            this.parentNode.addChild(this.popPanelNode);
            this.isPop = true;
        }
    }

    update(deltaTime: number) {
        
    }
}


