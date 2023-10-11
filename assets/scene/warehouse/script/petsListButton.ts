import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('petsListButton')
export class petsListButton extends Component {
    
    private pageNum = 1;
    private maxPageNum = 100;
    
    @property(Button)
    public leftButton: Button|null = null;
    
    @property(Button)
    public rightButton: Button|null = null;

    @property(Label)
    public pageNumLabel: Label|null = null;

    start() {

    }

    onLeftButtonClick() {
        if(this.pageNum > 1) {
            this.pageNum--;
            this.changePageNum(this.pageNum);
        }
    }

    onRightButtonClick() {
        if(this.pageNum < this.maxPageNum) {
            this.pageNum++;
            this.changePageNum(this.pageNum);
        }
    }

    changePageNum(num: number) {
        this.pageNumLabel.string = `${num.toString()} / ${this.maxPageNum.toString()}`;
    }

    update(deltaTime: number) {
        
    }
}


