import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('roomData')
export class roomData extends Component {

    @property(Label)
    public id = null;
    @property(Label)
    public num: Label = null;
    @property(Label)
    public roomName: Label = null;

    start() {

    }

    init(data: object) {
        this.id.string = data.id;

        let num = 0;
        if(data.player1===''){
            num++;
        }
        if(data.player2===''){
            num++;
        }
        this.num.string = num.toString();
        
        this.roomName.string = data.name;
    }

    update(deltaTime: number) {
        
    }
}


