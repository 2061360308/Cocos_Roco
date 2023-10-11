import { _decorator, Component, EditBox, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('dialogController')
export class dialogController extends Component {

    public caller: any = null;

    public callBack: Function|null = null;


    @property(EditBox)
    public editBox: EditBox = null;

    start() {

    }

    init(caller: any, callBack: Function) {
        this.caller = caller;
        this.callBack = callBack;
    }

    commit() {
        console.log("commit");
        let name = this.editBox.string;
        this.callBack(this.caller, name);
        this.node.parent.destroy();
    }

    cancel() {
        console.log("cancel");
        this.node.parent.destroy();
    }

    update(deltaTime: number) {
        
    }
}


