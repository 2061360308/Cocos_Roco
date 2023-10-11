import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

type SkillValue = [number, number, number, number, number, number, number]

type Skill = {name: string, value: SkillValue[]}

type ZeroToOne = `${0 | 1}.${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

/** 基础属性: hp, pp, 速度, 物攻, 物防, 魔攻, 魔防, 暴击,
*   额外增益: 强化, 固伤, 回复, 反伤, 闪避, 命中
*   额外负态: 吸血, 沉默, 眩晕, 石化, 禁锢
*/ 
type AttributeValue = [
                        number, number, ZeroToOne, ZeroToOne, ZeroToOne, ZeroToOne, ZeroToOne, ZeroToOne,
                        ZeroToOne, ZeroToOne, ZeroToOne, ZeroToOne, ZeroToOne, ZeroToOne,
                        ZeroToOne, boolean, boolean, boolean, boolean
                    ]

type Pet = {
    name: string; // 宠物名字
    sex: "male" | "female";  // 性别
    idle: string; // 图鉴动画名称
    attack: string; // 攻击动画名称
    attribute: AttributeValue; // 属性
    skill: [Skill, Skill, Skill, Skill];  // 技能
}

export class PetsInformation{

    private static instance: PetsInformation | null;

    private petsInformation: { [key: number]: Pet };

    public static getInstance(): PetsInformation {
        if (PetsInformation.instance === (null || undefined)) {
            PetsInformation.instance = new PetsInformation();
        }

        return PetsInformation.instance;
    }


    private constructor() {
        this.petsInformation = {
            1: {
                name: "小白",
                sex: "male"
            }
        }
    }
}


