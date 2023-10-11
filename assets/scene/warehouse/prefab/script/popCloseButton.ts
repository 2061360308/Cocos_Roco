import { _decorator, Component, Node, Script } from 'cc';
const { ccclass, property } = _decorator;

import { moreInformation } from '../../script/moreInformation';

@ccclass('popCloseButton')
export class popCloseButton extends Component {

    @property(Script)
    moreinformation: moreInformation|null = null;


    @property(Node)
    popNode: Node|null = null;

    start() {
    }

    closeClick(){
        this.popNode.parent.removeChild(this.popNode)
        // 
        
    }

    update(deltaTime: number) {
        
    }
}


