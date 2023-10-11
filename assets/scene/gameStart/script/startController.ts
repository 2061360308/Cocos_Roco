/**
 * 
 * 游戏开始场景
 *  
 */

import { _decorator, Component, Node, screen, director, sys, view, macro } from 'cc';
import { GlobalState } from '../../../script/globalState';
const { ccclass, property } = _decorator;

const globalState = GlobalState.getInstance()

@ccclass('startController')
export class startController extends Component {
    start() {}

    clickedStart() {
        if (!screen.fullScreen()&& !globalState.get("Debug")) {
            screen.requestFullScreen();
        }


        if (!sys.isNative) {
            view.setResizeCallback(function () {
                view.setOrientation(macro.ORIENTATION_LANDSCAPE);
            });
            // view.setResizeCallback(function () {
            //     if (document.body.scrollWidth > document.body.scrollHeight) {
            //         view.setOrientation(macro.ORIENTATION_LANDSCAPE);
            //     } else {
            //         view.setOrientation(macro.ORIENTATION_PORTRAIT);
            //     }
            // });
        }

        director.loadScene("matching");
    }

    update(deltaTime: number) {

    }
}


