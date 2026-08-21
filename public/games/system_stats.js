
window.SYSTEM_STATS = {
 "新君士坦丁大帝级·多用途型": {
  "伽马风暴投射攻击系统": {
   "weapons": [
    {
     "name": "CT-2x600 \"Gamma Storm\"",
     "actions": [
      {
       "name": "暴击",
       "desc": "有15%概率对目标额外造成170%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 170,
       "cond": "概率",
       "condValue": 0.15
      }
     ],
     "type": "能量",
     "weaponType": "鱼雷",
     "damage": 1200,
     "cycle": 2,
     "lockOn": 6,
     "rounds": 1,
     "cooldown": 15,
     "duration": 0,
     "option": "M2*",
     "dpmShip": 9600,
     "dpmAA": 1344,
     "sysHP": 19800,
     "shield": 6
    }
   ]
  },
  "脉冲防空系统": {
   "weapons": [
    {
     "name": "CP-3x220",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+45",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 45,
       "cond": ""
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 35,
     "cycle": 3,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "B2*",
     "dpmShip": 3150,
     "dpmAA": 863,
     "sysHP": 19800,
     "shield": 1
    },
    {
     "name": "CP-120",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 10,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 10,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 2,
     "duration": 0,
     "option": "B2*",
     "dpmShip": 378,
     "sysHP": 19800,
     "shield": 1
    }
   ]
  },
  "防空导弹系统": {
   "weapons": [
    {
     "name": "MK2-CM-4x200B \"Storm\"",
     "actions": [
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-40%",
       "effect": "防空冷却缩减",
       "value": 40,
       "cond": ""
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+70",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 70,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 4,
     "cooldown": 6,
     "duration": 2,
     "option": "B3*",
     "dpmShip": 1500,
     "dpmAA": 756,
     "sysHP": 19800,
     "shield": 1
    },
    {
     "name": "CM-2x188B",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 15,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 15,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 2,
     "duration": 0,
     "option": "B3*",
     "dpmShip": 900,
     "dpmAA": 468,
     "sysHP": 19800,
     "shield": 1
    }
   ]
  },
  "附加能量模块": {
   "weapons": [
    {
     "name": "RIT-650",
     "actions": [
      {
       "name": "能量武器伤害提升",
       "desc": "舰船能量武器伤害提升10%",
       "effect": "伤害提升",
       "act": "比例加成",
       "value": 10,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "舰载机模块": {
   "weapons": [
    {
     "name": "CBF-200",
     "actions": [
      {
       "name": "搭载中型战机编队",
       "desc": "可搭载中型战机编队1",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 787,
     "option": ""
    },
    {
     "name": "XAC-2000",
     "actions": [],
     "option": ""
    }
   ]
  },
  "侦察无人机系统": {
   "weapons": [
    {
     "name": "CIT-1",
     "actions": [
      {
       "name": "搭载侦查无人机",
       "desc": "侦查无人机容量：3",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 796,
     "option": ""
    }
   ]
  },
  "近程防空系统": {
   "weapons": [
    {
     "name": "CM-2x45B",
     "actions": [
      {
       "name": "防空暴击",
       "desc": "有25%概率对舰载机额外造成100%暴击伤害",
       "effect": "空中暴击打击",
       "act": "基础数值增加",
       "value": 100,
       "cond": "概率",
       "condValue": 0.25
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+20",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 2,
     "cooldown": 2,
     "duration": 1,
     "option": "D1*",
     "dpmShip": 792,
     "sysHP": 19800,
     "shield": 1
    }
   ]
  },
  "目标保护系统": {
   "weapons": [
    {
     "name": "ASM-220",
     "actions": [
      {
       "name": "系统暴击伤害降低",
       "desc": "所有系统受到的暴击伤害降低15%",
       "effect": "系统受到暴击伤害降低",
       "act": "比例减少",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "ASX-120",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 25,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 160,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ],
     "shield": 0.25,
     "armor": 160,
     "option": ""
    },
    {
     "name": "SC-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "伽马风暴离子攻击系统": {
   "weapons": [
    {
     "name": "CI-2x700T \"Helium Flash\"",
     "actions": [],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 400,
     "cycle": 2,
     "lockOn": 6,
     "rounds": 3,
     "cooldown": 10,
     "duration": 6,
     "option": "M1",
     "dpmShip": 9000,
     "dpmAA": 1890,
     "sysHP": 19800,
     "shield": 4
    }
   ]
  },
  "伽马风暴投射武器系统": {
   "weapons": [
    {
     "name": "CM-8x608A \"Gamma Storm\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 850,
     "cycle": 1,
     "lockOn": 6,
     "rounds": 8,
     "cooldown": 26,
     "duration": 8,
     "option": "A1",
     "dpmShip": 23717,
     "dpmAA": 1920,
     "sysHP": 19800,
     "shield": 6
    },
    {
     "name": "CM-8x608 \"Gamma Storm\"",
     "actions": [],
     "type": "能量",
     "weaponType": "导弹",
     "damage": 700,
     "cycle": 1,
     "lockOn": 6,
     "rounds": 8,
     "cooldown": 25,
     "duration": 12,
     "option": "A2*",
     "dpmShip": 18162,
     "dpmAA": 1816,
     "sysHP": 19800,
     "shield": 6
    },
    {
     "name": "CM-12x550",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 350,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 12,
     "cooldown": 40,
     "duration": 12,
     "option": "A2*",
     "dpmShip": 9415,
     "dpmAA": 1163,
     "dpmSiege": 290,
     "sysHP": 19800,
     "shield": 3
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "CG-1350 350mm",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 250,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 7,
     "duration": 0,
     "option": "B1*",
     "dpmShip": 8228,
     "dpmAA": 1371,
     "sysHP": 19800,
     "shield": 1
    },
    {
     "name": "CG-1160B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 50,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "B1*",
     "dpmShip": 2400,
     "dpmAA": 270,
     "dpmSiege": 90,
     "sysHP": 19800,
     "shield": 1
    }
   ]
  },
  "损害管制系统": {
   "weapons": [
    {
     "name": "AST-50",
     "actions": [],
     "type": "维修",
     "weaponType": "电磁",
     "damage": 200,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 10,
     "duration": 0,
     "option": "D3*",
     "dpmShip": 15750,
     "shield": 5
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-600",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-600",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-660",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-4500",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "永恒风暴级·攻击型": {
  "永恒北极星Mk II投射武器系统(测试)": {
   "weapons": [
    {
     "name": "MK2-AM-16x150B \"Eternal Polaris K\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+45",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 45,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 40,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 16,
     "cooldown": 25,
     "duration": 8,
     "option": "A3*",
     "dpmShip": 1745,
     "dpmAA": 593,
     "sysHP": 18000,
     "shield": 1
    },
    {
     "name": "MK4-AT-1-800AT \"Supernova – White\"",
     "actions": [],
     "type": "能量",
     "weaponType": "鱼雷",
     "damage": 1600,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 20,
     "duration": 0,
     "option": "A3*",
     "dpmShip": 9600,
     "dpmAA": 1440,
     "sysHP": 18000,
     "shield": 6
    }
   ]
  },
  "通用近防武器系统": {
   "weapons": [
    {
     "name": "AG-1105B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+50",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "B2*",
     "dpmShip": 900,
     "dpmAA": 405,
     "dpmSiege": 60,
     "sysHP": 18000,
     "shield": 1
    }
   ]
  },
  "NT无人机防空系统": {
   "weapons": [
    {
     "name": "NT-1",
     "actions": [
      {
       "name": "搭载区域防空无人机",
       "desc": "近防无人机容量：3",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "sysHP": 20250,
     "shield": 856,
     "option": ""
    }
   ]
  },
  "雷暴无人机护盾系统": {
   "weapons": [
    {
     "name": "SNT-1",
     "actions": [
      {
       "name": "搭载护盾无人机",
       "desc": "护盾无人机容量",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 861,
     "option": ""
    }
   ]
  },
  "能量补偿装甲系统": {
   "weapons": [
    {
     "name": "RIR-220",
     "actions": [
      {
       "name": "暴击伤害降低",
       "desc": "受到的暴击伤害降低30%",
       "effect": "受到暴击伤害降低",
       "act": "比例减少",
       "value": 30,
       "cond": ""
      },
      {
       "name": "能量伤害降低",
       "desc": "受到能量武器攻击伤害降低15%",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 15,
       "cond": ""
      },
      {
       "name": "物理伤害降低",
       "desc": "受到投射武器攻击伤害降低15%",
       "effect": "受到的投射伤害降低",
       "value": 15,
       "cond": ""
      }
     ],
     "shield": 0.15,
     "option": ""
    }
   ]
  },
  "脉冲炮塔系统": {
   "weapons": [
    {
     "name": "AP-130B",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 15,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 15,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 2,
     "duration": 0,
     "option": "D2*",
     "dpmShip": 431,
     "sysHP": 18000,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "ASX",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 180,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 180,
     "option": ""
    },
    {
     "name": "SC-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "维京离子生成系统": {
   "weapons": [
    {
     "name": "AI-900A \"Viggen\"",
     "actions": [],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 1200,
     "cycle": 1,
     "lockOn": 6,
     "rounds": 4,
     "cooldown": 10,
     "duration": 8,
     "option": "M1",
     "dpmShip": 16000,
     "dpmAA": 3360,
     "sysHP": 18000,
     "shield": 6
    }
   ]
  },
  "实验型等离子投射器": {
   "weapons": [
    {
     "name": "AIM-850T",
     "actions": [],
     "type": "能量",
     "weaponType": "等离子武器",
     "damage": 850,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 4,
     "cooldown": 6,
     "duration": 20,
     "option": "M2*",
     "dpmShip": 15692,
     "dpmAA": 1883,
     "dpmSiege": 2824,
     "sysHP": 18000,
     "shield": 5
    }
   ]
  },
  "永恒北极星Mk II投射武器系统": {
   "weapons": [
    {
     "name": "MK2-AM-8x300B \"Eternal Polaris K\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 55,
     "cycle": 4,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 8,
     "duration": 0,
     "option": "A1",
     "dpmShip": 2700,
     "dpmAA": 396,
     "dpmSiege": 99,
     "sysHP": 18000,
     "shield": 3
    },
    {
     "name": "MK3-AT-800A \"Supernova – White\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 1600,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 20,
     "duration": 0,
     "option": "A1",
     "dpmShip": 9540,
     "dpmAA": 1440,
     "sysHP": 18000,
     "shield": 6
    },
    {
     "name": "MK3-AT-3-750C \"Supernova – White\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 1200,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 3,
     "cooldown": 30,
     "duration": 6,
     "option": "A2*",
     "dpmShip": 11900,
     "dpmAA": 10440,
     "sysHP": 18000,
     "shield": 6
    }
   ]
  },
  "通用火炮平台": {
   "weapons": [
    {
     "name": "AG-2580",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 350,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 8,
     "duration": 0,
     "option": "B1*",
     "dpmShip": 5100,
     "dpmAA": 1050,
     "sysHP": 18000,
     "shield": 6
    },
    {
     "name": "AG-1120B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "B1*",
     "dpmShip": 750,
     "dpmAA": 126,
     "dpmSiege": 63,
     "sysHP": 18000,
     "shield": 1
    }
   ]
  },
  "离子炮塔系统": {
   "weapons": [
    {
     "name": "AI-450A",
     "actions": [],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 800,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 4,
     "duration": 3,
     "option": "D1*",
     "dpmShip": 6857,
     "dpmAA": 1028,
     "sysHP": 18000,
     "shield": 4
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-600",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-600",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-660",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-4500",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "不屈级·导弹型": {
  "护航艇舱": {
   "weapons": [
    {
     "name": "CBC-2200",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：2",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 891,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-100",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 120,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 15,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ],
     "shield": 0.15,
     "armor": 120,
     "option": ""
    },
    {
     "name": "SC-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "MK2\"凛冽寒风\"火箭发射系统": {
   "weapons": [
    {
     "name": "FM-12x410 \"Squall\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 280,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 12,
     "cooldown": 45,
     "duration": 10,
     "option": "589",
     "dpmShip": 10603,
     "dpmAA": 1154,
     "dpmSiege": 1319,
     "sysHP": 15750,
     "shield": 3
    },
    {
     "name": "FM-2x210 \"Squall\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 150,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 2,
     "cooldown": 10,
     "duration": 2,
     "option": "589",
     "dpmShip": 2800,
     "dpmAA": 360,
     "dpmSiege": 30,
     "sysHP": 15750,
     "shield": 3
    }
   ]
  },
  "舰首轨道炮系统": {
   "weapons": [
    {
     "name": "FR-2600",
     "actions": [],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 1800,
     "cycle": 1,
     "lockOn": 10,
     "rounds": 1,
     "cooldown": 18,
     "duration": 0,
     "option": "0",
     "dpmShip": 5966,
     "dpmAA": 540,
     "sysHP": 15750,
     "shield": 6
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "FG-1120",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 50,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "B2*",
     "dpmShip": 2400,
     "dpmAA": 270,
     "dpmSiege": 90,
     "sysHP": 15750,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-600",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-600",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-660",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-4500",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "ST59级·防御型": {
  "突击鱼雷系统": {
   "weapons": [
    {
     "name": "ST-2600",
     "actions": [
      {
       "name": "暴击",
       "desc": "有15%概率对目标额外造成170%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 170,
       "cond": "概率",
       "condValue": 0.15
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 850,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 2,
     "cooldown": 16,
     "duration": 2,
     "option": "M3*",
     "dpmShip": 11200,
     "dpmAA": 2266,
     "sysHP": 15750,
     "shield": 6
    }
   ]
  },
  "舰载机系统": {
   "weapons": [
    {
     "name": "CBF-305",
     "actions": [
      {
       "name": "搭载中型战机编队",
       "desc": "可搭载中型战机编队2",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 712,
     "option": ""
    }
   ]
  },
  "区域火控系统": {
   "weapons": [
    {
     "name": "CIT-1",
     "actions": [
      {
       "name": "搭载侦查无人机",
       "desc": "侦查无人机容量：3",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 796,
     "option": ""
    }
   ]
  },
  "附加装甲系统": {
   "weapons": [
    {
     "name": "ASX-100",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船生命值",
       "act": "比例加成",
       "value": 20,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "电磁装甲系统": {
   "weapons": [
    {
     "name": "AEX-120",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.2,
     "option": ""
    }
   ]
  },
  "重型防御装甲系统": {
   "weapons": [
    {
     "name": "ASX-130",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 250,
       "cond": ""
      },
      {
       "name": "闪避降低",
       "desc": "舰船闪避降低10%",
       "effect": "舰船闪避降低",
       "value": 10,
       "cond": ""
      },
      {
       "name": "命中率降低",
       "desc": "主武器命中率降低5%",
       "effect": "命中率降低",
       "act": "比例减少",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 250,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "ASX",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 180,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 180,
     "option": ""
    },
    {
     "name": "SC-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "突击轨道炮系统": {
   "weapons": [
    {
     "name": "SR-2600",
     "actions": [],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 700,
     "cycle": 2,
     "lockOn": 8,
     "rounds": 1,
     "cooldown": 16,
     "duration": 0,
     "option": "M1",
     "dpmShip": 10350,
     "dpmAA": 3360,
     "sysHP": 15750,
     "shield": 6
    }
   ]
  },
  "舰首炮台系统": {
   "weapons": [
    {
     "name": "SG-2400",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 200,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 2,
     "cooldown": 6,
     "duration": 2,
     "option": "M2*",
     "dpmShip": 11400,
     "dpmAA": 960,
     "sysHP": 15750,
     "shield": 1
    }
   ]
  },
  "大型火炮平台": {
   "weapons": [
    {
     "name": "MK4-SG-2580 \"Thunderbolt\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 280,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 16,
     "duration": 0,
     "option": "A1",
     "dpmShip": 6075,
     "dpmAA": 1134,
     "sysHP": 15750,
     "shield": 1
    },
    {
     "name": "SG-1120",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "A1",
     "dpmShip": 1800,
     "dpmAA": 215,
     "dpmSiege": 72,
     "sysHP": 15750,
     "shield": 3
    }
   ]
  },
  "轨道炮塔阵列": {
   "weapons": [
    {
     "name": "SR-1425",
     "actions": [],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 450,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 8,
     "duration": 0,
     "option": "A2*",
     "dpmShip": 9900,
     "dpmAA": 1923,
     "sysHP": 15750,
     "shield": 4
    }
   ]
  },
  "脉冲炮塔阵列": {
   "weapons": [
    {
     "name": "SP-430",
     "actions": [],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 250,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 6,
     "duration": 0,
     "option": "A3*",
     "dpmShip": 7500,
     "dpmAA": 787,
     "dpmSiege": 1200,
     "sysHP": 15750,
     "shield": 3
    }
   ]
  },
  "综合投射武器平台": {
   "weapons": [
    {
     "name": "K-ST-12-255A",
     "actions": [],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 300,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 4,
     "cooldown": 30,
     "duration": 4,
     "option": "B1*",
     "dpmShip": 8188,
     "dpmAA": 1185,
     "sysHP": 15750,
     "shield": 4
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-600",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-600",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-660",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-4500",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "乌拉诺斯之矛级·重型": {
  "堡垒炮台系统": {
   "weapons": [
    {
     "name": "BG-340B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 3,
     "cooldown": 3,
     "duration": 3,
     "option": "A3*",
     "dpmShip": 120,
     "dpmAA": 215,
     "sysHP": 19800,
     "shield": 1
    },
    {
     "name": "BG-1850",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 950,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 12,
     "duration": 0,
     "option": "A1",
     "dpmShip": 9400,
     "dpmAA": 2755,
     "sysHP": 19800,
     "shield": 6
    },
    {
     "name": "BG-2240",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 100,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 9,
     "duration": 0,
     "option": "A1",
     "dpmShip": 3600,
     "dpmAA": 420,
     "dpmSiege": 320,
     "sysHP": 19800,
     "shield": 3
    },
    {
     "name": "BG-1950",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 1200,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 18,
     "duration": 0,
     "option": "A2*",
     "dpmShip": 15866,
     "dpmAA": 2880,
     "sysHP": 19800,
     "shield": 6
    },
    {
     "name": "BG-2350",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 200,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 8,
     "duration": 0,
     "option": "A3*",
     "dpmShip": 17100,
     "dpmAA": 810,
     "dpmSiege": 1800,
     "sysHP": 19800,
     "shield": 3
    }
   ]
  },
  "矿车投射发射阵列": {
   "weapons": [
    {
     "name": "BM-12x250",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 120,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 12,
     "cooldown": 28,
     "duration": 12,
     "option": "B1*",
     "dpmShip": 5940,
     "dpmAA": 680,
     "dpmSiege": 259,
     "sysHP": 19800,
     "shield": 1
    }
   ]
  },
  "护航艇舱": {
   "weapons": [
    {
     "name": "CBC-2300",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：3",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 3,
       "cond": ""
      }
     ],
     "shield": 632,
     "option": ""
    }
   ]
  },
  "综合损害管制系统": {
   "weapons": [
    {
     "name": "CRT-3",
     "actions": [
      {
       "name": "搭载维修无人机",
       "desc": "维修无人机容量：2",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 717,
     "option": ""
    }
   ]
  },
  "分布式武器控制系统": {
   "weapons": [
    {
     "name": "XI-1200",
     "actions": [
      {
       "name": "命中率提升",
       "desc": "舰船所有武器命中率提升5%",
       "effect": "命中率提升",
       "act": "比例加成",
       "value": 5,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "附加装甲系统": {
   "weapons": [
    {
     "name": "ASX-150",
     "actions": [
      {
       "name": "附加生命自动维修",
       "desc": "每场战斗后自动维修附加生命值的损伤部分",
       "effect": "舰船生命值",
       "act": "比例加成",
       "value": 18,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "战后生命恢复",
       "value": 100,
       "cond": ""
      }
     ],
     "shield": 0.05,
     "armor": 240,
     "option": ""
    }
   ]
  },
  "反导系统": {
   "weapons": [
    {
     "name": "BG-625C",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 4,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 4,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 6,
     "cooldown": 4,
     "duration": 3,
     "option": "C3*",
     "dpmShip": 324,
     "sysHP": 19800,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "ASX-150",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 240,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ]
    },
    {
     "name": "SC-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "舰首轨道炮系统": {
   "weapons": [
    {
     "name": "BR-1950C \"Ruby\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 2600,
     "cycle": 1,
     "lockOn": 7,
     "rounds": 1,
     "cooldown": 12,
     "duration": 0,
     "option": "M1",
     "dpmShip": 12950,
     "dpmAA": 11310,
     "sysHP": 19800,
     "shield": 6
    }
   ]
  },
  "离子炮塔系统": {
   "weapons": [
    {
     "name": "BI-850",
     "actions": [],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 750,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 3,
     "cooldown": 15,
     "duration": 6,
     "option": "M2*",
     "dpmShip": 12857,
     "dpmAA": 1800,
     "sysHP": 19800,
     "shield": 4
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-600",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-600",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-660",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-4500",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "CV3000级·高速型": {
  "综合机库": {
   "weapons": [
    {
     "name": "CFB-605",
     "actions": [
      {
       "name": "搭载大型战机编队",
       "desc": "可搭载大型战机编队：5",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 5,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1097,
     "option": ""
    },
    {
     "name": "CBC-2100",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：3",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 3,
       "cond": ""
      }
     ],
     "shield": 632,
     "option": ""
    }
   ]
  },
  "综合舰载机系统": {
   "weapons": [
    {
     "name": "CFB-605",
     "actions": [
      {
       "name": "搭载大型战机编队",
       "desc": "可搭载大型战机编队：5",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 5,
       "cond": "战机类型",
       "condValue": null
      }
     ]
    },
    {
     "name": "CIT-5",
     "actions": [
      {
       "name": "搭载战术无人机",
       "desc": "战术无人机容量：5",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 5,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmAA": 150,
     "sysHP": 23850,
     "shield": 1103,
     "option": ""
    }
   ]
  },
  "大型舰载机系统": {
   "weapons": [
    {
     "name": "CFB-605",
     "actions": [
      {
       "name": "搭载大型战机编队",
       "desc": "可搭载大型战机编队：5",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 5,
       "cond": "战机类型",
       "condValue": null
      }
     ]
    },
    {
     "name": "CFB-400",
     "actions": [
      {
       "name": "搭载大型战机编队",
       "desc": "可搭载大型战机编队：3",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1108,
     "option": ""
    }
   ]
  },
  "防空导弹平台": {
   "weapons": [
    {
     "name": "BM-12x180T",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 50,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 12,
     "cooldown": 20,
     "duration": 12,
     "option": "A2*",
     "dpmShip": 2700,
     "dpmAA": 354,
     "sysHP": 25200,
     "shield": 1
    }
   ]
  },
  "导弹防御系统": {
   "weapons": [
    {
     "name": "MK3-SM-6x400B/C \"Starfire\"",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 15,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 15,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 70,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 6,
     "cooldown": 12,
     "duration": 6,
     "option": "B1*",
     "dpmShip": 1200,
     "dpmAA": 210,
     "dpmSiege": 70,
     "sysHP": 25200,
     "shield": 1
    }
   ]
  },
  "护航艇搭载系统": {
   "weapons": [
    {
     "name": "CBC-2100",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：3",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 3,
       "cond": ""
      }
     ]
    }
   ]
  },
  "信息无人机支援平台": {
   "weapons": [
    {
     "name": "CITA-2",
     "actions": [
      {
       "name": "搭载信息无人机",
       "desc": "信息无人机容量：3",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 1127,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-100",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 120,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 15,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ],
     "shield": 0.15,
     "armor": 120,
     "option": ""
    },
    {
     "name": "SC-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "龙骑兵炮台系统": {
   "weapons": [
    {
     "name": "MK4-C/SG-3480A \"Dragoon\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 200,
     "cycle": 3,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 9,
     "duration": 0,
     "option": "A1",
     "dpmShip": 3800,
     "dpmAA": 520,
     "sysHP": 25200,
     "shield": 1
    },
    {
     "name": "C/SG-190B \"Dragoon\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 55,
     "cycle": 1,
     "lockOn": 6,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "A1",
     "dpmShip": 2700,
     "dpmAA": 297,
     "dpmSiege": 99,
     "sysHP": 25200,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-600",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-600",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-660",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-4500",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "南十字星元帅级·航空母舰型": {
  "白闪综合武备库": {
   "weapons": [
    {
     "name": "CG-1105B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+20",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 20,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "M2*",
     "dpmShip": 900,
     "dpmAA": 161,
     "dpmSiege": 90,
     "sysHP": 28800,
     "shield": 1
    },
    {
     "name": "CG-2220",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 120,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "M1",
     "dpmShip": 5280,
     "dpmAA": 691,
     "dpmSiege": 288,
     "sysHP": 28800,
     "shield": 3
    },
    {
     "name": "CI-600T",
     "actions": [],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 450,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 8,
     "cooldown": 12,
     "duration": 8,
     "option": "M1",
     "dpmShip": 10800,
     "dpmAA": 1620,
     "sysHP": 28800,
     "shield": 6
    },
    {
     "name": "CR-1650",
     "actions": [],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 1000,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 3,
     "cooldown": 8,
     "duration": 6,
     "option": "M2*",
     "dpmShip": 12728,
     "dpmAA": 2185,
     "sysHP": 28800,
     "shield": 4
    }
   ]
  },
  "综合机库": {
   "weapons": [
    {
     "name": "CFB-700",
     "actions": [
      {
       "name": "搭载大型战机编队",
       "desc": "可搭载大型战机编队：6",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 6,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1140,
     "option": ""
    }
   ]
  },
  "护航艇舱": {
   "weapons": [
    {
     "name": "CBC-3200",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：6",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 6,
       "cond": ""
      }
     ],
     "shield": 1143,
     "option": ""
    }
   ]
  },
  "附加舰载机系统": {
   "weapons": [
    {
     "name": "CBF-320",
     "actions": [
      {
       "name": "搭载中型战机编队",
       "desc": "可搭载中型战机编队4",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 4,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1146,
     "option": ""
    }
   ]
  },
  "侦察无人机系统": {
   "weapons": [
    {
     "name": "CIT-3",
     "actions": [
      {
       "name": "搭载侦查无人机",
       "desc": "侦查无人机容量：3",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 796,
     "option": ""
    }
   ]
  },
  "附加能量系统": {
   "weapons": [
    {
     "name": "RET-200",
     "actions": [
      {
       "name": "舰载机伤害提升",
       "desc": "搭载的安东尼奥斯舰载机主武器伤害提升15%",
       "effect": "伤害提升",
       "act": "比例加成",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "火控辅助校准系统": {
   "weapons": [
    {
     "name": "XGC-200",
     "actions": [
      {
       "name": "舰载机命中率提升",
       "desc": "搭载的安东尼奥斯舰载机主武器命中率提升15%",
       "effect": "命中率提升",
       "act": "比例加成",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-90",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 90,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 15,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ],
     "shield": 0.15,
     "armor": 90,
     "option": ""
    },
    {
     "name": "SC-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "导弹防御系统": {
   "weapons": [
    {
     "name": "MK2-CM-4x250A \"Storm\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 140,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 4,
     "cooldown": 20,
     "duration": 4,
     "option": "B2*",
     "dpmShip": 5200,
     "dpmAA": 504,
     "dpmSiege": 392,
     "sysHP": 28800,
     "shield": 3
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-600",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-600",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-660",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-4500",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "太阳鲸·武装战术型": {
  "攻城无人机系统": {
   "weapons": [
    {
     "name": "CST-6",
     "actions": [
      {
       "name": "搭载攻城无人机",
       "desc": "攻城无人机容量：4",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 4,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "sysHP": 24750,
     "shield": 1053,
     "option": ""
    }
   ]
  },
  "护航艇舱": {
   "weapons": [
    {
     "name": "CBC-3200",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：6",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 6,
       "cond": ""
      }
     ],
     "shield": 1143,
     "option": ""
    }
   ]
  },
  "大型舰载机系统": {
   "weapons": [
    {
     "name": "CFB-1200",
     "actions": [
      {
       "name": "搭载大型战机编队",
       "desc": "可搭载大型战机编队：8",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 8,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1161,
     "option": ""
    }
   ]
  },
  "舰船维护系统": {
   "weapons": [
    {
     "name": "BSY-5000",
     "actions": [
      {
       "name": "舰载机恢复",
       "desc": "返航至所有机库的舰载机恢复10%生命",
       "effect": "舰载机生命恢复",
       "value": 10,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "护航艇搭载平台": {
   "weapons": [
    {
     "name": "CBC-2000",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：3",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 3,
       "cond": ""
      }
     ],
     "shield": 632,
     "option": ""
    }
   ]
  },
  "机库": {
   "weapons": [
    {
     "name": "CFB-600",
     "actions": [
      {
       "name": "搭载大型战机编队",
       "desc": "可搭载大型战机编队：5",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 5,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1097,
     "option": ""
    }
   ]
  },
  "防空导弹平台": {
   "weapons": [
    {
     "name": "BM-12x180T",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+70",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 70,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 50,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 12,
     "cooldown": 5,
     "duration": 6,
     "option": "C3*",
     "dpmShip": 2618,
     "dpmAA": 1178,
     "sysHP": 27000,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-100",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 120,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 15,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ],
     "shield": 0.15,
     "armor": 120,
     "option": ""
    },
    {
     "name": "SC-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "综合武备库": {
   "weapons": [
    {
     "name": "MK3-BM-8x320 \"Lightning Field\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 220,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 8,
     "cooldown": 35,
     "duration": 8,
     "option": "A3*",
     "dpmShip": 4688,
     "dpmAA": 589,
     "dpmSiege": 294,
     "sysHP": 27000,
     "shield": 3
    },
    {
     "name": "BG-2450A",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 320,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 15,
     "duration": 0,
     "option": "A1",
     "dpmShip": 4960,
     "dpmAA": 665,
     "sysHP": 27000,
     "shield": 6
    }
   ]
  },
  "投射武器平台": {
   "weapons": [
    {
     "name": "MK5-BM-16x180 \"Lightning Field\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 120,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 16,
     "cooldown": 40,
     "duration": 12,
     "option": "A2*",
     "dpmShip": 4061,
     "dpmAA": 354,
     "sysHP": 27000,
     "shield": 1
    }
   ]
  },
  "综合火炮平台": {
   "weapons": [
    {
     "name": "BG-2180",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 80,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 8,
     "duration": 0,
     "option": "A3*",
     "dpmShip": 4200,
     "dpmAA": 431,
     "dpmSiege": 336,
     "sysHP": 27000,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-600",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-600",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-660",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-4500",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "CV-II003型·轻型": {
  "速射炮台系统": {
   "weapons": [
    {
     "name": "MK2-J/SG-2100 \"Thunderbolt\"",
     "actions": [
      {
       "name": "防空轻量弹药",
       "desc": "对舰载机切换轻量弹药换取机动性，单发伤害额外-45",
       "effect": "防空特种弹药",
       "act": "Base num del",
       "value": 45,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 55,
     "cycle": 2,
     "lockOn": 8,
     "rounds": 2,
     "cooldown": 6,
     "duration": 4,
     "option": "589",
     "dpmShip": 1080,
     "dpmAA": 792,
     "dpmSiege": 250,
     "sysHP": 1600,
     "shield": 4
    },
    {
     "name": "SG-330A/D",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 30,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 6,
     "duration": 3,
     "option": "0",
     "dpmShip": 800,
     "dpmAA": 168,
     "sysHP": 1600,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "CV-M011型·重型火炮型": {
  "防空炮台系统": {
   "weapons": [
    {
     "name": "MK1-J/SG-275D \"Thunderbolt\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 2,
     "lockOn": 8,
     "rounds": 2,
     "cooldown": 4,
     "duration": 1.5,
     "option": "589",
     "dpmShip": 87,
     "dpmAA": 837,
     "dpmSiege": 3400,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "火炮攻击系统": {
   "weapons": [
    {
     "name": "MK2.3-J/SG-1155D \"Thunderbolt\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 75,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 2,
     "cooldown": 3,
     "duration": 0.5,
     "option": "0",
     "dpmShip": 2228,
     "dpmAA": 282,
     "sysHP": 3400,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "CV-M011型·重型导弹型": {
  "防空炮台系统": {
   "weapons": [
    {
     "name": "MK1-J/SG-275D \"Thunderbolt\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 2,
     "lockOn": 8,
     "rounds": 2,
     "cooldown": 4,
     "duration": 1.5,
     "option": "589",
     "dpmShip": 87,
     "dpmAA": 837,
     "dpmSiege": 3400,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "突击导弹系统": {
   "weapons": [
    {
     "name": "MK1-JM-3x300A/D \"Starfire\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 80,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 6,
     "cooldown": 12,
     "duration": 12,
     "option": "0",
     "dpmShip": 2100,
     "dpmAA": 240,
     "sysHP": 3400,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "CV-M011型·高速导弹型": {
  "推进系统": {
   "weapons": [
    {
     "name": "EN-120",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "护航艇闪避提升：5%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 5,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "精准制导系统": {
   "weapons": [
    {
     "name": "MK2-HM-2x105B/D \"Starfire\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 65,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 6,
     "duration": 6,
     "option": "57",
     "dpmShip": 1100,
     "dpmAA": 624,
     "dpmSiege": 130,
     "sysHP": 3400,
     "shield": 1
    }
   ]
  },
  "反火炮系统": {
   "weapons": [
    {
     "name": "MK2-S/HG-150B/D \"Thunderbolt\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 8,
     "cooldown": 10,
     "duration": 8,
     "option": "589",
     "dpmShip": 106,
     "dpmAA": 383,
     "dpmSiege": 3400,
     "shield": 1
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "CV-T800型·脉冲型": {
  "机载武器系统": {
   "weapons": [
    {
     "name": "MK2-CP-170T/D \"Eye of Ptolemy\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 120,
     "cycle": 1,
     "lockOn": 10,
     "rounds": 2,
     "cooldown": 4,
     "duration": 2,
     "option": "1233",
     "dpmShip": 2400,
     "dpmAA": 1920,
     "dpmSiege": 48,
     "sysHP": 2450,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "蜂巢守卫者·重型鱼雷型": {
  "速射炮台系统": {
   "weapons": [
    {
     "name": "MK1-CG-628B/D \"Comet Tail\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+5",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 6,
     "cooldown": 4,
     "duration": 6,
     "option": "589",
     "dpmShip": 691,
     "dpmSiege": 3500,
     "shield": 1
    },
    {
     "name": "CG-1132D",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 65,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 660,
     "dpmAA": 468,
     "dpmSiege": 187,
     "sysHP": 3500,
     "shield": 4
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "态势感知系统": {
   "weapons": [
    {
     "name": "XI-3550",
     "actions": [
      {
       "name": "导弹命中规避",
       "desc": "被导弹命中的概率降低30%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 30,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "option": ""
    }
   ]
  },
  "鱼雷攻击系统": {
   "weapons": [
    {
     "name": "CT-4-450D \"Beehive\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 350,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 4,
     "cooldown": 16,
     "duration": 4,
     "option": "0",
     "dpmShip": 4080,
     "dpmAA": 1469,
     "sysHP": 3500,
     "shield": 3
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "星云追逐者·重型": {
  "机载武器系统": {
   "weapons": [
    {
     "name": "CG-288D",
     "actions": [
      {
       "name": "防空轻量弹药",
       "desc": "对舰载机切换轻量弹药换取机动性，单发伤害额外-45",
       "effect": "防空特种弹药",
       "act": "Base num del",
       "value": 45,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 50,
     "cycle": 2,
     "lockOn": 10,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 1920,
     "dpmAA": 1152,
     "dpmSiege": 336,
     "sysHP": 3250,
     "shield": 4
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "信息增强系统": {
   "weapons": [
    {
     "name": "XGA-600",
     "actions": [
      {
       "name": "命中率提升",
       "desc": "武器系统命中率提升30%",
       "effect": "命中率提升",
       "act": "比例加成",
       "value": 30,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "突击导弹系统": {
   "weapons": [
    {
     "name": "CM-4x120D",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 30,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 4,
     "cooldown": 6,
     "duration": 4,
     "option": "589",
     "dpmShip": 480,
     "dpmAA": 432,
     "dpmSiege": 252,
     "sysHP": 3250,
     "shield": 3
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "星云追逐者·脉冲型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "信息增强系统": {
   "weapons": [
    {
     "name": "XGA-600",
     "actions": [
      {
       "name": "命中率提升",
       "desc": "武器系统命中率提升30%",
       "effect": "命中率提升",
       "act": "比例加成",
       "value": 30,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "机载武器系统": {
   "weapons": [
    {
     "name": "CP-170T/D \"Eye of Ptolemy\"",
     "actions": [],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 160,
     "cycle": 1,
     "lockOn": 10,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 3200,
     "dpmAA": 1920,
     "dpmSiege": 64,
     "sysHP": 2700,
     "shield": 3
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "脉冲能量储存系统": {
   "weapons": [
    {
     "name": "RPT-650",
     "actions": [
      {
       "name": "脉冲炮伤害提升",
       "desc": "所有脉冲炮伤害提升15%",
       "effect": "伤害提升",
       "act": "比例加成",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  }
 },
 "RB7-13型·导弹型": {
  "突击导弹系统": {
   "weapons": [
    {
     "name": "BM-4x147D",
     "actions": [
      {
       "name": "防空轻量弹药",
       "desc": "对舰载机切换轻量弹药换取机动性，单发伤害额外-170",
       "effect": "防空特种弹药",
       "act": "Base num del",
       "value": 170,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 220,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 4,
     "cooldown": 12,
     "duration": 8,
     "option": "589",
     "dpmShip": 2520,
     "dpmAA": 1584,
     "dpmSiege": 184,
     "sysHP": 1550,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "S-列维9号·重型鱼雷艇": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ]
    }
   ]
  },
  "机载轰炸系统": {
   "weapons": [
    {
     "name": "Supernova-M -AT-3-210M Type",
     "actions": [],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 1180,
     "cycle": 1,
     "lockOn": 15,
     "rounds": 1,
     "cooldown": 4,
     "duration": 38,
     "option": "0"
    }
   ]
  }
 },
 "寂灭刺客·装甲型": {
  "高速推进系统": {
   "weapons": [
    {
     "name": "EN-120",
     "actions": [
      {
       "name": "对护卫舰命中率提升",
       "desc": "主武器对护卫舰命中率提升15%",
       "effect": "对单一类型武器命中率提升",
       "act": "比例加成",
       "value": 15,
       "cond": "目标舰船",
       "condValue": null
      },
      {
       "name": "对驱逐舰命中率提升",
       "desc": "主武器对驱逐舰命中率提升15%",
       "effect": "对单一类型武器命中率提升",
       "act": "比例加成",
       "value": 15,
       "cond": "目标舰船",
       "condValue": null
      },
      {
       "name": "目标选择加速",
       "desc": "主武器目标选择时间缩减35%",
       "effect": "目标选择时间缩减",
       "act": "比例减少",
       "value": 35,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "ASA-15",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 6,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 6,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "速射炮台系统": {
   "weapons": [
    {
     "name": "MK2-BG-2100A/D \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 50,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 2,
     "cooldown": 4,
     "duration": 4,
     "option": "0",
     "dpmShip": 1800,
     "dpmAA": 630,
     "sysHP": 1600,
     "shield": 1
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "虚灵·隐身导弹型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "ASA-35X",
     "actions": [
      {
       "name": "导弹命中规避",
       "desc": "被导弹命中的概率降低20%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 20,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "鱼雷命中规避",
       "desc": "被鱼雷命中的概率降低30%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 30,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "信息干扰系统": {
   "weapons": [
    {
     "name": "XSK-100",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升35%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 35,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "风暴MK0.1导弹系统": {
   "weapons": [
    {
     "name": "MKX-CM-2x168D \"Storm\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 120,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 2,
     "cooldown": 5,
     "duration": 4,
     "option": "0",
     "dpmShip": 2933,
     "dpmAA": 128,
     "sysHP": 2700,
     "shield": 1
    }
   ]
  },
  "速射炮台系统": {
   "weapons": [
    {
     "name": "CG-1132D",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 65,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 660,
     "dpmAA": 468,
     "dpmSiege": 187,
     "sysHP": 2700,
     "shield": 4
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "野火·鱼雷型": {
  "突击鱼雷系统": {
   "weapons": [
    {
     "name": "BT-2x140D",
     "actions": [
      {
       "name": "暴击",
       "desc": "有15%概率对目标额外造成320%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 320,
       "cond": "概率",
       "condValue": 0.15
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 240,
     "cycle": 1,
     "lockOn": 12,
     "rounds": 2,
     "cooldown": 15,
     "duration": 16,
     "option": "1",
     "dpmShip": 1780,
     "dpmAA": 483,
     "sysHP": 1600,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "CE-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-90",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-200",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "CAS066级·载机型": {
  "护航艇维护系统": {
   "weapons": [
    {
     "name": "CBC-2000",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：2",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 891,
     "option": ""
    }
   ]
  },
  "标准综合炮台系统": {
   "weapons": [
    {
     "name": "SG-1120B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1800,
     "dpmAA": 431,
     "dpmSiege": 72,
     "sysHP": 12250,
     "shield": 1
    },
    {
     "name": "MK4-SG-2550 \"Thunderbolt\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 300,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 16,
     "duration": 0,
     "option": "0",
     "dpmShip": 2175,
     "dpmAA": 652,
     "sysHP": 12250,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "CAS066级·炮击型": {
  "防御炮台系统": {
   "weapons": [
    {
     "name": "SG-1120B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1350,
     "dpmAA": 378,
     "dpmSiege": 53,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "长臂轨道炮系统": {
   "weapons": [
    {
     "name": "B/SR-1680 \"Longhorn\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 1500,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 1,
     "cooldown": 13,
     "duration": 0,
     "option": "0",
     "dpmShip": 13753,
     "dpmAA": 6369,
     "sysHP": 13500,
     "shield": 6
    },
    {
     "name": "RRT-650",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "CAS066级·辅助型": {
  "无人机维护系统": {
   "weapons": [
    {
     "name": "CRT-6",
     "actions": [
      {
       "name": "搭载维修无人机",
       "desc": "维修无人机容量：3",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 1320,
     "option": ""
    }
   ]
  },
  "标准综合炮台系统": {
   "weapons": [
    {
     "name": "SG-1120B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1800,
     "dpmAA": 431,
     "dpmSiege": 72,
     "sysHP": 12250,
     "shield": 1
    },
    {
     "name": "MK4-SG-2550 \"Thunderbolt\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 300,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 16,
     "duration": 0,
     "option": "0",
     "dpmShip": 2175,
     "dpmAA": 652,
     "sysHP": 12250,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "CAS066级·通用型": {
  "重型鱼雷发射系统": {
   "weapons": [
    {
     "name": "ST-8-610",
     "actions": [
      {
       "name": "暴击",
       "desc": "有10%概率对目标额外造成200%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 200,
       "cond": "概率",
       "condValue": 0.1
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 420,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 8,
     "cooldown": 35,
     "duration": 8,
     "option": "1",
     "dpmShip": 4576,
     "dpmAA": 1922,
     "sysHP": 13500,
     "shield": 4
    }
   ]
  },
  "标准综合炮台系统": {
   "weapons": [
    {
     "name": "SG-1120B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1800,
     "dpmAA": 431,
     "dpmSiege": 72,
     "sysHP": 13500,
     "shield": 1
    },
    {
     "name": "MK4-SG-2550 \"Thunderbolt\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 300,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 16,
     "duration": 0,
     "option": "0",
     "dpmShip": 4350,
     "dpmAA": 1305,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "卡利斯托·集束鱼雷突击型": {
  "永恒北极星大型投射发射系统": {
   "weapons": [
    {
     "name": "MK2-AT-8-700 \"Supernova – White K\"",
     "actions": [
      {
       "name": "暴击",
       "desc": "有15%概率对目标额外造成170%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 170,
       "cond": "概率",
       "condValue": 0.15
      },
      {
       "name": "防空轻量弹药",
       "desc": "对舰载机切换轻量弹药换取机动性，单发伤害额外-335",
       "effect": "防空特种弹药",
       "act": "Base num del",
       "value": 335,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 350,
     "cycle": 4,
     "lockOn": 5,
     "rounds": 8,
     "cooldown": 32,
     "duration": 16,
     "option": "589",
     "dpmShip": 13600,
     "dpmAA": 2100,
     "dpmSiege": 3920,
     "sysHP": 13500,
     "shield": 5
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-55",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 40,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "AG-1120B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 750,
     "dpmAA": 126,
     "dpmSiege": 63,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RII-530",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "卡利斯托·重型鱼雷突击型": {
  "永恒北极星大型投射发射系统": {
   "weapons": [
    {
     "name": "MK2-AT-8-820A \"Supernova – White K\"",
     "actions": [
      {
       "name": "暴击",
       "desc": "有15%概率对目标额外造成170%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 170,
       "cond": "概率",
       "condValue": 0.15
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 1600,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 8,
     "cooldown": 28,
     "duration": 16,
     "option": "1",
     "dpmShip": 17345,
     "dpmAA": 3665,
     "sysHP": 13950,
     "shield": 6
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-55",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 40,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "AG-1120B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 750,
     "dpmAA": 126,
     "dpmSiege": 63,
     "sysHP": 13950,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RII-530",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "卡利斯托·重型无人机型": {
  "永恒北极星大型投射发射系统": {
   "weapons": [
    {
     "name": "MK2-AT-4-700 \"Supernova – White K\"",
     "actions": [
      {
       "name": "暴击",
       "desc": "有15%概率对目标额外造成170%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 170,
       "cond": "概率",
       "condValue": 0.15
      },
      {
       "name": "防空轻量弹药",
       "desc": "对舰载机切换轻量弹药换取机动性，单发伤害额外-335",
       "effect": "防空特种弹药",
       "act": "Base num del",
       "value": 335,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 350,
     "cycle": 4,
     "lockOn": 5,
     "rounds": 4,
     "cooldown": 26,
     "duration": 6,
     "option": "589",
     "dpmShip": 10200,
     "dpmAA": 1575,
     "dpmSiege": 2940,
     "sysHP": 14400,
     "shield": 5
    }
   ]
  },
  "防空无人机系统": {
   "weapons": [
    {
     "name": "CAT-3",
     "actions": [
      {
       "name": "搭载区域防空无人机",
       "desc": "近防无人机容量：2",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "sysHP": 15750,
     "shield": 1299,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-55",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 40,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "AG-1120B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 750,
     "dpmAA": 126,
     "dpmSiege": 63,
     "sysHP": 14400,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RII-530",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "奇美拉级·火炮型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AS-110",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 80,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ],
     "shield": 80,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "堡垒火炮系统SP": {
   "weapons": [
    {
     "name": "MK3-BG-2330A \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 350,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 16,
     "duration": 0,
     "option": "0",
     "dpmShip": 7650,
     "dpmAA": 1102,
     "sysHP": 14400,
     "shield": 1
    },
    {
     "name": "BG-290B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 2,
     "cooldown": 5,
     "duration": 1,
     "option": "589",
     "dpmShip": 1200,
     "dpmAA": 180,
     "dpmSiege": 80,
     "sysHP": 14400,
     "shield": 1
    },
    {
     "name": "MK3-BG-2500A \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 450,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 12,
     "duration": 0,
     "option": "0",
     "dpmShip": 8800,
     "dpmAA": 2160,
     "sysHP": 14400,
     "shield": 6
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "奇美拉级·防御型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AS-110",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 80,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ],
     "shield": 80,
     "option": ""
    },
    {
     "name": "ASM-160X",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "暴击伤害降低",
       "desc": "舰船受到的暴击伤害降低40%",
       "effect": "受到暴击伤害降低",
       "act": "比例减少",
       "value": 40,
       "cond": ""
      },
      {
       "name": "主系统暴击伤害降低",
       "desc": "主武器系统受到的暴击伤害降低40%",
       "effect": "系统受到暴击伤害降低",
       "act": "比例减少",
       "value": 40,
       "cond": ""
      }
     ],
     "shield": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "综合武备库": {
   "weapons": [
    {
     "name": "MK3-BG-2330A \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 350,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 16,
     "duration": 0,
     "option": "0",
     "dpmShip": 7650,
     "dpmAA": 1102,
     "sysHP": 16200,
     "shield": 1
    },
    {
     "name": "BT-270C",
     "actions": [],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 180,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 2,
     "cooldown": 15,
     "duration": 10,
     "option": "0",
     "dpmShip": 3264,
     "dpmAA": 1313,
     "sysHP": 16200,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "奇美拉级·重型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AS-110",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 80,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 25,
       "cond": ""
      }
     ],
     "shield": 80,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "堡垒炮台系统": {
   "weapons": [
    {
     "name": "BG-290B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 2,
     "cooldown": 5,
     "duration": 1,
     "option": "589",
     "dpmShip": 1200,
     "dpmAA": 180,
     "dpmSiege": 80,
     "sysHP": 14400,
     "shield": 1
    },
    {
     "name": "MK3-BG-2330A \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 350,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 16,
     "duration": 0,
     "option": "0",
     "dpmShip": 7650,
     "dpmAA": 1102,
     "sysHP": 14400,
     "shield": 1
    }
   ]
  },
  "突击导弹系统": {
   "weapons": [
    {
     "name": "MK5-BM-12x350A \"Lightning Field\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 280,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 12,
     "cooldown": 22,
     "duration": 12,
     "option": "0",
     "dpmShip": 5717,
     "dpmAA": 711,
     "sysHP": 14400,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "康纳马拉混沌级·高速等离子型": {
  "防空系统": {
   "weapons": [
    {
     "name": "AM-4x60B",
     "actions": [
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-15%",
       "effect": "防空冷却缩减",
       "value": 15,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-10%",
       "effect": "防空攻击持续时间缩减",
       "value": 10,
       "cond": ""
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+60",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 60,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 20,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 4,
     "cooldown": 6,
     "duration": 4,
     "option": "589",
     "dpmShip": 480,
     "dpmAA": 460,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-50",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 30,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "附加推进系统": {
   "weapons": [
    {
     "name": "EN-300B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升15%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "舰首等离子投射器": {
   "weapons": [
    {
     "name": "AIM-1200T",
     "actions": [],
     "type": "能量",
     "weaponType": "等离子武器",
     "damage": 1200,
     "cycle": 1,
     "lockOn": 6,
     "rounds": 3,
     "cooldown": 10,
     "duration": 18,
     "option": "0",
     "dpmShip": 15428,
     "dpmAA": 2622,
     "sysHP": 13500,
     "shield": 6
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "康纳马拉混沌级·轨道炮型": {
  "防空系统": {
   "weapons": [
    {
     "name": "AM-4x60B",
     "actions": [
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-15%",
       "effect": "防空冷却缩减",
       "value": 15,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-10%",
       "effect": "防空攻击持续时间缩减",
       "value": 10,
       "cond": ""
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+60",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 60,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 20,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 4,
     "cooldown": 6,
     "duration": 4,
     "option": "589",
     "dpmShip": 480,
     "dpmAA": 460,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-50",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 30,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "附加推进系统": {
   "weapons": [
    {
     "name": "EN-300B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升15%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "舰首轨道炮系统": {
   "weapons": [
    {
     "name": "AR-2500C",
     "actions": [],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 1200,
     "cycle": 2,
     "lockOn": 8,
     "rounds": 1,
     "cooldown": 12,
     "duration": 0,
     "option": "0",
     "dpmShip": 11900,
     "dpmAA": 1320,
     "sysHP": 13500,
     "shield": 6
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "破袭者级·载机运输型": {
  "舰载机系统": {
   "weapons": [
    {
     "name": "CBF-310",
     "actions": [
      {
       "name": "搭载中型战机编队",
       "desc": "可搭载中型战机编队3",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1359,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "防御炮台系统": {
   "weapons": [
    {
     "name": "FG-2283",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 3,
     "cooldown": 6,
     "duration": 3,
     "option": "589",
     "dpmShip": 2400,
     "dpmAA": 383,
     "dpmSiege": 256,
     "sysHP": 7200,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "破袭者级·武装运输型": {
  "仓储系统": {
   "weapons": [
    {
     "name": "W-120",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "仓储容量",
       "act": "基础数值增加",
       "value": 8000,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "防御炮台系统": {
   "weapons": [
    {
     "name": "FG-2283",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 3,
     "cooldown": 6,
     "duration": 3,
     "option": "589",
     "dpmShip": 2400,
     "dpmAA": 383,
     "dpmSiege": 256,
     "sysHP": 7200,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "艾奥级·突击离子炮型": {
  "附加推进系统": {
   "weapons": [
    {
     "name": "EN-350",
     "actions": [
      {
       "name": "命中率提升",
       "desc": "主武器命中率提升5%",
       "effect": "命中率提升",
       "act": "比例加成",
       "value": 5,
       "cond": ""
      },
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升15%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "维京离子炮系统": {
   "weapons": [
    {
     "name": "MK2-AI-2x720 \"Viggen\"",
     "actions": [],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 600,
     "cycle": 2,
     "lockOn": 8,
     "rounds": 4,
     "cooldown": 12,
     "duration": 8,
     "option": "0",
     "dpmShip": 14400,
     "dpmAA": 3456,
     "sysHP": 11700,
     "shield": 6
    }
   ]
  },
  "综合炮台系统": {
   "weapons": [
    {
     "name": "AG-1120B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1500,
     "dpmAA": 189,
     "dpmSiege": 126,
     "sysHP": 11700,
     "shield": 1
    }
   ]
  },
  "通用导弹发射系统": {
   "weapons": [
    {
     "name": "AM-8x150A",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 100,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 8,
     "cooldown": 20,
     "duration": 8,
     "option": "0",
     "dpmShip": 3085,
     "dpmAA": 171,
     "sysHP": 11700,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RIT-580",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "艾奥级·高速离子炮型": {
  "附加推进系统": {
   "weapons": [
    {
     "name": "EN-350",
     "actions": [
      {
       "name": "命中率提升",
       "desc": "主武器命中率提升5%",
       "effect": "命中率提升",
       "act": "比例加成",
       "value": 5,
       "cond": ""
      },
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升15%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "维京离子炮系统": {
   "weapons": [
    {
     "name": "MK2-AI-420T \"Viggen\"",
     "actions": [],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 340,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 2,
     "cooldown": 1,
     "duration": 4,
     "option": "0",
     "dpmShip": 8160,
     "dpmAA": 652,
     "sysHP": 11700,
     "shield": 4
    }
   ]
  },
  "综合炮台系统": {
   "weapons": [
    {
     "name": "AG-1120B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1500,
     "dpmAA": 189,
     "dpmSiege": 126,
     "sysHP": 11700,
     "shield": 1
    }
   ]
  },
  "反舰导弹发射系统": {
   "weapons": [
    {
     "name": "AM-2x320A",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 350,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 2,
     "cooldown": 13,
     "duration": 2,
     "option": "0",
     "dpmShip": 5440,
     "dpmAA": 168,
     "sysHP": 11700,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RIT-580",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "艾奥级·攻城离子炮型": {
  "附加推进系统": {
   "weapons": [
    {
     "name": "EN-350",
     "actions": [
      {
       "name": "命中率提升",
       "desc": "主武器命中率提升5%",
       "effect": "命中率提升",
       "act": "比例加成",
       "value": 5,
       "cond": ""
      },
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升15%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "维京离子炮系统": {
   "weapons": [
    {
     "name": "MK2-AI-820C \"Viggen\"",
     "actions": [],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 670,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 5,
     "cooldown": 6,
     "duration": 10,
     "option": "0",
     "dpmShip": 12562,
     "dpmAA": 11808,
     "sysHP": 11700,
     "shield": 6
    }
   ]
  },
  "防御炮台系统": {
   "weapons": [
    {
     "name": "AG-680B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 5,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 6,
     "cooldown": 4,
     "duration": 3,
     "option": "589",
     "dpmShip": 92,
     "sysHP": 11700,
     "shield": 1
    }
   ]
  },
  "通用导弹发射系统": {
   "weapons": [
    {
     "name": "AM-8x150A",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 100,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 8,
     "cooldown": 20,
     "duration": 8,
     "option": "0",
     "dpmShip": 3085,
     "dpmAA": 171,
     "sysHP": 11700,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RIT-580",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "猎兵级·重型载机型": {
  "综合炮台系统": {
   "weapons": [
    {
     "name": "CG-1105B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+20",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 20,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 600,
     "dpmAA": 215,
     "dpmSiege": 60,
     "sysHP": 12600,
     "shield": 1
    },
    {
     "name": "CG-1240",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 100,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 2,
     "cooldown": 9,
     "duration": 0,
     "option": "589",
     "dpmShip": 2400,
     "dpmAA": 320,
     "dpmSiege": 213,
     "sysHP": 12600,
     "shield": 3
    }
   ]
  },
  "护航艇搭载系统": {
   "weapons": [
    {
     "name": "CBC-2600",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：4",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 4,
       "cond": ""
      }
     ],
     "shield": 1394,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "猎兵级·重型火炮型": {
  "综合炮台系统": {
   "weapons": [
    {
     "name": "CG-1105B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+20",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 20,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 600,
     "dpmAA": 215,
     "dpmSiege": 60,
     "sysHP": 14400,
     "shield": 1
    },
    {
     "name": "CG-1240",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 100,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 2,
     "cooldown": 9,
     "duration": 0,
     "option": "589",
     "dpmShip": 2400,
     "dpmAA": 320,
     "dpmSiege": 213,
     "sysHP": 14400,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "舰首武器系统": {
   "weapons": [
    {
     "name": "CG-2210 \"Carilion K\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 300,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 14,
     "duration": 0,
     "option": "0",
     "dpmShip": 4971,
     "dpmAA": 874,
     "sysHP": 14400,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "KCCPV2.0·轻型载机型": {
  "舰载机搭载系统": {
   "weapons": [
    {
     "name": "CFB-600",
     "actions": [
      {
       "name": "搭载大型战机编队",
       "desc": "可搭载大型战机编队：2",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 627,
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "SG-1120B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 900,
     "dpmAA": 288,
     "dpmSiege": 36,
     "sysHP": 9000,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用投射武器平台": {
   "weapons": [
    {
     "name": "KCCPV-SM-16x450",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 250,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 16,
     "cooldown": 40,
     "duration": 16,
     "option": "589",
     "dpmShip": 4114,
     "dpmAA": 642,
     "dpmSiege": 428,
     "sysHP": 9000,
     "shield": 3
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "KCCPV2.0·轻型攻击型": {
  "通用炮台系统": {
   "weapons": [
    {
     "name": "SG-1120B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1350,
     "dpmAA": 378,
     "dpmSiege": 53,
     "sysHP": 9900,
     "shield": 1
    },
    {
     "name": "SG-1120C",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 30,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 400,
     "dpmAA": 90,
     "dpmSiege": 30,
     "sysHP": 9900,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "综合投射武器系统": {
   "weapons": [
    {
     "name": "KCCPV-SM-16x450",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 250,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 16,
     "cooldown": 40,
     "duration": 16,
     "option": "589",
     "dpmShip": 4114,
     "dpmAA": 642,
     "dpmSiege": 428,
     "sysHP": 9900,
     "shield": 3
    },
    {
     "name": "KCCPV-ST-3-700C",
     "actions": [],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 420,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 3,
     "cooldown": 20,
     "duration": 6,
     "option": "0",
     "dpmShip": 2838,
     "dpmAA": 1453,
     "sysHP": 9900,
     "shield": 6
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "KCCPV2.0·轻型脉冲攻击型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "SG-1120B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1350,
     "dpmAA": 378,
     "dpmSiege": 53,
     "sysHP": 10800,
     "shield": 1
    }
   ]
  },
  "速射脉冲炮系统": {
   "weapons": [
    {
     "name": "C/SP-430",
     "actions": [],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 300,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "0",
     "dpmShip": 3600,
     "dpmAA": 252,
     "sysHP": 10800,
     "shield": 1
    },
    {
     "name": "RPT-550",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用投射武器平台": {
   "weapons": [
    {
     "name": "KCCPV-SM-16x450",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 250,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 16,
     "cooldown": 40,
     "duration": 16,
     "option": "589",
     "dpmShip": 4114,
     "dpmAA": 642,
     "dpmSiege": 428,
     "sysHP": 10800,
     "shield": 3
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "KCCPV2.0·轻型轨道炮型": {
  "通用炮台系统": {
   "weapons": [
    {
     "name": "SG-1120B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1350,
     "dpmAA": 378,
     "dpmSiege": 53,
     "sysHP": 10800,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "舰首炮台系统": {
   "weapons": [
    {
     "name": "KCCPV-SR-1700",
     "actions": [],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 700,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 20,
     "duration": 0,
     "option": "0",
     "dpmShip": 4140,
     "dpmAA": 3150,
     "sysHP": 10800,
     "shield": 6
    }
   ]
  },
  "通用投射武器平台": {
   "weapons": [
    {
     "name": "KCCPV-SM-16x450",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 250,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 16,
     "cooldown": 40,
     "duration": 16,
     "option": "589",
     "dpmShip": 4114,
     "dpmAA": 642,
     "dpmSiege": 428,
     "sysHP": 10800,
     "shield": 3
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "光锥级·区域防空型": {
  "矿车投射发射阵列": {
   "weapons": [
    {
     "name": "BM-1x180B",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 4,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 4,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+85",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 85,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 2,
     "duration": 0,
     "option": "734",
     "dpmShip": 900,
     "sysHP": 13500,
     "shield": 1
    },
    {
     "name": "BM-8x400A",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 280,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 8,
     "cooldown": 24,
     "duration": 8,
     "option": "0",
     "dpmShip": 4050,
     "dpmAA": 420,
     "sysHP": 13500,
     "shield": 1
    },
    {
     "name": "XAA-500",
     "actions": [],
     "option": ""
    }
   ]
  },
  "苔原拦截无人机系统": {
   "weapons": [
    {
     "name": "CAT-3",
     "actions": [
      {
       "name": "搭载区域防空无人机",
       "desc": "区域防空无人机容量：2",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "sysHP": 16200,
     "shield": 1422,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "预警系统": {
   "weapons": [
    {
     "name": "XI-5000",
     "actions": [
      {
       "name": "导弹命中规避",
       "desc": "被导弹命中的概率降低30%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 30,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "option": ""
    }
   ]
  },
  "防御炮台系统": {
   "weapons": [
    {
     "name": "BG-290B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "734",
     "dpmShip": 1800,
     "dpmAA": 270,
     "dpmSiege": 150,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "光锥级·多用途导弹型": {
  "苔原防空无人机系统": {
   "weapons": [
    {
     "name": "CAT-3",
     "actions": [
      {
       "name": "搭载区域防空无人机",
       "desc": "区域防空无人机容量：2",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "sysHP": 16200,
     "shield": 1422,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "预警系统": {
   "weapons": [
    {
     "name": "XI-5000",
     "actions": [
      {
       "name": "导弹命中规避",
       "desc": "被导弹命中的概率降低30%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 30,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "option": ""
    }
   ]
  },
  "矿车投射发射阵列": {
   "weapons": [
    {
     "name": "BM-8x400A",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 280,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 8,
     "cooldown": 24,
     "duration": 8,
     "option": "0",
     "dpmShip": 8100,
     "dpmAA": 840,
     "sysHP": 13500,
     "shield": 1
    },
    {
     "name": "BM-1x180A",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 160,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 7,
     "duration": 0,
     "option": "734",
     "dpmShip": 2571,
     "dpmAA": 329,
     "dpmSiege": 82,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "防御炮台系统": {
   "weapons": [
    {
     "name": "BG-290B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "734",
     "dpmShip": 1800,
     "dpmAA": 270,
     "dpmSiege": 150,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "光锥级·攻击导弹型": {
  "苔原支援无人机系统": {
   "weapons": [
    {
     "name": "CIT-1",
     "actions": [
      {
       "name": "搭载侦查无人机",
       "desc": "侦查无人机容量：1",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 1430,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "预警系统": {
   "weapons": [
    {
     "name": "XI-5000",
     "actions": [
      {
       "name": "导弹命中规避",
       "desc": "被导弹命中的概率降低30%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 30,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "option": ""
    }
   ]
  },
  "矿车投射发射阵列": {
   "weapons": [
    {
     "name": "BM-8x400A",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 280,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 8,
     "cooldown": 24,
     "duration": 8,
     "option": "0",
     "dpmShip": 12150,
     "dpmAA": 1260,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "BG-290B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "734",
     "dpmShip": 1350,
     "dpmAA": 236,
     "dpmSiege": 112,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "狩猎者级·载机型": {
  "防御炮台系统": {
   "weapons": [
    {
     "name": "CG-1105B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+20",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 20,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 600,
     "dpmAA": 215,
     "dpmSiege": 60,
     "sysHP": 12150,
     "shield": 1
    }
   ]
  },
  "舰载机搭载系统": {
   "weapons": [
    {
     "name": "CBF-300",
     "actions": [
      {
       "name": "搭载中型战机编队",
       "desc": "可搭载中型战机编队4",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 4,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1146,
     "option": ""
    },
    {
     "name": "XAC-2000",
     "actions": [],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "投射武器系统": {
   "weapons": [
    {
     "name": "CM-8x188A",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 65,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 8,
     "cooldown": 15,
     "duration": 6,
     "option": "589",
     "dpmShip": 2514,
     "dpmAA": 356,
     "dpmSiege": 59,
     "sysHP": 12150,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "狩猎者级·防空型": {
  "防空导弹系统": {
   "weapons": [
    {
     "name": "CM-8x100B",
     "actions": [
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-30%",
       "effect": "防空冷却缩减",
       "value": 30,
       "cond": ""
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+60",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 60,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-50%",
       "effect": "防空攻击持续时间缩减",
       "value": 50,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 8,
     "cooldown": 5,
     "duration": 6,
     "option": "589",
     "dpmShip": 1047,
     "sysHP": 12150,
     "shield": 1
    }
   ]
  },
  "防御炮台系统": {
   "weapons": [
    {
     "name": "CG-1105B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+20",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 20,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 600,
     "dpmAA": 215,
     "dpmSiege": 60,
     "sysHP": 12150,
     "shield": 1
    }
   ]
  },
  "舰载机搭载系统": {
   "weapons": [
    {
     "name": "CBF-300",
     "actions": [
      {
       "name": "搭载中型战机编队",
       "desc": "可搭载中型战机编队4",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 4,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1146,
     "option": ""
    },
    {
     "name": "XAC-2000",
     "actions": [],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "狩猎者级·战术载机型": {
  "信息指挥系统": {
   "weapons": [
    {
     "name": "CITA-4",
     "actions": [
      {
       "name": "搭载信息无人机",
       "desc": "信息无人机容量：3",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 1127,
     "option": ""
    }
   ]
  },
  "防御炮台系统": {
   "weapons": [
    {
     "name": "CG-1105B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+20",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 20,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 600,
     "dpmAA": 215,
     "dpmSiege": 60,
     "sysHP": 12150,
     "shield": 1
    }
   ]
  },
  "舰载机搭载系统": {
   "weapons": [
    {
     "name": "CBF-300",
     "actions": [
      {
       "name": "搭载中型战机编队",
       "desc": "可搭载中型战机编队4",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 4,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1146,
     "option": ""
    },
    {
     "name": "XAC-2000",
     "actions": [],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "星空巡游者·离子炮型": {
  "防空系统": {
   "weapons": [
    {
     "name": "XI-1200",
     "actions": [
      {
       "name": "对战机命中率提升",
       "desc": "武器系统对舰载机命中率提升15%",
       "effect": "对单一类型武器命中率提升",
       "act": "比例加成",
       "value": 15,
       "cond": "目标舰船",
       "condValue": null
      }
     ],
     "option": ""
    },
    {
     "name": "FG-363B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+60",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 60,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-15%",
       "effect": "防空冷却缩减",
       "value": 15,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-10%",
       "effect": "防空攻击持续时间缩减",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 6,
     "duration": 2,
     "option": "589",
     "dpmShip": 67,
     "dpmAA": 496,
     "sysHP": 10800,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "舰首离子炮系统": {
   "weapons": [
    {
     "name": "FI-750A",
     "actions": [],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 450,
     "cycle": 2,
     "lockOn": 7,
     "rounds": 3,
     "cooldown": 10,
     "duration": 6,
     "option": "0",
     "dpmShip": 10125,
     "dpmAA": 1721,
     "sysHP": 10800,
     "shield": 6
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "XT-20级·载机型": {
  "舰载机系统": {
   "weapons": [
    {
     "name": "CFB-640",
     "actions": [
      {
       "name": "搭载大型战机编队",
       "desc": "可搭载大型战机编队：4",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 4,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 1450,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "防御炮台系统": {
   "weapons": [
    {
     "name": "FG-2180",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 80,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 7,
     "duration": 0,
     "option": "589",
     "dpmShip": 3600,
     "dpmAA": 432,
     "dpmSiege": 288,
     "sysHP": 9250,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "XT-20级·辅助型": {
  "支援无人机系统": {
   "weapons": [
    {
     "name": "CRT-3",
     "actions": [
      {
       "name": "搭载维修无人机",
       "desc": "维修无人机容量：3",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "sysHP": 11950,
     "shield": 1320,
     "option": ""
    },
    {
     "name": "CRT-4",
     "actions": [
      {
       "name": "搭载防空无人机",
       "desc": "防空无人机容量：2",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "sysHP": 11950,
     "shield": 1455,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "防御炮台系统": {
   "weapons": [
    {
     "name": "FG-1180A",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 90,
     "cycle": 1,
     "lockOn": 10,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "0",
     "dpmShip": 2880,
     "dpmAA": 97,
     "sysHP": 9250,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "XT-20级·护卫型": {
  "机库": {
   "weapons": [
    {
     "name": "CBC-3000",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：4",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 4,
       "cond": ""
      }
     ],
     "shield": 1394,
     "option": ""
    }
   ]
  },
  "仓储系统": {
   "weapons": [
    {
     "name": "W-100",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "仓储容量",
       "act": "基础数值增加",
       "value": 1500,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-60",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      }
     ],
     "shield": 0.1,
     "armor": 50,
     "option": ""
    },
    {
     "name": "CL-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "防御炮台系统": {
   "weapons": [
    {
     "name": "FG-1180A",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 90,
     "cycle": 1,
     "lockOn": 10,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "0",
     "dpmShip": 2880,
     "dpmAA": 97,
     "sysHP": 9250,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-350",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-300",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-450",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-3000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "AC721·重型两用突击型": {
  "仓储系统": {
   "weapons": [
    {
     "name": "W-100",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "仓储容量",
       "act": "基础数值增加",
       "value": 1500,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "护航艇维护系统": {
   "weapons": [
    {
     "name": "CBC-2300",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：2",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 891,
     "option": ""
    },
    {
     "name": "XAC-600",
     "actions": [],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "721综合炮台系统": {
   "weapons": [
    {
     "name": "AC721-SG-2275C",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 6,
     "duration": 0,
     "option": "589",
     "dpmShip": 600,
     "dpmAA": 120,
     "dpmSiege": 136,
     "sysHP": 6500,
     "shield": 3
    },
    {
     "name": "SG-1120",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 30,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 600,
     "dpmAA": 107,
     "dpmSiege": 45,
     "sysHP": 6500,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "AC721·重型离子炮型": {
  "能量系统": {
   "weapons": [
    {
     "name": "RIT-330",
     "actions": [
      {
       "name": "离子炮伤害提升",
       "desc": "所有离子炮伤害提升15%",
       "effect": "伤害提升",
       "act": "比例加成",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "730离子炮攻击系统": {
   "weapons": [
    {
     "name": "SI-1x400",
     "actions": [
      {
       "name": "能量护盾穿透",
       "desc": "目标为5时，有机会使其能量护盾失效",
       "effect": "能量护盾穿透",
       "value": null,
       "cond": "概率",
       "condValue": 0.3
      }
     ],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 350,
     "cycle": 1,
     "lockOn": 6,
     "rounds": 3,
     "cooldown": 6,
     "duration": 6,
     "option": "0",
     "dpmShip": 5250,
     "dpmAA": 1155,
     "sysHP": 7900,
     "shield": 4
    }
   ]
  },
  "防空炮台系统": {
   "weapons": [
    {
     "name": "SG-330B/D",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+5",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 4,
     "duration": 3,
     "option": "589",
     "dpmShip": 92,
     "dpmSiege": 7900,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "AC721·重型后勤型": {
  "721综合炮台系统": {
   "weapons": [
    {
     "name": "SG-330B/D",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+5",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 4,
     "duration": 3,
     "option": "589",
     "dpmShip": 138,
     "dpmSiege": 7200,
     "shield": 1
    },
    {
     "name": "AC721-SG-2275C",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 6,
     "duration": 0,
     "option": "589",
     "dpmShip": 1800,
     "dpmAA": 252,
     "dpmSiege": 408,
     "sysHP": 7200,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "仓储系统": {
   "weapons": [
    {
     "name": "W-100",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "仓储容量",
       "act": "基础数值增加",
       "value": 1500,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "AC721·重型导弹型": {
  "仓储系统": {
   "weapons": [
    {
     "name": "W-100",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "仓储容量",
       "act": "基础数值增加",
       "value": 1500,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "MK-200通用垂直发射系统": {
   "weapons": [
    {
     "name": "SM-4x40B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+70",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 70,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 4,
     "cooldown": 5,
     "duration": 4,
     "option": "734",
     "dpmShip": 672,
     "dpmSiege": 7200,
     "shield": 1
    },
    {
     "name": "SM-8x280",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 100,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 4,
     "cooldown": 8,
     "duration": 8,
     "option": "0",
     "dpmShip": 2700,
     "dpmAA": 300,
     "sysHP": 7200,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "720辅助炮台系统": {
   "weapons": [
    {
     "name": "SG-1120",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 30,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 600,
     "dpmAA": 107,
     "dpmSiege": 45,
     "sysHP": 7200,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "亚达伯拉级·重型突击型": {
  "堡垒炮台系统": {
   "weapons": [
    {
     "name": "BG-290B",
     "actions": [
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-40%",
       "effect": "防空冷却缩减",
       "value": 40,
       "cond": ""
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+50",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 2,
     "cooldown": 5,
     "duration": 1,
     "option": "589",
     "dpmShip": 600,
     "dpmAA": 360,
     "dpmSiege": 40,
     "sysHP": 8100,
     "shield": 1
    },
    {
     "name": "MK3-BG-2400C \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 400,
     "cycle": 2,
     "lockOn": 12,
     "rounds": 1,
     "cooldown": 30,
     "duration": 0,
     "option": "0",
     "dpmShip": 4680,
     "dpmAA": 1008,
     "sysHP": 8100,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-45",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 4,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.04,
     "armor": 30,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "强化装甲系统": {
   "weapons": [
    {
     "name": "ASX-30",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船生命值",
       "act": "比例加成",
       "value": 10,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 15,
       "cond": ""
      }
     ],
     "shield": 15,
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "亚达伯拉级·重型火炮型": {
  "堡垒炮台系统": {
   "weapons": [
    {
     "name": "BG-290B",
     "actions": [
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-40%",
       "effect": "防空冷却缩减",
       "value": 40,
       "cond": ""
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+50",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 2,
     "cooldown": 5,
     "duration": 1,
     "option": "589",
     "dpmShip": 600,
     "dpmAA": 360,
     "dpmSiege": 40,
     "sysHP": 8100,
     "shield": 1
    },
    {
     "name": "MK3-BG-2330A \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 350,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 16,
     "duration": 0,
     "option": "0",
     "dpmShip": 5100,
     "dpmAA": 735,
     "sysHP": 8100,
     "shield": 1
    }
   ]
  },
  "近防系统": {
   "weapons": [
    {
     "name": "BG-340B",
     "actions": [
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-30%",
       "effect": "防空冷却缩减",
       "value": 30,
       "cond": ""
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+20",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 3,
     "cooldown": 3,
     "duration": 3,
     "option": "589",
     "dpmShip": 120,
     "dpmAA": 324,
     "dpmSiege": 8100,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-45",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 4,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.04,
     "armor": 30,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "警惕级·战术型": {
  "舰载机维护与指挥系统": {
   "weapons": [
    {
     "name": "CBF-200",
     "actions": [
      {
       "name": "搭载中型战机编队",
       "desc": "可搭载中型战机编队1",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 787,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "近防系统": {
   "weapons": [
    {
     "name": "FG-1103B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 1000,
     "dpmAA": 168,
     "dpmSiege": 42,
     "sysHP": 7650,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "凛冽级·防御型": {
  "雷达探测系统": {
   "weapons": [
    {
     "name": "XI-1800",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "对空集火",
       "value": null,
       "cond": ""
      },
      {
       "name": "对战机命中率提升",
       "desc": "对战机命中率提升30%",
       "effect": "对单一类型武器命中率提升",
       "act": "比例加成",
       "value": 30,
       "cond": "目标舰船",
       "condValue": null
      },
      {
       "name": "对护航艇命中率提升",
       "desc": "对护航艇命中率提升30%",
       "effect": "对单一类型武器命中率提升",
       "act": "比例加成",
       "value": 30,
       "cond": "目标舰船",
       "condValue": null
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AS-72",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 0.05,
     "armor": 30,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "凛冽寒风火箭发射系统": {
   "weapons": [
    {
     "name": "FM-6x210-B/S \"Squall\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 100,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 6,
     "cooldown": 25,
     "duration": 4,
     "option": "734",
     "dpmShip": 2234,
     "dpmAA": 297,
     "dpmSiege": 49,
     "sysHP": 6750,
     "shield": 3
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "FG-280",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 20,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 5,
     "duration": 3,
     "option": "734",
     "dpmShip": 900,
     "dpmAA": 215,
     "dpmSiege": 53,
     "sysHP": 6750,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "凛冽级·导弹型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AS-72",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 0.05,
     "armor": 30,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "凛冽寒风火箭发射系统": {
   "weapons": [
    {
     "name": "FM-6x410 \"Squall\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 300,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 6,
     "cooldown": 35,
     "duration": 8,
     "option": "589",
     "dpmShip": 4855,
     "dpmAA": 602,
     "dpmSiege": 703,
     "sysHP": 6300,
     "shield": 3
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "FG-1103A",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 55,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1350,
     "dpmAA": 198,
     "dpmSiege": 49,
     "sysHP": 6300,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "谷神星级·载机型": {
  "舰载机维护与指挥系统": {
   "weapons": [
    {
     "name": "CBF-260",
     "actions": [
      {
       "name": "搭载中型战机编队",
       "desc": "可搭载中型战机编队2",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 712,
     "option": ""
    },
    {
     "name": "AR-300",
     "actions": [
      {
       "name": "舰载机恢复",
       "desc": "返航至机库的舰载机恢复10%生命",
       "effect": "舰载机生命恢复",
       "value": 10,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "XAC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "AG-1120",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 60,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1500,
     "dpmAA": 215,
     "dpmSiege": 252,
     "sysHP": 6550,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "谷神星级·支援型": {
  "战术无人机系统": {
   "weapons": [
    {
     "name": "CRT-3",
     "actions": [
      {
       "name": "搭载维修无人机",
       "desc": "维修无人机容量：2",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmSiege": 9000,
     "shield": 717,
     "option": ""
    },
    {
     "name": "CAT-3",
     "actions": [
      {
       "name": "搭载近防无人机",
       "desc": "近防无人机容量：1",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmSiege": 9000,
     "shield": 1535,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "AG-1120",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 60,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1500,
     "dpmAA": 215,
     "dpmSiege": 252,
     "sysHP": 6550,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "谷神星级·战术型": {
  "战术无人机系统": {
   "weapons": [
    {
     "name": "CIT-3",
     "actions": [
      {
       "name": "搭载监视无人机",
       "desc": "监视无人机容量：3",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 3,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 1537,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "AG-1120",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 60,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1500,
     "dpmAA": 215,
     "dpmSiege": 252,
     "sysHP": 6550,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "阋神星I级·装甲型": {
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升25%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 25,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    }
   ]
  },
  "阋神星通用炮台系统": {
   "weapons": [
    {
     "name": "AG-1156 \"Eris\"",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 3000,
     "dpmAA": 269,
     "dpmSiege": 320,
     "sysHP": 6300,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AS-72",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 0.05,
     "armor": 30,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "阋神星I级·重型火炮型": {
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升25%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 25,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "阋神星之烬重型火炮": {
   "weapons": [
    {
     "name": "AG-2300 \"Ashes of Eris\"",
     "actions": [
      {
       "name": "物理装甲穿透",
       "desc": "目标为5时，有机会使其物理装甲失效",
       "effect": "物理装甲失效",
       "value": null,
       "cond": "概率",
       "condValue": 0.3
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 300,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 11,
     "duration": 0,
     "option": "0",
     "dpmShip": 3163,
     "dpmAA": 1047,
     "sysHP": 6300,
     "shield": 1
    },
    {
     "name": "AG-1156 \"Eris\"",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 1800,
     "dpmAA": 252,
     "dpmSiege": 192,
     "sysHP": 6300,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "阋神星I级·轻型速射火炮型": {
  "阋神星联合炮台系统": {
   "weapons": [
    {
     "name": "AG-1156 \"Eris\"",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 3000,
     "dpmAA": 269,
     "dpmSiege": 320,
     "sysHP": 5850,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升25%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 25,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "卫士·两用突击型": {
  "风暴导弹系统": {
   "weapons": [
    {
     "name": "MK2-CM-8x200C \"Storm\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+80",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 80,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-30%",
       "effect": "防空冷却缩减",
       "value": 30,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-30%",
       "effect": "防空攻击持续时间缩减",
       "value": 30,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 80,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 8,
     "cooldown": 14,
     "duration": 8,
     "option": "734",
     "dpmShip": 3054,
     "dpmAA": 837,
     "dpmSiege": 349,
     "sysHP": 6650,
     "shield": 1
    }
   ]
  },
  "护航艇维护系统": {
   "weapons": [
    {
     "name": "CBC-1000",
     "actions": [
      {
       "name": "搭载护航艇",
       "desc": "护航艇容量：2",
       "effect": "搭载护航艇",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 891,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "卫士·实验脉冲突击型": {
  "脉冲能量系统": {
   "weapons": [
    {
     "name": "RPT-460 \"Star Codex\"",
     "actions": [
      {
       "name": "脉冲炮伤害提升",
       "desc": "所有脉冲炮伤害提升15%",
       "effect": "伤害提升",
       "act": "比例加成",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "星典脉冲炮系统": {
   "weapons": [
    {
     "name": "CP-508T \"Star Codex\"",
     "actions": [
      {
       "name": "能量护盾穿透",
       "desc": "目标为5时，有机会使其能量护盾失效",
       "effect": "能量护盾穿透",
       "value": null,
       "cond": "概率",
       "condValue": 0.3
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 300,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 6,
     "duration": 0,
     "option": "0",
     "dpmShip": 3000,
     "dpmAA": 300,
     "sysHP": 7300,
     "shield": 1
    },
    {
     "name": "CP-118T \"Star Codex\"",
     "actions": [],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 60,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 6,
     "duration": 0,
     "option": "589",
     "dpmShip": 2400,
     "dpmAA": 215,
     "dpmSiege": 48,
     "sysHP": 7300,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "卫士·支援型": {
  "风暴导弹系统": {
   "weapons": [
    {
     "name": "MK2-CM-8x200C \"Storm\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+80",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 80,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-30%",
       "effect": "防空冷却缩减",
       "value": 30,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-30%",
       "effect": "防空攻击持续时间缩减",
       "value": 30,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 80,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 8,
     "cooldown": 14,
     "duration": 8,
     "option": "734",
     "dpmShip": 3054,
     "dpmAA": 837,
     "dpmSiege": 349,
     "sysHP": 6650,
     "shield": 1
    }
   ]
  },
  "无人机支援系统": {
   "weapons": [
    {
     "name": "CRT-3",
     "actions": [
      {
       "name": "搭载维修无人机",
       "desc": "维修无人机容量：1",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmSiege": 7200,
     "shield": 1563,
     "option": ""
    },
    {
     "name": "CAT-3",
     "actions": [
      {
       "name": "搭载区域防空无人机",
       "desc": "近防无人机容量：1",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmSiege": 7200,
     "shield": 1535,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "态势感知系统": {
   "weapons": [
    {
     "name": "XI-3550",
     "actions": [
      {
       "name": "导弹命中规避",
       "desc": "被导弹命中的概率降低30%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 30,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "赫利俄斯级·重型火炮突击型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "舰首综合重型炮台系统": {
   "weapons": [
    {
     "name": "FG-2300A \"NeoX\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 250,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 10,
     "duration": 0,
     "option": "0",
     "dpmShip": 5760,
     "dpmAA": 900,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "小型炮台系统": {
   "weapons": [
    {
     "name": "FG-1103A",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 55,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 3375,
     "dpmAA": 278,
     "dpmSiege": 123,
     "sysHP": 13500,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "创神星级·轨道炮型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "综合轨道炮系统": {
   "weapons": [
    {
     "name": "AR-2380C",
     "actions": [],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 450,
     "cycle": 2,
     "lockOn": 10,
     "rounds": 1,
     "cooldown": 16,
     "duration": 0,
     "option": "0",
     "dpmShip": 3300,
     "dpmAA": 506,
     "sysHP": 6850,
     "shield": 4
    },
    {
     "name": "AR-1125A",
     "actions": [],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 60,
     "cycle": 1,
     "lockOn": 6,
     "rounds": 3,
     "cooldown": 6,
     "duration": 6,
     "option": "589",
     "dpmShip": 1500,
     "dpmAA": 215,
     "sysHP": 6850,
     "shield": 3
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "创神星级·鱼雷型": {
  "永恒北极星投射发射系统": {
   "weapons": [
    {
     "name": "MK3-AT-1-700 \"Supernova-White K\"",
     "actions": [
      {
       "name": "暴击",
       "desc": "有15%概率对目标额外造成170%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 170,
       "cond": "概率",
       "condValue": 0.15
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 350,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 8,
     "cooldown": 32,
     "duration": 12,
     "option": "589",
     "dpmShip": 3709,
     "dpmAA": 572,
     "dpmSiege": 381,
     "sysHP": 6850,
     "shield": 5
    },
    {
     "name": "AM-4x400B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+70",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 70,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-40%",
       "effect": "防空冷却缩减",
       "value": 40,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-50%",
       "effect": "防空攻击持续时间缩减",
       "value": 50,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 70,
     "cycle": 1,
     "lockOn": 8,
     "rounds": 4,
     "cooldown": 12,
     "duration": 6,
     "option": "734",
     "dpmShip": 1600,
     "dpmAA": 448,
     "sysHP": 6850,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-180",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "斗牛级·突击型": {
  "牛角脉冲炮系统": {
   "weapons": [
    {
     "name": "BP-600A",
     "actions": [
      {
       "name": "能量护盾穿透",
       "desc": "目标为5时，有机会使其能量护盾失效",
       "effect": "能量护盾穿透",
       "value": null,
       "cond": "概率",
       "condValue": 0.3
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 200,
     "cycle": 3,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 8,
     "duration": 0,
     "option": "0",
     "dpmShip": 4500,
     "dpmAA": 1350,
     "sysHP": 8550,
     "shield": 6
    },
    {
     "name": "BP-120B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+25",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 25,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-35%",
       "effect": "防空冷却缩减",
       "value": 35,
       "cond": ""
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 20,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 1200,
     "dpmAA": 283,
     "dpmSiege": 8550,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-45",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 4,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.04,
     "armor": 30,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "强化装甲系统": {
   "weapons": [
    {
     "name": "ASX-100",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船生命值",
       "act": "比例加成",
       "value": 20,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RPT-300",
     "actions": [
      {
       "name": "脉冲炮伤害提升",
       "desc": "所有脉冲炮伤害提升15%",
       "effect": "伤害提升",
       "act": "比例加成",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "斗牛级·防御型": {
  "牛角脉冲炮系统": {
   "weapons": [
    {
     "name": "BP-600T",
     "actions": [
      {
       "name": "能量护盾穿透",
       "desc": "目标为5时，有机会使其能量护盾失效",
       "effect": "能量护盾穿透",
       "value": null,
       "cond": "概率",
       "condValue": 0.3
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-35%",
       "effect": "防空冷却缩减",
       "value": 35,
       "cond": ""
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 350,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 4200,
     "dpmAA": 630,
     "dpmSiege": 294,
     "sysHP": 8550,
     "shield": 3
    },
    {
     "name": "BP-120C",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+62",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 62,
       "cond": ""
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 2,
     "duration": 0,
     "option": "589",
     "dpmShip": 822,
     "dpmSiege": 8550,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-45",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 4,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.04,
     "armor": 30,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "强化装甲系统": {
   "weapons": [
    {
     "name": "ASX-100",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船生命值",
       "act": "比例加成",
       "value": 20,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RPT-300",
     "actions": [
      {
       "name": "脉冲炮伤害提升",
       "desc": "所有脉冲炮伤害提升15%",
       "effect": "伤害提升",
       "act": "比例加成",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "斗牛级·脉冲炮型": {
  "牛角脉冲炮系统": {
   "weapons": [
    {
     "name": "BP-120B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+25",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 25,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-35%",
       "effect": "防空冷却缩减",
       "value": 35,
       "cond": ""
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 20,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 1200,
     "dpmAA": 283,
     "dpmSiege": 8100,
     "shield": 1
    },
    {
     "name": "BP-600T",
     "actions": [
      {
       "name": "能量护盾穿透",
       "desc": "目标为5时，有机会使其能量护盾失效",
       "effect": "能量护盾穿透",
       "value": null,
       "cond": "概率",
       "condValue": 0.3
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-35%",
       "effect": "防空冷却缩减",
       "value": 35,
       "cond": ""
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 350,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 4200,
     "dpmAA": 630,
     "dpmSiege": 294,
     "sysHP": 8100,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RPT-300",
     "actions": [
      {
       "name": "脉冲炮伤害提升",
       "desc": "所有脉冲炮伤害提升15%",
       "effect": "伤害提升",
       "act": "比例加成",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "苔原级·载机型": {
  "苔原舰载机系统": {
   "weapons": [
    {
     "name": "CBF-255",
     "actions": [
      {
       "name": "搭载中型战机编队",
       "desc": "可搭载中型战机编队2",
       "effect": "搭载战机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "战机类型",
       "condValue": null
      }
     ],
     "shield": 712,
     "option": ""
    },
    {
     "name": "XAT-1000",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰载机闪避提升10%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 10,
       "cond": ""
      },
      {
       "name": "对战机命中率提升",
       "desc": "搭载舰载机主武器对战机命中率提升15%",
       "effect": "对单一类型武器命中率提升",
       "act": "比例加成",
       "value": 15,
       "cond": "目标舰船",
       "condValue": null
      }
     ],
     "option": ""
    }
   ]
  },
  "综合武备库": {
   "weapons": [
    {
     "name": "MK2-BG-2100B \"Fortress\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+30",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1350,
     "dpmAA": 519,
     "dpmSiege": 157,
     "sysHP": 7200,
     "shield": 1
    },
    {
     "name": "BT-270A",
     "actions": [],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 150,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 2,
     "cooldown": 15,
     "duration": 10,
     "option": "0",
     "dpmShip": 672,
     "dpmAA": 165,
     "sysHP": 7200,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "苔原级·战术型": {
  "苔原无人机系统": {
   "weapons": [
    {
     "name": "CNT-3",
     "actions": [
      {
       "name": "搭载防空无人机",
       "desc": "防空无人机容量：2",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 2,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmSiege": 8100,
     "shield": 1455,
     "option": ""
    },
    {
     "name": "CRT-3",
     "actions": [
      {
       "name": "搭载维修无人机",
       "desc": "维修无人机容量：1",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmSiege": 8100,
     "shield": 1563,
     "option": ""
    }
   ]
  },
  "速射炮台系统": {
   "weapons": [
    {
     "name": "MK2-BG-2100B \"Fortress\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+30",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1350,
     "dpmAA": 519,
     "dpmSiege": 157,
     "sysHP": 7200,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-40",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 20,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  },
  "信息系统": {
   "weapons": [
    {
     "name": "XAT-1000",
     "actions": [
      {
       "name": "目标选择加速",
       "desc": "搭载舰载机主武器目标选择时间缩减20%",
       "effect": "目标选择时间缩减",
       "act": "比例减少",
       "value": 20,
       "cond": ""
      },
      {
       "name": "对战机命中率提升",
       "desc": "武器系统对舰载机命中率提升15%",
       "effect": "对单一类型武器命中率提升",
       "act": "比例加成",
       "value": 15,
       "cond": "目标舰船",
       "condValue": null
      }
     ],
     "option": ""
    }
   ]
  }
 },
 "XT-10级·鱼雷型": {
  "永恒北极星投射发射系统": {
   "weapons": [
    {
     "name": "MK2-AT-2-820A \"Supernova-White K\" (Smuggled)",
     "actions": [
      {
       "name": "暴击",
       "desc": "有15%概率对目标额外造成170%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 170,
       "cond": "概率",
       "condValue": 0.15
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 800,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 2,
     "cooldown": 32,
     "duration": 12,
     "option": "589",
     "dpmShip": 4309,
     "dpmAA": 523,
     "sysHP": 6450,
     "shield": 5
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-35",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 12,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 2,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 0.02,
     "armor": 12,
     "option": ""
    },
    {
     "name": "DD-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "FG-280",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 20,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 5,
     "duration": 3,
     "option": "734",
     "dpmShip": 1350,
     "dpmAA": 283,
     "dpmSiege": 80,
     "sysHP": 6450,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-190",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-200",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1800",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "理智A101·战斗攻击型": {
  "机载武器系统": {
   "weapons": [
    {
     "name": "FG-181D",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 100,
       "cond": "概率",
       "condValue": 0.25
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 100,
     "cycle": 1,
     "lockOn": 12,
     "rounds": 5,
     "cooldown": 5,
     "duration": 25,
     "option": "0",
     "dpmShip": 2700,
     "dpmAA": 240,
     "sysHP": 2200,
     "shield": 1
    },
    {
     "name": "FG-232B/D",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 144,
     "dpmAA": 690,
     "dpmSiege": 2200,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-60",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "AT021·重型攻击型": {
  "精准打击系统": {
   "weapons": [
    {
     "name": "SM-1x50C/D",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 75,
       "cond": "概率",
       "condValue": 0.6
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 75,
       "cond": "概率",
       "condValue": 0.6
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 40,
     "cycle": 1,
     "lockOn": 10,
     "rounds": 6,
     "cooldown": 6,
     "duration": 20,
     "option": "0",
     "dpmShip": 2490,
     "dpmAA": 264,
     "sysHP": 2250,
     "shield": 5
    }
   ]
  },
  "机载制导系统": {
   "weapons": [
    {
     "name": "SM-1x300D",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 350,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 35,
     "duration": 35,
     "option": "0",
     "dpmShip": 1746,
     "dpmAA": 216,
     "sysHP": 2250,
     "shield": 5
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100S",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-60",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "AT021·脉冲攻击型": {
  "机载能量系统": {
   "weapons": [
    {
     "name": "RPT-650",
     "actions": [
      {
       "name": "脉冲炮伤害提升",
       "desc": "所有脉冲炮伤害提升15%",
       "effect": "伤害提升",
       "act": "比例加成",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "shield": 2,
     "option": ""
    },
    {
     "name": "F-100S",
     "actions": [],
     "option": ""
    }
   ]
  },
  "脉冲炮系统": {
   "weapons": [
    {
     "name": "SP-190D",
     "actions": [],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 190,
     "cycle": 1,
     "lockOn": 10,
     "rounds": 2,
     "cooldown": 6,
     "duration": 35,
     "option": "589",
     "dpmShip": 1668,
     "dpmAA": 999,
     "dpmSiege": 48,
     "sysHP": 2250,
     "shield": 7
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-60",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "AT021·战术攻击型": {
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-60A",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "战机闪避提升10%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 10,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "电子干扰系统": {
   "weapons": [
    {
     "name": "SN-142D",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升30%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 30,
       "cond": ""
      },
      {
       "name": "指定排与类型优先攻击",
       "desc": "",
       "effect": "优先攻击",
       "cond": ""
      }
     ],
     "dpmShip": 2250,
     "shield": 1,
     "option": "0"
    }
   ]
  },
  "机载武器系统": {
   "weapons": [
    {
     "name": "SG-130D",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 5,
     "cooldown": 12,
     "duration": 20,
     "option": "589",
     "dpmShip": 843,
     "dpmAA": 675,
     "dpmSiege": 96,
     "sysHP": 2250,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100S",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "B192新大地·重型攻击型": {
  "突击火炮系统": {
   "weapons": [
    {
     "name": "AG-275D",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 200,
       "cond": "概率",
       "condValue": 0.25
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 250,
       "cond": "概率",
       "condValue": 0.6
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 35,
     "cycle": 2,
     "lockOn": 12,
     "rounds": 5,
     "cooldown": 7,
     "duration": 20,
     "option": "0",
     "dpmShip": 1665,
     "dpmAA": 348,
     "sysHP": 2250,
     "shield": 1
    }
   ]
  },
  "防空导弹系统": {
   "weapons": [
    {
     "name": "AM-60D",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+30",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 30,
     "cycle": 1,
     "lockOn": 10,
     "rounds": 1,
     "cooldown": 6,
     "duration": 0,
     "option": "589",
     "dpmShip": 1080,
     "dpmSiege": 2250,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-60",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "平衡安德森SC020·侦察型": {
  "机载干扰系统": {
   "weapons": [
    {
     "name": "CE-155D",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升50%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 50,
       "cond": ""
      }
     ],
     "dpmShip": 1550,
     "shield": 1,
     "option": "0"
    }
   ]
  },
  "机载火炮系统": {
   "weapons": [
    {
     "name": "MK1.5-J/CG-430D \"Thunderbolt\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+2",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 2,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 150,
     "dpmAA": 860,
     "dpmSiege": 1800,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-30",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "牛蛙型·两用轰炸型": {
  "机载轰炸系统": {
   "weapons": [
    {
     "name": "BT-2-310D",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 100,
       "cond": "概率",
       "condValue": 0.35
      },
      {
       "name": "暴击",
       "desc": "有20%概率对目标额外造成350%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 350,
       "cond": "概率",
       "condValue": 0.2
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 150,
       "cond": "概率",
       "condValue": 0.35
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 250,
     "cycle": 1,
     "lockOn": 12,
     "rounds": 2,
     "cooldown": 5,
     "duration": 15,
     "option": "1",
     "dpmShip": 2880,
     "dpmAA": 1320,
     "sysHP": 2700,
     "shield": 6
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-80",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "海氏追随者型·脉冲星战斗机": {
  "装甲系统": {
   "weapons": [
    {
     "name": "ASA-15",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 3,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "受到能量伤害降低",
       "act": "数值增加",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 0.05,
     "armor": 3,
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENS-60",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "战机闪避提升25%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 25,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "星追者充能脉冲炮系统": {
   "weapons": [
    {
     "name": "Starchaser - GP-1202D",
     "actions": [],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 125,
     "cycle": 1,
     "lockOn": 18,
     "rounds": 2,
     "cooldown": 6.5,
     "duration": 13,
     "option": "1233",
     "dpmShip": 4614,
     "dpmAA": 2214,
     "dpmSiege": 1521,
     "sysHP": 3250,
     "shield": 4
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "佩刀Aer410·突击攻击型": {
  "火炮/导弹攻击系统": {
   "weapons": [
    {
     "name": "AM-210D",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 250,
       "cond": "概率",
       "condValue": 0.6
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 150,
       "cond": "概率",
       "condValue": 0.4
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 100,
       "cond": "概率",
       "condValue": 0.25
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 75,
     "cycle": 1,
     "lockOn": 10,
     "rounds": 4,
     "cooldown": 9,
     "duration": 20,
     "option": "0",
     "dpmShip": 1611,
     "dpmAA": 297,
     "sysHP": 1800,
     "shield": 1
    },
    {
     "name": "MK1-AG-335D \"Cross\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 5,
     "cycle": 3,
     "lockOn": 10,
     "rounds": 4,
     "cooldown": 10,
     "duration": 16,
     "option": "589",
     "dpmShip": 81,
     "dpmAA": 1194,
     "dpmSiege": 1800,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-60",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "米斯特拉·战斗攻击型": {
  "机载武器系统": {
   "weapons": [
    {
     "name": "MK3-AG-350D \"Cross\"",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 150,
       "cond": "概率",
       "condValue": 0.65
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 100,
       "cond": "概率",
       "condValue": 0.15
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 3,
     "lockOn": 10,
     "rounds": 4,
     "cooldown": 4,
     "duration": 16,
     "option": "1233",
     "dpmShip": 288,
     "dpmAA": 2764,
     "dpmSiege": 2750,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-60",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "SC002型·量子侦察型": {
  "电子侦察系统": {
   "weapons": [
    {
     "name": "SN-135",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升50%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 50,
       "cond": ""
      }
     ],
     "dpmShip": 1150,
     "shield": 1,
     "option": "0"
    }
   ]
  },
  "机载火炮系统": {
   "weapons": [
    {
     "name": "SG-530D",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 5,
     "cooldown": 12,
     "duration": 20,
     "option": "589",
     "dpmShip": 700,
     "dpmAA": 700,
     "dpmSiege": 1550,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-30",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "砂龙·大气截击型": {
  "攻击型防空炮系统": {
   "weapons": [
    {
     "name": "BG-330D",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+5",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 1,
     "lockOn": 12,
     "rounds": 8,
     "cooldown": 5,
     "duration": 24,
     "option": "1233",
     "dpmShip": 165,
     "dpmAA": 1190,
     "dpmSiege": 2250,
     "shield": 1
    },
    {
     "name": "BM-275B/D",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 4,
     "duration": 0,
     "option": "589",
     "dpmShip": 1800,
     "dpmSiege": 2250,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-30",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "孢子A404·轻型战斗机": {
  "机载作战系统": {
   "weapons": [
    {
     "name": "MK1-AG-335D \"Cross\"",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 200,
       "cond": "概率",
       "condValue": 0.5
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 100,
       "cond": "概率",
       "condValue": 0.15
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 5,
     "cycle": 3,
     "lockOn": 10,
     "rounds": 4,
     "cooldown": 4,
     "duration": 16,
     "option": "57",
     "dpmShip": 180,
     "dpmAA": 2590,
     "dpmSiege": 1850,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-30",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "刺鳐·鱼雷轰炸型": {
  "机载轰炸系统": {
   "weapons": [
    {
     "name": "L-CT-2-328D \"Roland Iron Dwarf\"",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 125,
       "cond": "概率",
       "condValue": 0.3
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 125,
       "cond": "概率",
       "condValue": 0.35
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 400,
     "cycle": 1,
     "lockOn": 12,
     "rounds": 2,
     "cooldown": 8,
     "duration": 10,
     "option": "0",
     "dpmShip": 5200,
     "dpmAA": 1652,
     "sysHP": 2950,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "ASA-20X",
     "actions": [
      {
       "name": "导弹命中规避",
       "desc": "被导弹命中的概率降低25%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 25,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "鱼雷命中规避",
       "desc": "被鱼雷命中的概率降低35%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 35,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "火炮命中规避",
       "desc": "被火炮命中的概率降低20%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 20,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-80",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "林鸮A100型·联合攻击型": {
  "充能脉冲炮系统": {
   "weapons": [
    {
     "name": "BP-X50T/D \"Azure Watcher\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+20",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 200,
       "cond": "概率",
       "condValue": 0.35
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 130,
     "cycle": 1,
     "lockOn": 12,
     "rounds": 4,
     "cooldown": 5,
     "duration": 32,
     "option": "57",
     "dpmShip": 2529,
     "dpmAA": 1749,
     "dpmSiege": 504,
     "sysHP": 2700,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-10",
     "actions": [],
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-60",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "维塔斯A021·重型攻击型": {
  "精准打击系统": {
   "weapons": [
    {
     "name": "L-CM-178C/D \"Roland Dart\"",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 150,
       "cond": "概率",
       "condValue": 0.2
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 150,
       "cond": "概率",
       "condValue": 0.75
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 65,
     "cycle": 1,
     "lockOn": 10,
     "rounds": 4,
     "cooldown": 7,
     "duration": 16,
     "option": "0",
     "dpmShip": 3441,
     "dpmAA": 732,
     "sysHP": 2850,
     "shield": 5
    }
   ]
  },
  "复合装甲系统": {
   "weapons": [
    {
     "name": "ASA-15",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 3,
       "cond": ""
      }
     ],
     "shield": 3,
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "反火炮系统": {
   "weapons": [
    {
     "name": "CG-130D",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+5",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 60,
     "dpmAA": 540,
     "dpmSiege": 2850,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-60",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "维塔斯B010·轰炸型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "ASA-28X",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "导弹命中规避",
       "desc": "被导弹命中的概率降低18%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 18,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "鱼雷命中规避",
       "desc": "被鱼雷命中的概率降低30%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 30,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "shield": 10,
     "option": ""
    },
    {
     "name": "F-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "等离子轰击系统": {
   "weapons": [
    {
     "name": "CIM-778D",
     "actions": [],
     "type": "能量",
     "weaponType": "等离子武器",
     "damage": 650,
     "cycle": 1,
     "lockOn": 12,
     "rounds": 1,
     "cooldown": 6,
     "duration": 10,
     "option": "0",
     "dpmShip": 9750,
     "dpmAA": 3606,
     "sysHP": 3400,
     "shield": 4
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "ENA-80",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-100",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "卡利莱恩级·重型火炮型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-115B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升35%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 35,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "卡利莱恩重型火炮系统": {
   "weapons": [
    {
     "name": "CG-2238 \"Carilion K\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 300,
     "cycle": 2,
     "lockOn": 5,
     "rounds": 1,
     "cooldown": 14,
     "duration": 0,
     "option": "0",
     "dpmShip": 2485,
     "dpmAA": 540,
     "sysHP": 2700,
     "shield": 1
    }
   ]
  },
  "近防火炮系统": {
   "weapons": [
    {
     "name": "MK2-CG-1118B \"Comet Tail\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 2,
     "lockOn": 2,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 96,
     "dpmSiege": 2700,
     "shield": 1
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "卡利莱恩级·侦察型": {
  "近防火炮系统": {
   "weapons": [
    {
     "name": "MK1-CG-628B/D \"Comet Tail\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+5",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 6,
     "cooldown": 4,
     "duration": 6,
     "option": "589",
     "dpmShip": 172,
     "dpmSiege": 2700,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-115B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升35%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 35,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "速射反舰火炮系统": {
   "weapons": [
    {
     "name": "CG-1118A",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 5,
     "duration": 3,
     "option": "589",
     "dpmShip": 1125,
     "dpmAA": 189,
     "dpmSiege": 315,
     "sysHP": 2700,
     "shield": 3
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "卡利莱恩级·特种型": {
  "预警系统": {
   "weapons": [
    {
     "name": "XI-3550",
     "actions": [
      {
       "name": "导弹命中规避",
       "desc": "被导弹命中的概率降低30%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 30,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "鱼雷命中规避",
       "desc": "被鱼雷命中的概率降低40%",
       "effect": "被武器命中率降低",
       "act": "比例减少",
       "value": 40,
       "cond": "目标武器",
       "condValue": null
      }
     ],
     "option": ""
    }
   ]
  },
  "信息干扰系统": {
   "weapons": [
    {
     "name": "XSK-120",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升20%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 20,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-115B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升35%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 35,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "速射反舰火炮系统": {
   "weapons": [
    {
     "name": "CG-1118A",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 35,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 5,
     "duration": 3,
     "option": "589",
     "dpmShip": 1125,
     "dpmAA": 189,
     "dpmSiege": 315,
     "sysHP": 2700,
     "shield": 3
    }
   ]
  },
  "近防火炮系统": {
   "weapons": [
    {
     "name": "MK2-CG-1118B \"Comet Tail\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 2,
     "lockOn": 2,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 96,
     "dpmSiege": 2700,
     "shield": 1
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "FG300型·装甲型": {
  "FG-302通用炮台系统": {
   "weapons": [
    {
     "name": "FG300-SG-1150",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+50",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 4,
     "duration": 3,
     "option": "589",
     "dpmShip": 771,
     "dpmAA": 462,
     "dpmSiege": 180,
     "sysHP": 3600,
     "shield": 3
    },
    {
     "name": "SG-330B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+30",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 215,
     "dpmSiege": 3600,
     "shield": 1
    }
   ]
  },
  "MS强化装甲系统": {
   "weapons": [
    {
     "name": "AS-35",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 15,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 15,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "FG300型·多用途型": {
  "FG300通用炮台系统": {
   "weapons": [
    {
     "name": "FG300-SG-1150",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+50",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 4,
     "duration": 3,
     "option": "589",
     "dpmShip": 1157,
     "dpmAA": 607,
     "dpmSiege": 270,
     "sysHP": 2700,
     "shield": 3
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "FG300型·侦察型": {
  "FG300通用炮台系统": {
   "weapons": [
    {
     "name": "FG300-SG-1150",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+50",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 4,
     "duration": 3,
     "option": "589",
     "dpmShip": 385,
     "dpmAA": 289,
     "dpmSiege": 90,
     "sysHP": 3050,
     "shield": 3
    },
    {
     "name": "SG-330B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+30",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 30,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 1,
     "cooldown": 3,
     "duration": 0,
     "option": "589",
     "dpmShip": 215,
     "dpmSiege": 3050,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "强化引擎系统": {
   "weapons": [
    {
     "name": "EN-114B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升20%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 20,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "严酷级·突击型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "舰首轨道炮系统": {
   "weapons": [
    {
     "name": "FR-1385C",
     "actions": [
      {
       "name": "攻城伤害提升",
       "desc": "",
       "effect": "攻城伤害",
       "act": "比例加成",
       "value": 25,
       "cond": "目标舰船"
      }
     ],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 600,
     "cycle": 1,
     "lockOn": 6,
     "rounds": 1,
     "cooldown": 12,
     "duration": 0,
     "option": "0",
     "dpmShip": 2950,
     "dpmAA": 1290,
     "sysHP": 3250,
     "shield": 4
    }
   ]
  },
  "速射炮台系统": {
   "weapons": [
    {
     "name": "FG-130B",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 3,
     "cooldown": 6,
     "duration": 3,
     "option": "589",
     "dpmShip": 200,
     "dpmAA": 71,
     "dpmSiege": 65,
     "sysHP": 3250,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "云海级·防空型": {
  "防空无人机系统": {
   "weapons": [
    {
     "name": "CAT-2",
     "actions": [
      {
       "name": "搭载防空无人机",
       "desc": "防空无人机容量：1",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmSiege": 3050,
     "shield": 1772,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "导弹支援系统": {
   "weapons": [
    {
     "name": "AM-2x138B",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 50,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 2,
     "cooldown": 5,
     "duration": 2,
     "option": "589",
     "dpmShip": 685,
     "dpmAA": 128,
     "dpmSiege": 2900,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "云海级·轻型登陆型": {
  "突击登陆无人机系统": {
   "weapons": [
    {
     "name": "CST-2",
     "actions": [
      {
       "name": "搭载攻城无人机",
       "desc": "攻城无人机容量：1",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmAA": 1512,
     "sysHP": 3250,
     "shield": 1779,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "导弹支援系统": {
   "weapons": [
    {
     "name": "AM-2x138",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 60,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 2,
     "cooldown": 5,
     "duration": 2,
     "option": "0",
     "dpmShip": 857,
     "dpmAA": 20,
     "sysHP": 2900,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "澄海级·防空型": {
  "永恒北极星Mk I-B投射发射系统": {
   "weapons": [
    {
     "name": "AM-4x60B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+60",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 60,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-40%",
       "effect": "防空冷却缩减",
       "value": 40,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-40%",
       "effect": "防空攻击持续时间缩减",
       "value": 40,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 20,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 4,
     "cooldown": 6,
     "duration": 4,
     "option": "734",
     "dpmShip": 480,
     "dpmAA": 460,
     "dpmSiege": 4300,
     "shield": 1
    }
   ]
  },
  "十字综合火炮系统": {
   "weapons": [
    {
     "name": "MK1-AG-335B \"Cross\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-10%",
       "effect": "防空冷却缩减",
       "value": 10,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-10%",
       "effect": "防空攻击持续时间缩减",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 3,
     "cooldown": 3,
     "duration": 3,
     "option": "589",
     "dpmShip": 300,
     "dpmAA": 180,
     "dpmSiege": 4300,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-110",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "澄海级·重型": {
  "永恒北极星Mk I-A1投射发射系统": {
   "weapons": [
    {
     "name": "AT-360A \"Supernova – White\"",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 150,
       "cond": "概率",
       "condValue": 0.2
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 130,
       "cond": "概率",
       "condValue": 0.2
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 370,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 7,
     "duration": 0,
     "option": "0",
     "dpmShip": 3085,
     "dpmAA": 951,
     "sysHP": 4300,
     "shield": 4
    }
   ]
  },
  "十字综合火炮系统": {
   "weapons": [
    {
     "name": "MK1-AG-335B \"Cross\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-10%",
       "effect": "防空冷却缩减",
       "value": 10,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-10%",
       "effect": "防空攻击持续时间缩减",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 3,
     "cooldown": 3,
     "duration": 3,
     "option": "589",
     "dpmShip": 300,
     "dpmAA": 180,
     "dpmSiege": 4300,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-110",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "澄海级·导弹型": {
  "十字综合火炮系统": {
   "weapons": [
    {
     "name": "MK1-AG-335B \"Cross\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-10%",
       "effect": "防空冷却缩减",
       "value": 10,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-10%",
       "effect": "防空攻击持续时间缩减",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 3,
     "cooldown": 3,
     "duration": 3,
     "option": "589",
     "dpmShip": 300,
     "dpmAA": 180,
     "dpmSiege": 4300,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "永恒北极星Mk I-A2投射发射系统": {
   "weapons": [
    {
     "name": "AM-250A \"Supernova – Blue\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 160,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 9,
     "duration": 0,
     "option": "0",
     "dpmShip": 2000,
     "dpmAA": 298,
     "sysHP": 4300,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-110",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "静海级·截击型": {
  "通用炮台系统": {
   "weapons": [
    {
     "name": "AG-260",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+15",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 15,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-10%",
       "effect": "防空冷却缩减",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 2,
     "duration": 0,
     "option": "589",
     "dpmShip": 120,
     "dpmAA": 360,
     "dpmSiege": 120,
     "sysHP": 3400,
     "shield": 1
    }
   ]
  },
  "永恒北极星投射发射系统": {
   "weapons": [
    {
     "name": "Mk1-AM-3x180B \"Eternal Polaris\"",
     "actions": [
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "拦截能力",
       "desc": "有机会拦截导弹或鱼雷",
       "effect": "制导武器拦截",
       "act": "比例减少",
       "value": 5,
       "cond": "目标武器",
       "condValue": null
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+105",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 105,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 20,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 3,
     "cooldown": 10,
     "duration": 3,
     "option": "589",
     "dpmShip": 415,
     "dpmAA": 545,
     "dpmSiege": 3400,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "静海级·导弹型": {
  "十字综合火炮系统": {
   "weapons": [
    {
     "name": "MK2-AG-260A \"Cross\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+50",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 50,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 25,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 7,
     "duration": 0,
     "option": "589",
     "dpmShip": 771,
     "dpmAA": 405,
     "dpmSiege": 180,
     "sysHP": 3250,
     "shield": 1
    }
   ]
  },
  "永恒北极星投射发射系统": {
   "weapons": [
    {
     "name": "Mk1-AM-3x180 \"Eternal Polaris\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+60",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 60,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-25%",
       "effect": "防空冷却缩减",
       "value": 25,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 60,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 3,
     "cooldown": 13,
     "duration": 3,
     "option": "734",
     "dpmShip": 1125,
     "dpmAA": 323,
     "dpmSiege": 148,
     "sysHP": 3250,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "静海级·脉冲炮型": {
  "防御脉冲炮系统": {
   "weapons": [
    {
     "name": "AP-260B",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+20",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 20,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-20%",
       "effect": "防空冷却缩减",
       "value": 20,
       "cond": ""
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 20,
     "cycle": 2,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 2,
     "duration": 0,
     "option": "589",
     "dpmShip": 576,
     "dpmSiege": 3600,
     "shield": 1
    }
   ]
  },
  "永恒北极星投射发射系统": {
   "weapons": [
    {
     "name": "Mk1-AM-3x180 \"Eternal Polaris\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+60",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 60,
       "cond": ""
      },
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-25%",
       "effect": "防空冷却缩减",
       "value": 25,
       "cond": ""
      }
     ],
     "type": "实弹",
     "weaponType": "导弹",
     "damage": 60,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 3,
     "cooldown": 13,
     "duration": 3,
     "option": "734",
     "dpmShip": 1125,
     "dpmAA": 323,
     "dpmSiege": 148,
     "sysHP": 3600,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "诺玛330·轻型装甲侦查型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "速射炮台系统": {
   "weapons": [
    {
     "name": "BG-1120",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 30,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 5,
     "duration": 3,
     "option": "589",
     "dpmShip": 900,
     "dpmAA": 161,
     "dpmSiege": 229,
     "sysHP": 2900,
     "shield": 3
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "诺玛M470级·防空型": {
  "防空无人机支援系统": {
   "weapons": [
    {
     "name": "CRT-4",
     "actions": [
      {
       "name": "搭载防空无人机",
       "desc": "防空无人机容量：1",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmSiege": 4500,
     "shield": 1772,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "MK1-BG-160 \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 3,
     "cooldown": 6,
     "duration": 3,
     "option": "589",
     "dpmShip": 200,
     "dpmAA": 71,
     "dpmSiege": 138,
     "sysHP": 3800,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-110",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "诺玛M470级·重型登陆型": {
  "攻城无人机支援系统": {
   "weapons": [
    {
     "name": "CST-4",
     "actions": [
      {
       "name": "搭载攻城无人机",
       "desc": "攻城无人机容量：1",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmAA": 1512,
     "sysHP": 4500,
     "shield": 1779,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "MK1-BG-160 \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 3,
     "cooldown": 6,
     "duration": 3,
     "option": "589",
     "dpmShip": 200,
     "dpmAA": 71,
     "dpmSiege": 138,
     "sysHP": 3800,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-110",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "诺玛M470级·支援型": {
  "维修无人机安保系统": {
   "weapons": [
    {
     "name": "CRT-4",
     "actions": [
      {
       "name": "搭载维修无人机",
       "desc": "维修无人机容量：1",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 1,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "shield": 1563,
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "MK1-BG-160 \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 1,
     "lockOn": 2,
     "rounds": 3,
     "cooldown": 6,
     "duration": 3,
     "option": "589",
     "dpmShip": 200,
     "dpmAA": 71,
     "dpmSiege": 138,
     "sysHP": 3800,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-110",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "愤怒级·高速型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "主炮武器系统": {
   "weapons": [
    {
     "name": "FG-2253",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 100,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 8,
     "duration": 0,
     "option": "589",
     "dpmShip": 2700,
     "dpmAA": 360,
     "dpmSiege": 300,
     "sysHP": 2900,
     "shield": 1
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "FG-283",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 30,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 3,
     "cooldown": 5,
     "duration": 3,
     "option": "589",
     "dpmShip": 450,
     "dpmAA": 101,
     "dpmSiege": 33,
     "sysHP": 2900,
     "shield": 3
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "愤怒级·鱼雷型": {
  "鱼雷发射系统": {
   "weapons": [
    {
     "name": "FT-260",
     "actions": [
      {
       "name": "暴击",
       "desc": "有15%概率对目标额外造成170%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 170,
       "cond": "概率",
       "condValue": 0.15
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 300,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 2,
     "cooldown": 16,
     "duration": 4,
     "option": "1",
     "dpmShip": 3480,
     "dpmAA": 612,
     "sysHP": 2900,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "FG-2253",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 100,
     "cycle": 2,
     "lockOn": 4,
     "rounds": 1,
     "cooldown": 8,
     "duration": 0,
     "option": "589",
     "dpmShip": 1350,
     "dpmAA": 225,
     "dpmSiege": 150,
     "sysHP": 2900,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    },
    {
     "name": "EN-110",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "雷里亚特级·速射鱼雷型": {
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-115B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升35%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 35,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "反舰鱼雷系统": {
   "weapons": [
    {
     "name": "CT-240A \"Roland Iron Dwarf K\"",
     "actions": [
      {
       "name": "暴击",
       "desc": "有10%概率对目标额外造成120%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 120,
       "cond": "概率",
       "condValue": 0.1
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 35,
     "cycle": 4,
     "lockOn": 3,
     "rounds": 5,
     "cooldown": 20,
     "duration": 10,
     "option": "589",
     "dpmShip": 2000,
     "dpmAA": 336,
     "dpmSiege": 280,
     "sysHP": 3600,
     "shield": 1
    }
   ]
  },
  "速射炮台系统": {
   "weapons": [
    {
     "name": "CG-135",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 2,
     "lockOn": 2,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 72,
     "dpmAA": 75,
     "dpmSiege": 50,
     "sysHP": 3600,
     "shield": 1
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "雷里亚特级·隐身型": {
  "隐身鱼雷系统": {
   "weapons": [
    {
     "name": "CT-280T \"Roland Iron Dwarf K\"",
     "actions": [
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 150,
       "cond": "概率",
       "condValue": 0.35
      },
      {
       "name": "攻击系统",
       "desc": "有机会对目标系统造成伤害，攻击优先级之外的系统不会被选为目标",
       "effect": "子系统暴击",
       "act": "基础数值增加",
       "value": 150,
       "cond": "概率",
       "condValue": 0.2
      }
     ],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 200,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 5,
     "cooldown": 25,
     "duration": 10,
     "option": "0",
     "dpmShip": 3257,
     "dpmAA": 205,
     "sysHP": 3600,
     "shield": 4
    }
   ]
  },
  "战场伪装系统": {
   "weapons": [
    {
     "name": "XSK-120",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升35%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 35,
       "cond": ""
      },
      {
       "name": "被拦截概率降低",
       "desc": "所有导弹和鱼雷被拦截概率降低30%",
       "effect": "导弹拦截",
       "act": "比例减少",
       "value": 30,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-115B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升35%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 35,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "雷里亚特级·战术鱼雷型": {
  "反舰鱼雷系统": {
   "weapons": [
    {
     "name": "CT-248A \"Roland Iron Dwarf P\"",
     "actions": [
      {
       "name": "暴击",
       "desc": "有15%概率对目标额外造成200%暴击伤害",
       "effect": "暴击伤害",
       "act": "基础数值增加",
       "value": 200,
       "cond": "概率",
       "condValue": 0.15
      }
     ],
     "type": "能量",
     "weaponType": "鱼雷",
     "damage": 100,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 5,
     "cooldown": 18,
     "duration": 5,
     "option": "1",
     "dpmShip": 2608,
     "dpmAA": 860,
     "sysHP": 3600,
     "shield": 4
    }
   ]
  },
  "速射脉冲炮系统": {
   "weapons": [
    {
     "name": "CP-110",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+10",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 10,
       "cond": ""
      }
     ],
     "type": "能量",
     "weaponType": "脉冲武器",
     "damage": 20,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 480,
     "dpmAA": 86,
     "dpmSiege": 14,
     "sysHP": 3600,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-115B",
     "actions": [
      {
       "name": "闪避提升",
       "desc": "舰船闪避提升35%",
       "effect": "舰船闪避提升",
       "act": "比例减少",
       "value": 35,
       "cond": ""
      }
     ],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RT-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "红宝石级·实验离子炮型": {
  "闪光防空离子炮系统": {
   "weapons": [
    {
     "name": "BI-470B/T",
     "actions": [
      {
       "name": "防空循环",
       "desc": "对舰载机目标武器效率提升，冷却额外-20%",
       "effect": "防空冷却缩减",
       "value": 20,
       "cond": ""
      },
      {
       "name": "防空高速打击",
       "desc": "对舰载机使用高速打击模式，打击持续时间额外-35%",
       "effect": "防空攻击持续时间缩减",
       "value": 35,
       "cond": ""
      },
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+60",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 60,
       "cond": ""
      }
     ],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 40,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 2,
     "duration": 2,
     "option": "589",
     "dpmShip": 360,
     "dpmSiege": 3950,
     "shield": 1
    },
    {
     "name": "RA-350",
     "actions": [],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RKI-280",
     "actions": [
      {
       "name": "离子炮伤害提升",
       "desc": "所有离子炮伤害提升15%",
       "effect": "伤害提升",
       "act": "比例加成",
       "value": 15,
       "cond": ""
      }
     ],
     "option": ""
    }
   ]
  },
  "激光束离子炮攻击系统": {
   "weapons": [
    {
     "name": "BI-440T",
     "actions": [],
     "type": "能量",
     "weaponType": "离子武器",
     "damage": 275,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 2,
     "cooldown": 4,
     "duration": 4,
     "option": "0",
     "dpmShip": 4125,
     "dpmAA": 618,
     "sysHP": 3950,
     "shield": 4
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-110",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "红宝石级·重型防御型": {
  "强化装甲系统": {
   "weapons": [
    {
     "name": "AS-50X",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 35,
       "cond": ""
      },
      {
       "name": "闪避降低",
       "desc": "舰船闪避降低10%",
       "effect": "舰船闪避降低",
       "value": 10,
       "cond": ""
      }
     ],
     "shield": 35,
     "option": ""
    },
    {
     "name": "BST-100",
     "actions": [],
     "type": "维修",
     "weaponType": "电磁",
     "damage": 800,
     "cycle": 1,
     "lockOn": 3,
     "rounds": 1,
     "cooldown": 25,
     "duration": 0,
     "option": "0",
     "dpmShip": 6200,
     "shield": 5
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "攻城鱼雷系统": {
   "weapons": [
    {
     "name": "BT-270C",
     "actions": [],
     "type": "实弹",
     "weaponType": "鱼雷",
     "damage": 180,
     "cycle": 1,
     "lockOn": 4,
     "rounds": 2,
     "cooldown": 15,
     "duration": 10,
     "option": "0",
     "dpmShip": 1632,
     "dpmAA": 656,
     "sysHP": 5050,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-110",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "红宝石级·重型轨道炮型": {
  "望远镜轨道炮攻击系统": {
   "weapons": [
    {
     "name": "BR-1480A \"Ruby\"",
     "actions": [
      {
       "name": "物理装甲穿透",
       "desc": "目标为5时，有机会使其物理装甲失效",
       "effect": "物理装甲失效",
       "value": null,
       "cond": "概率",
       "condValue": 0.3
      }
     ],
     "type": "实弹",
     "weaponType": "轨道炮",
     "damage": 320,
     "cycle": 1,
     "lockOn": 5,
     "rounds": 2,
     "cooldown": 12,
     "duration": 0,
     "option": "0",
     "dpmShip": 3100,
     "dpmAA": 608,
     "sysHP": 4500,
     "shield": 1
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用防御炮台系统": {
   "weapons": [
    {
     "name": "MK1-BG-220 \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 10,
     "cycle": 2,
     "lockOn": 2,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 72,
     "dpmAA": 75,
     "dpmSiege": 50,
     "sysHP": 4500,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-110",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RE-150",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 },
 "狼蜥级·防御型": {
  "毒刺无人机防御系统": {
   "weapons": [
    {
     "name": "Stinger",
     "actions": [
      {
       "name": "搭载防御无人机",
       "desc": "毒刺防御无人机容量：4",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 4,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmSiege": 3250,
     "shield": 1864,
     "option": ""
    },
    {
     "name": "XID-3400",
     "actions": [],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "MK1-BG-245 \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 2,
     "lockOn": 2,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 240,
     "dpmAA": 86,
     "dpmSiege": 28,
     "sysHP": 2700,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RPT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  },
  "超等离子攻击系统": {
   "weapons": [
    {
     "name": "BIM-80B/D \"Barrier\"",
     "actions": [
      {
       "name": "防空特种弹药",
       "desc": "对舰载机目标切换特种弹药，单发伤害额外+40",
       "effect": "防空特种弹药",
       "act": "基础数值增加",
       "value": 40,
       "cond": ""
      }
     ]
    }
   ]
  }
 },
 "狼蜥级·战术型": {
  "毒刺无人机攻击系统": {
   "weapons": [
    {
     "name": "Stinger",
     "actions": [
      {
       "name": "搭载军用无人机",
       "desc": "毒刺军用无人机容量：4",
       "effect": "无人机",
       "act": "基础数值增加",
       "value": 4,
       "cond": "无人机",
       "condValue": null
      }
     ],
     "dpmAA": 1120,
     "sysHP": 3250,
     "shield": 1875,
     "option": ""
    },
    {
     "name": "XID-3400",
     "actions": [],
     "option": ""
    }
   ]
  },
  "装甲系统": {
   "weapons": [
    {
     "name": "AC-20",
     "actions": [
      {
       "name": "",
       "desc": "",
       "effect": "舰船装甲",
       "act": "基础数值增加",
       "value": 5,
       "cond": ""
      },
      {
       "name": "",
       "desc": "",
       "effect": "维修效率",
       "value": 5,
       "cond": ""
      }
     ],
     "shield": 5,
     "option": ""
    },
    {
     "name": "FF-100",
     "actions": [],
     "option": ""
    }
   ]
  },
  "通用炮台系统": {
   "weapons": [
    {
     "name": "MK1-BG-245 \"Fortress\"",
     "actions": [],
     "type": "实弹",
     "weaponType": "火炮",
     "damage": 15,
     "cycle": 2,
     "lockOn": 2,
     "rounds": 1,
     "cooldown": 5,
     "duration": 0,
     "option": "589",
     "dpmShip": 240,
     "dpmAA": 86,
     "dpmSiege": 28,
     "sysHP": 2700,
     "shield": 1
    }
   ]
  },
  "推进系统": {
   "weapons": [
    {
     "name": "EN-100",
     "actions": [],
     "option": ""
    },
    {
     "name": "EC-120",
     "actions": [],
     "option": ""
    }
   ]
  },
  "能量系统": {
   "weapons": [
    {
     "name": "RPT-280",
     "actions": [],
     "option": ""
    }
   ]
  },
  "指挥系统": {
   "weapons": [
    {
     "name": "XC-1000",
     "actions": [],
     "option": ""
    }
   ]
  }
 }
};
