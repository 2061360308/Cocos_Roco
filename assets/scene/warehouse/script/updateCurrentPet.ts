import { _decorator, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('updateCurrentPet')
export class updateCurrentPet extends Component {

    private currentPetIndex = 0;

    @property(Label)
    public currentPetNameLabel: Label|null = null;

    @property(Sprite)
    public currentPetSprite: Sprite|null = null;

    @property(Sprite)
    public currentPetSexSprite: Sprite|null = null;

    @property(Sprite)
    public currentPetGroupSprite: Sprite|null = null;

    start() {

    }

    updateInformation() {
        
    }

    update(deltaTime: number) {
        
    }
}


