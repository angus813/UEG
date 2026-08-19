// 舰船属性数据（ship_database.json + 舰船详情.xlsx + 百科全书：评级/描述/故事/语录）
window.SHIP_STATS_ALIAS = {
  "乌拉诺斯之矛级": "乌拉诺斯之矛",
  "RB7-13型": "RB7",
  "XT-20级": "XT",
  "XT-10级": "XT",
  "XT-8级": "XT",
  "牛蛙型": "牛蛙",
  "维塔斯B010": "维塔斯",
  "S-列维9号": "S",
  "静海级": "静海区",
  "CV-II003型": "CV",
  "CV-M011型": "CV",
  "CV-T800型": "CV",
  "雷火之星级": "雷火之星",
  "翼骑兵级": "枪骑兵级",
  "XT-8型": "XT",
  "S-Levy9- Heavy Torpedo Escort Corvette": "S",
  "S-Levy9": "S"
};

window.SHIP_STATS = {
 "CAS066级": [
  {
   "name": "CAS066级-通用巡洋舰",
   "variant": "A型(综合型)",
   "type": "巡洋舰",
   "position": "前排",
   "commandValue": 18,
   "hp": 71600,
   "cruise": 500,
   "warp": 2500,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "B",
    "support": "B"
   },
   "firepower": {
    "antiShip": 10726,
    "antiAir": 3658,
    "siege": 72
   },
   "modules": [
    "重型鱼雷发射系统",
    "能源系统",
    "前排指挥系统",
    "标准综合舰炮系统",
    "装甲系统",
    "动力系统"
   ],
   "size": 1010,
   "maxShip": 12,
   "build": {
    "metal": 62130,
    "crystal": 7340,
    "deuterium": 2410,
    "time": 0.11,
    "capacity": 26000
   },
   "desc": "前代型号的重型武器平台被改装为无人机维护系统，可搭载3个维修无人机中队，战斗中为舰船提供维修。保留综合火炮系统以维持对各类目标的攻击能力。",
   "story": "第聂伯要塞是资源行星普里西拉附近的关键战略要地，其归属决定了普里西拉战役的结局。战神军团与鹰卫围绕要塞在轨道上展开了长达数月的消耗战。战神军团投入多支舰队封锁第聂伯要塞附近的航线，切断了鹰卫的补给。一支以CAS066为主力的舰队摧毁了鹰卫的补给与工程舰船。因此，CAS066也被称为\"采矿者杀手\"。",
   "quote": "告诉我一支舰队携带的补给，我就能告诉你他们的有效作战半径。——基恩·穆迪，《精神堡垒》首席军事官"
  },
  {
   "name": "CAS066级-炮击巡洋舰",
   "variant": "B型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 18,
   "hp": 63340,
   "cruise": 500,
   "warp": 2500,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 15103,
    "antiAir": 6747,
    "siege": 53
   },
   "modules": [
    "长轴轨道炮系统",
    "能源系统",
    "中排指挥系统",
    "防卫火炮系统",
    "装甲系统",
    "动力系统"
   ],
   "size": 1010,
   "maxShip": 12,
   "build": {
    "metal": 61300,
    "crystal": 7420,
    "deuterium": 2000,
    "time": 0.1,
    "capacity": 25000
   },
   "desc": "装备盘古的轨道炮技术。武器左侧的大型供电系统可为2门巨型轨道炮持续供能，使其以高功率连续射击。对大型舰船拥有强大攻击能力，并装备基础通用炮台用于自卫。",
   "story": "第聂伯要塞是资源行星普里西拉附近的关键战略要地，其归属决定了普里西拉战役的结局。战神军团与鹰卫围绕要塞在轨道上展开了长达数月的消耗战。战神军团投入多支舰队封锁第聂伯要塞附近的航线，切断了鹰卫的补给。一支以CAS066为主力的舰队摧毁了鹰卫的补给与工程舰船。因此，CAS066也被称为\"采矿者杀手\"。",
   "quote": "告诉我一支舰队携带的补给，我就能告诉你他们的有效作战半径。——基恩·穆迪，《精神堡垒》首席军事官"
  },
  {
   "name": "CAS066级-载机巡洋舰",
   "variant": "C型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 18,
   "hp": 66400,
   "cruise": 500,
   "warp": 2500,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "B",
    "support": "B"
   },
   "firepower": {
    "antiShip": 3975,
    "antiAir": 1083,
    "siege": 72
   },
   "modules": [
    "护航艇维护系统",
    "标准综合舰炮系统"
   ],
   "size": 1010,
   "maxShip": 12,
   "build": {
    "metal": 57130,
    "crystal": 5510,
    "deuterium": 3250,
    "time": 0.12,
    "capacity": 26000
   },
   "desc": "前代型号的重型武器平台被改装为护航艇维护系统，可搭载2艘护航艇，获得远程攻击能力。保留综合炮台以维持对各类目标的攻击能力。",
   "story": "第聂伯要塞是资源行星普里西拉附近的关键战略要地，其归属决定了普里西拉战役的结局。战神军团与鹰卫围绕要塞在轨道上展开了长达数月的消耗战。战神军团投入多支舰队封锁第聂伯要塞附近的航线，切断了鹰卫的补给。一支以CAS066为主力的舰队摧毁了鹰卫的补给与工程舰船。因此，CAS066也被称为\"采矿者杀手\"。",
   "quote": "告诉我一支舰队携带的补给，我就能告诉你他们的有效作战半径。——基恩·穆迪，《精神堡垒》首席军事官"
  },
  {
   "name": "CAS066级-支援巡洋舰",
   "variant": "D型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 18,
   "hp": 66400,
   "cruise": 500,
   "warp": 2500,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 4207,
    "antiAir": 1890,
    "siege": 685
   },
   "modules": [
    "无人机维修系统",
    "标准综合舰炮系统"
   ],
   "size": 1010,
   "maxShip": 12,
   "build": {
    "metal": 57130,
    "crystal": 5510,
    "deuterium": 3250,
    "time": 0.12,
    "capacity": 26000
   }
  }
 ],
 "永恒风暴级": [
  {
   "name": "永恒风暴级-攻击战列巡洋舰",
   "variant": "",
   "type": "战列巡洋舰",
   "position": "中排",
   "commandValue": 32,
   "hp": 146740,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 180,
   "energyArmor": 10,
   "serviceLimit": 6,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "C",
    "support": "C"
   },
   "firepower": {
    "antiShip": 61325,
    "antiAir": 19155,
    "siege": 2983
   },
   "modules": [
    "M主武器槽",
    "A投射武器槽",
    "B副炮槽",
    "C功能/生存槽",
    "D额外武器槽"
   ],
   "size": 1610,
   "maxShip": 6,
   "build": {
    "metal": 174900,
    "crystal": 49440,
    "deuterium": 29550,
    "time": 0.56,
    "capacity": 120000
   },
   "desc": "围绕一门足以贯穿任何大型舰船的大型离子炮设计的综合型战列巡洋舰。装有综合发射平台，可对各类目标进行远程攻击。可装备无人机护盾系统，提供对能量武器的全面强力防御。",
   "story": "木星的大红斑是该行星的标志性特征，已存在超过一千年。它多次改变形状与色调，却从未消失。这永恒的暴风雨从木星工业总部清晰可见，甚至被用作他们一艘舰船的名字。",
   "quote": "自然并非为了追求不朽而存在，这恰恰是它不朽的原因。——林森，自然与环境科学家，行星改造计划负责人"
  }
 ],
 "雷火之星": [
  {
   "name": "雷火之星-综合武库舰",
   "variant": "",
   "type": "战列巡洋舰",
   "position": "中排",
   "commandValue": 32,
   "hp": 154077,
   "cruise": "-",
   "warp": "-",
   "physicalArmor": 120,
   "energyArmor": 15,
   "serviceLimit": 3,
   "ratings": {
    "antiShip": "S",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "M舰首武器",
    "A快速反舰",
    "B防空拦截",
    "C能源协同",
    "D投射副武器",
    "E多目标副武器"
   ]
  }
 ],
 "新君士坦丁大帝级": [
  {
   "name": "新君士坦丁大帝级-综合战列巡洋舰",
   "variant": "",
   "type": "战列巡洋舰",
   "position": "中排",
   "commandValue": 35,
   "hp": 141550,
   "cruise": 400,
   "warp": 2000,
   "physicalArmor": 160,
   "energyArmor": 25,
   "serviceLimit": 6,
   "ratings": {
    "antiShip": "A",
    "antiAir": "-",
    "siege": "C",
    "survival": "C",
    "strategy": "B",
    "support": "B"
   },
   "firepower": {
    "antiShip": 89899,
    "antiAir": 9960,
    "siege": 0
   },
   "modules": [
    "M离子攻击系统",
    "A投射武器系统",
    "B副武器系统",
    "C能源/舰载/侦察",
    "D防护/损管/防空"
   ],
   "size": 1523,
   "maxShip": 6,
   "build": {
    "metal": 167470,
    "crystal": 47120,
    "deuterium": 28210,
    "time": 0.53,
    "capacity": 125000
   },
   "desc": "装备\"伽马风暴\"脉冲与投射武器系统，可发射常规导弹与能量脉冲导弹。舰首装有大型速射脉冲炮塔，可利用多种脉冲武器对重装甲舰船发动致命打击。可装备脉冲能量增幅系统强化舰船脉冲武器，或装备小型舰载机机库以强化防空与对小型舰船防御能力。",
   "story": "安东尼奥斯财团最初是一个私人金融集团。创始人通过兼并与收购使集团吸纳了大量中小企业和机构。其在技术、金融与舰船领域的投资取得了众多领先成果，使安东尼奥斯财团成为最具影响力的集团之一。正因如此，创始人被称为\"君士坦丁大帝\"。为纪念他，在第100届股东大会上，一艘仍在研发中的原型舰被命名为\"新君士坦丁大帝级\"。",
   "quote": "自由竞争的理念并非总对经济有利；垄断实际上有助于建立大规模经济实体，促进集中化发展。"
  }
 ],
 "ST59级": [
  {
   "name": "ST59级-防御战列巡洋舰",
   "variant": "",
   "type": "战列巡洋舰",
   "position": "中排",
   "commandValue": 28,
   "hp": 136510,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 180,
   "energyArmor": 10,
   "serviceLimit": 6,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 64613,
    "antiAir": 11615,
    "siege": 1200
   },
   "modules": [
    "M主武器",
    "A大型火炮平台",
    "B投射/舰载机",
    "C装甲防御系统"
   ],
   "size": 1520,
   "maxShip": 6,
   "build": {
    "metal": 148130,
    "crystal": 33750,
    "deuterium": 15840,
    "time": 0.38,
    "capacity": 130000
   },
   "desc": "舰首可根据不同能量系统装配不同弹道武器。默认以两门大型轨道炮作为主火力，辅以通用武器控制系统与集中式投射武器平台，并配备专用防空火炮系统。",
   "story": "ST59是灭绝者军火库中最早的战列巡洋舰之一，在建立初期大幅提升了他们的对舰作战能力。它参加过许多著名战役，包括\"收复冥王星\"与\"奥尔特云战役\"。许多后来的舰船都以其武器与无人机系统设计为基础。",
   "quote": "教育的目的是培养自主学习能力，从而使自身变得多余。——卡门·冯，赫尔曼大学教授"
  }
 ],
 "止战级": [
  {
   "name": "止战级-攻坚战列舰",
   "variant": "",
   "type": "战列舰",
   "position": "中排",
   "commandValue": 45,
   "hp": 284970,
   "cruise": "220-1200",
   "warp": 1100,
   "physicalArmor": 270,
   "energyArmor": 5,
   "serviceLimit": 3,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "M舰首主武器",
    "A反舰鱼雷",
    "B攻城武装",
    "C实验离子炮",
    "D中型反舰导弹",
    "E装甲系统",
    "F动力系统",
    "G附加功能",
    "H近防防空"
   ]
  }
 ],
 "CV3000级": [
  {
   "name": "CV3000级-快速航空母舰",
   "variant": "",
   "type": "aircraftcarrier",
   "position": "后排",
   "commandValue": 40,
   "hp": 278340,
   "cruise": 400,
   "warp": 2000,
   "physicalArmor": 15,
   "energyArmor": 15,
   "serviceLimit": 5,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "A",
    "support": "A"
   },
   "firepower": {
    "antiShip": 7700,
    "antiAir": 1234,
    "siege": 70
   },
   "modules": [
    "M舰载机搭载",
    "A武器系统",
    "B功能副系统"
   ],
   "size": 1820,
   "maxShip": 5,
   "build": {
    "metal": 214010,
    "crystal": 24600,
    "deuterium": 35050,
    "time": 0.51,
    "capacity": 150000
   },
   "desc": "通用高速航空母舰，配备通用机库与护航艇舱，可搭载5个大型战机中队与3艘护航艇。通过搭载不同类型的舰载机执行全舰队火力支援任务。装备基础炮台，预留额外导弹发射系统或护航艇舱空间。",
   "story": "在\"冥王星防御战\"（又称\"收复冥王星\"）期间，流浪兄弟会失去了他们在卡戎与尼克斯的据点。为了控制占领区，灭绝者被迫延长战线与运输路线。延长的战线和运输路线在防御线上制造了弱点，流浪兄弟会的舰队开始攻击往返于木星与海王星之间的补给舰队。数十支装备CV3000的航母舰队在战机与护航艇的支援下，",
   "quote": "战术纵深的原理是以空间换时间；空间越大，交换价值越高。——君士坦丁·朱，太阳英雄奖得主"
  }
 ],
 "普鲁图斯之盾级": [
  {
   "name": "普鲁图斯之盾级-防护战列巡洋舰",
   "variant": "",
   "type": "战列巡洋舰",
   "position": "前排",
   "commandValue": 35,
   "hp": 195006,
   "cruise": "-",
   "warp": "-",
   "physicalArmor": 240,
   "energyArmor": 5,
   "serviceLimit": 6,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "S",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "M综合武器系统",
    "A堡垒护卫系统",
    "B装甲生存系统",
    "C反击副武器"
   ]
  }
 ],
 "安东塔斯持剑者级": [
  {
   "name": "安东塔斯持剑者级-指挥舰",
   "variant": "",
   "type": "战列巡洋舰",
   "position": "中排",
   "commandValue": 35,
   "hp": 173600,
   "cruise": "-",
   "warp": "-",
   "physicalArmor": 240,
   "energyArmor": 5,
   "serviceLimit": 3,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "S"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "M蜂群无人机作战中枢",
    "A利剑指挥系统",
    "B武器/护航艇搭载",
    "C装甲生存系统",
    "D副武器导弹"
   ]
  }
 ],
 "乌拉诺斯之矛": [
  {
   "name": "乌拉诺斯之矛",
   "variant": "",
   "type": "战列巡洋舰",
   "position": "前排",
   "commandValue": 35,
   "hp": 180470,
   "cruise": 250,
   "warp": 1250,
   "physicalArmor": 240,
   "energyArmor": 5,
   "serviceLimit": 6,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "A",
    "survival": "B",
    "strategy": "B",
    "support": "C"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "M舰首主武器",
    "A堡垒火炮系统",
    "B新增功能系统",
    "C防御/辅助系统"
   ],
   "size": 1805,
   "maxShip": 6,
   "build": {
    "metal": 185870,
    "crystal": 49430,
    "deuterium": 24440,
    "time": 0.54,
    "capacity": 115000
   },
   "desc": "装备攻城轨道炮、大型炮台、中型炮台与防空炮台的弹道武器突击战列巡洋舰。弹道火力堪比战列舰，防空能力出色。可改装补充离子武器与投射武器并搭载护航艇舱。独特的强化纳米装甲大幅提升对弹道武器的抗性。",
   "story": "诺玛运输集团前身是四家独立公司，分别经营短途运输、长途物流、舰船研发与安保业务。他们曾是激烈的商业竞争对手。经过一系列整合与重组，诺玛运输集团的名字取自四家原始公司名称的首字母。\"乌拉诺斯之矛\"研究项目也在同年成立。在诺玛运输集团百年庆典阅兵式上，这艘历经多次迭代的百年老舰被高管们检阅，被誉为\"舰船之\"",
   "quote": "模仿与协作是对竞争者最好的赞美。——古勒·萨莫伊洛夫，运筹学博士，诺玛运输集团总裁"
  }
 ],
 "不屈级": [
  {
   "name": "不屈级-TE-导弹战列巡洋舰",
   "variant": "",
   "type": "战列巡洋舰",
   "position": "中排",
   "commandValue": 30,
   "hp": 136510,
   "cruise": 250,
   "warp": 1250,
   "physicalArmor": 90,
   "energyArmor": 15,
   "serviceLimit": 4,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 18969,
    "antiAir": 1964,
    "siege": 1409
   },
   "modules": [
    "凛冽寒风MK2-火箭发射系统",
    "舰首轨道炮系统"
   ],
   "size": 1500,
   "maxShip": 6,
   "build": {
    "metal": 148500,
    "crystal": 33950,
    "deuterium": 15910,
    "time": 0.38,
    "capacity": 130000
   },
   "desc": "神圣群星帝国陆军主力导弹战列巡洋舰，可在短时间内发射大量导弹造成压倒性伤害。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  }
 ],
 "天权级": [
  {
   "name": "天权级-重型防御战列巡洋舰",
   "variant": "",
   "type": "战列巡洋舰",
   "position": "中排",
   "commandValue": 35,
   "hp": 191970,
   "cruise": "250-1200",
   "warp": 1250,
   "physicalArmor": 240,
   "energyArmor": 5,
   "serviceLimit": 6,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "M防御系统(掩护护航艇)",
    "A主武器发射",
    "B副系统",
    "C功能系统"
   ]
  }
 ],
 "太阳鲸": [
  {
   "name": "太阳鲸-武装战略航空母舰",
   "variant": "",
   "type": "aircraftcarrier",
   "position": "中排",
   "commandValue": 45,
   "hp": 329430,
   "cruise": 250,
   "warp": 1250,
   "physicalArmor": 15,
   "energyArmor": 15,
   "serviceLimit": 5,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 20527,
    "antiAir": 3217,
    "siege": 630
   },
   "modules": [
    "M主槽载机",
    "A武器系统",
    "B功能模块",
    "C拓展模块"
   ],
   "size": 2200,
   "maxShip": 5,
   "build": {
    "metal": 299780,
    "crystal": 46990,
    "deuterium": 48130,
    "time": 0.78,
    "capacity": 130000
   },
   "desc": "遵循诺玛银河设计局的设计理念打造的大型航空母舰，综合战斗能力出众。拥有大型独立护航艇舱，可从中发动强力攻击。",
   "story": "在守护者部队控制的星系中，大部分没有双向拉格朗日之门，有些难以通过现有拉格朗日网络到达。这种偏远为其赢得了\"边疆军团\"的绰号。诺玛运输集团是最早向守护者部队授权技术与蓝图的组织之一。获授权的太阳鲸航空母舰大幅提升了他们的远程作战与舰载机作战能力。作为交换，他们允许诺玛运输集团参与其控制范围内多个拉格朗日网络的研究。",
   "quote": "星系间的距离由它们在拉格朗日网络中的相对位置决定。——《拉格朗日网络的迷宫特性》"
  }
 ],
 "天枢级": [
  {
   "name": "天枢级-支援航空母舰",
   "variant": "",
   "type": "aircraftcarrier",
   "position": "后排",
   "commandValue": 40,
   "hp": 349274,
   "cruise": "250-1200",
   "warp": 1250,
   "physicalArmor": 15,
   "energyArmor": 15,
   "serviceLimit": 5,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "M联合作战平台",
    "A北斗维修无人机",
    "B载机拓展",
    "C功能辅助",
    "D防御/防空"
   ]
  }
 ],
 "永恒苍穹级": [
  {
   "name": "永恒苍穹级-无人机航空母舰",
   "variant": "",
   "type": "aircraftcarrier",
   "position": "后排",
   "commandValue": 40,
   "hp": 298690,
   "cruise": "350-1200",
   "warp": 1750,
   "physicalArmor": 15,
   "energyArmor": 15,
   "serviceLimit": 5,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "M联合作战机库",
    "A主炮武器",
    "B反舰/防御/防空",
    "C载机拓展/维修"
   ]
  }
 ],
 "南十字星元帅级": [
  {
   "name": "南十字星元帅级-武装航空母舰",
   "variant": "",
   "type": "aircraftcarrier",
   "position": "后排",
   "commandValue": 40,
   "hp": 278340,
   "cruise": 400,
   "warp": 2000,
   "physicalArmor": 15,
   "energyArmor": 15,
   "serviceLimit": 5,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "B",
    "support": "B"
   },
   "firepower": {
    "antiShip": 11380,
    "antiAir": 1356,
    "siege": 770
   },
   "modules": [
    "M武器模块",
    "A载机模块",
    "B功能增益",
    "C拓展模块"
   ],
   "size": 2180,
   "maxShip": 5,
   "build": {
    "metal": 265890,
    "crystal": 45340,
    "deuterium": 39410,
    "time": 0.7,
    "capacity": 150000
   },
   "desc": "安东尼奥斯财团建造的航空母舰，配备通用机库与护航艇舱，强化反舰火力。舰上装备舰载机支援系统，可增强所搭载舰载机的能量武器伤害。",
   "story": "安东尼奥斯财团最初专注于金融与航运服务，其业务活动的安保事务全部外包。随着业务增长，激增的安保需求使现有安保体系难以为继。在舰船制造部门董事会成员巴厘·克鲁克斯的推动下，财团依托其舰船制造工业建立了一支规模可观的舰队。这支舰队不仅为安东尼奥斯财团日益增长的业务提供支持，还为各类舰船创造了持续需求。",
   "quote": "当资本意识到自己身处危险时，他们就会在整个银河系打造最强大的武装力量。——巴厘·克鲁克斯，舰队第一指挥官"
  }
 ],
 "FSV380支援舰": [
  {
   "name": "FSV380支援舰",
   "variant": "",
   "type": "support",
   "position": "后排",
   "commandValue": 40,
   "hp": 180470,
   "cruise": "-",
   "warp": "-",
   "physicalArmor": 15,
   "energyArmor": 15,
   "serviceLimit": 2,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "-",
    "survival": "B",
    "strategy": "S"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 270,
    "siege": 0
   },
   "modules": [
    "综合支援平台(固定)",
    "A生产模块",
    "B指挥模块",
    "C工程模块",
    "D载机/维修",
    "E防空/载机"
   ]
  }
 ],
 "埃迪卡拉级": [
  {
   "name": "埃迪卡拉级-重型火力支援舰",
   "variant": "",
   "type": "support",
   "position": "后排",
   "commandValue": 40,
   "hp": 240460,
   "cruise": "-",
   "warp": "-",
   "physicalArmor": 15,
   "energyArmor": 15,
   "serviceLimit": 2,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "B",
    "survival": "A",
    "strategy": "S"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "M主武器槽",
    "A生产槽",
    "B无人机槽",
    "C载机槽",
    "D防御槽"
   ]
  }
 ],
 "愤怒级": [
  {
   "name": "愤怒级-快速护卫舰",
   "variant": "通用型",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 5,
   "hp": 10530,
   "cruise": 1100,
   "warp": 5500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "B",
    "support": "C"
   },
   "firepower": {
    "antiShip": 3150,
    "antiAir": 461,
    "siege": 333
   },
   "modules": [
    "主炮武器系统",
    "通用火炮系统"
   ],
   "size": 215,
   "maxShip": 10,
   "build": {
    "metal": 9210,
    "crystal": 680,
    "deuterium": 130,
    "time": 0.01,
    "capacity": 2500
   },
   "desc": "神圣群星帝国海军护卫舰，曾在防御任务中担任主力。以3门速射火炮为主要武器，可直接攻击正前方目标。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  },
  {
   "name": "愤怒级-鱼雷护卫舰",
   "variant": "鱼雷型",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 5,
   "hp": 10530,
   "cruise": 950,
   "warp": 4750,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "B",
    "support": "C"
   },
   "firepower": {
    "antiShip": 4830,
    "antiAir": 837,
    "siege": 150
   },
   "modules": [
    "鱼雷发射系统"
   ],
   "size": 302,
   "maxShip": 10,
   "build": {
    "metal": 10910,
    "crystal": 900,
    "deuterium": 150,
    "time": 0.01,
    "capacity": 2200
   },
   "desc": "神圣群星帝国海军护卫舰，曾在防御任务中担任主力。左舷主炮被替换为鱼雷发射管，成为可在战场游走攻击敌方主力舰的战术资产。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  }
 ],
 "维塔斯": [
  {
   "name": "维塔斯-B010-轰炸机",
   "variant": "对舰型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 5860,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "S",
    "antiAir": "-",
    "siege": "A",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 2863,
    "antiAir": 0,
    "siege": 1059
   },
   "modules": [
    "等离子轰炸系统"
   ],
   "size": 100,
   "maxShip": 10,
   "build": {
    "metal": 9260,
    "crystal": 880,
    "deuterium": 270,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "维塔斯工坊的特种战术轰炸机。可进行近程等离子轰击，对敌舰造成大量能量伤害。主要用于攻击超大型敌方目标。特殊伪装装甲赋予其高生存能力。",
   "story": "安东尼奥斯财团维塔斯研究项目的成果。它是行业领先的轰炸机，因武器效果而得名\"闪电\"。目前仅授权给项目参与者使用。",
   "quote": "制定计划的行为本身比计划更重要。——伊什特万，维塔斯项目投资人"
  }
 ],
 "维塔斯A021": [
  {
   "name": "维塔斯A021-重型攻击机",
   "variant": "对舰型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 5370,
   "cruise": 3300,
   "warp": 16500,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 3501,
    "antiAir": 1272,
    "siege": 2850
   },
   "modules": [
    "精确攻击系统",
    "反击火炮系统"
   ],
   "size": 60,
   "maxShip": 10,
   "build": {
    "metal": 8960,
    "crystal": 890,
    "deuterium": 320,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "用高爆炸弹打击敌舰。特殊探测系统与弹头可进行精准打击，同时伤害舰船子系统。机身以复合装甲强化，提升生存能力。",
   "story": "安东尼奥斯财团资助的维塔斯研究项目的成果。该项目还吸纳了数十家中小企业和武器制造商作为投资者。A021攻击机是研究项目第一阶段的成果之一。",
   "quote": "计划本身必须加以管理和修改，才能作为制定战略决策的工具服务于其创造者。——裴多菲，维塔斯项目首席科学家"
  }
 ],
 "S": [
  {
   "name": "S-列维9号-重型鱼雷艇",
   "variant": "对舰型",
   "type": "护航艇",
   "position": "前排",
   "commandValue": 2,
   "hp": 6000,
   "cruise": 2400,
   "warp": 12000,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "A",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3950,
    "antiAir": 0,
    "siege": 1911
   },
   "modules": [
    "机载投弹系统"
   ],
   "size": 80,
   "maxShip": 10,
   "build": {
    "metal": 4050,
    "crystal": 410,
    "deuterium": 120,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "木星工业开发的彗星护卫护航艇系列装备三座舰载鱼雷发射器，可近距离打击敌方目标。鱼雷弹头专为对动能装甲具有卓越破坏力而设计。所用鱼雷为超新星反舰鱼雷的舰载版本，威力极强但数量有限，因此护航艇需定期返航装填。",
   "story": "银河战争期间，为应对日益紧张的战争局势与激增的军舰订单，木星工业集团建立了SL第九造船厂，承接集团部分舰船的设计与生产。SL第九造船厂设计的第一艘舰是S-列维9号重型鱼雷护卫舰，以纪念木星轨道上因彗星撞击而诞生的伟大城市——苏梅克-列维9号太空城。",
   "quote": "即使有一天我们不再前进，我也希望我们过去的成就能像SL9那样宏大而令人敬畏，永远铭刻。"
  }
 ],
 "CV": [
  {
   "name": "CV-T800型-脉冲炮艇",
   "variant": "对空A型",
   "type": "护航艇",
   "position": "前排",
   "commandValue": 2,
   "hp": 7500,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "siege": "C",
    "survival": "B",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 2782,
    "antiAir": 2226,
    "siege": 55
   },
   "modules": [
    "机载武器系统"
   ],
   "size": 75,
   "maxShip": 15,
   "build": {
    "metal": 4800,
    "crystal": 280,
    "deuterium": 60,
    "time": 0,
    "capacity": 0
   },
   "desc": "作为轻型脉冲星护航艇，可轻松穿梭战场，用舰载脉冲炮塔精确击落来袭战机。",
   "story": "神圣群星帝国解体后，其技术与实物资产被各方势力瓜分并消耗殆尽。从帝国衰落与灭亡中汲取的教训也不断推动新势力的发展。这一阶段也被称为\"后拉格朗日时代\"。",
   "quote": "从社会衰落中汲取的知识是最有效的进步工具。——文哲，宇宙哲学家"
  },
  {
   "name": "CV-M011型-重型导弹艇",
   "variant": "导弹A型",
   "type": "护航艇",
   "position": "前排",
   "commandValue": 2,
   "hp": 7500,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 2187,
    "antiAir": 837,
    "siege": 240
   },
   "modules": [
    "导弹攻击系统",
    "防空火炮系统"
   ],
   "size": 105,
   "maxShip": 15,
   "build": {
    "metal": 4590,
    "crystal": 320,
    "deuterium": 60,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "装备中型突击火炮，可对中小型舰船发动快速近程攻击。其防空炮台还能攻击邻近的敌方舰载机。",
   "story": "CV-M011护航艇，全称中型护航艇011型，是基于第一代护航艇技术的011型型号。",
   "quote": "中立有两种：一种是不在乎站队的结果，另一种是缺乏发声的力量。——战神军团谚语"
  },
  {
   "name": "CV-M011型-重炮艇",
   "variant": "火炮B型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 7500,
   "cruise": "2500",
   "warp": "-",
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 2444,
    "antiAir": 837,
    "siege": 297
   },
   "modules": [
    "火炮攻击系统",
    "防空火炮系统"
   ]
  },
  {
   "name": "CV-M011型-高速导弹艇",
   "variant": "高速C型",
   "type": "护航艇",
   "position": "前排",
   "commandValue": 2,
   "hp": 7500,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 1206,
    "antiAir": 1008,
    "siege": 130
   },
   "modules": [
    "精确制导系统",
    "反击火炮系统"
   ],
   "size": 105,
   "maxShip": 15,
   "build": {
    "metal": 5260,
    "crystal": 410,
    "deuterium": 70,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "装备高机动轻型导弹发射器，可快速拦截入侵的敌方舰载机，并提供规避攻击的能力。",
   "story": "CV-M011护航艇，全称中型护航艇011型，是基于第一代护航艇技术的011型型号。",
   "quote": "中立有两种：一种是不在乎站队的结果，另一种是缺乏发声的力量。——战神军团谚语"
  }
 ],
 "游骑兵级": [
  {
   "name": "游骑兵级-综合作战巡洋舰",
   "variant": "A型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 18,
   "hp": 73260,
   "cruise": "500-1200",
   "warp": 2500,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 7840,
    "antiAir": 3258,
    "siege": 2223
   },
   "modules": [
    "舰首重炮系统",
    "综合投射系统"
   ]
  },
  {
   "name": "游骑兵级-重型离子炮巡洋舰",
   "variant": "B型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 18,
   "hp": 73260,
   "cruise": "400-1200",
   "warp": 2000,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "S",
    "antiAir": "-",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 17679,
    "antiAir": 0,
    "siege": 2032
   },
   "modules": [
    "伽马风暴离子攻击系统",
    "能量投射系统"
   ]
  }
 ],
 "KCCPV2.0": [
  {
   "name": "KCCPV2.0-轻型攻击巡洋舰",
   "variant": "A型",
   "type": "巡洋舰",
   "position": "后排",
   "commandValue": 16,
   "hp": 52040,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 12,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "B",
    "support": "B"
   },
   "firepower": {
    "antiShip": 9604,
    "antiAir": 4170,
    "siege": 481
   },
   "modules": [
    "综合投射武器系统"
   ],
   "size": 800,
   "maxShip": 12,
   "build": {
    "metal": 49310,
    "crystal": 5370,
    "deuterium": 2950,
    "time": 0.11,
    "capacity": 22000
   },
   "desc": "该型号装备舰载机系统，可搭载舰载机并释放进行远程攻击。",
   "story": "这艘舰的研发计划最早可追溯到神圣群星帝国时期，旨在为帝国提供一艘强大的战斗巡洋舰。帝国覆灭后研发计划中断。原始蓝图与相关资料在各方势力间辗转流传，经过多年的转手，设计才最终完成。这艘舰也被称为\"神圣群星帝国的最后遗产\"。",
   "quote": "我来，我见，我征服。这是我的座右铭。——无名墓碑"
  },
  {
   "name": "KCCPV2.0-轻型脉冲攻击巡洋舰",
   "variant": "B型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 16,
   "hp": 52040,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 12,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 11314,
    "antiAir": 642,
    "siege": 932
   },
   "modules": [
    "快速脉冲炮系统",
    "通用投射武器平台"
   ]
  },
  {
   "name": "KCCPV2.0-轻型轨道炮巡洋舰",
   "variant": "C型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 16,
   "hp": 52040,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 12,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 8280,
    "antiAir": 0,
    "siege": 6300
   },
   "modules": [
    "舰首火炮系统"
   ]
  },
  {
   "name": "KCCPV2.0-轻型载机巡洋舰",
   "variant": "D型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 16,
   "hp": 52040,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 12,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 4114,
    "antiAir": 642,
    "siege": 428
   },
   "modules": [
    "战机搭载系统",
    "通用投射武器平台"
   ]
  }
 ],
 "奇美拉级": [
  {
   "name": "奇美拉级-重型巡洋舰",
   "variant": "A型",
   "type": "巡洋舰",
   "position": "前排",
   "commandValue": 20,
   "hp": 89390,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 80,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 14567,
    "antiAir": 1993,
    "siege": 80
   },
   "modules": [
    "堡垒火炮系统",
    "导弹攻击系统"
   ],
   "size": 1110,
   "maxShip": 8,
   "build": {
    "metal": 72280,
    "crystal": 10650,
    "deuterium": 3140,
    "time": 0.15,
    "capacity": 20000
   },
   "desc": "装备强大综合火炮/导弹攻击系统的巡洋舰。右舷安装多门高性能火炮，左舷安装垂直导弹发射系统。在突击与遭遇战中担任轰击单位。",
   "story": "探索者联盟最先发现了米特拉斯星系内的流放者遗迹。此后，仲裁委员会、探索者联盟与海雷丁家族都向管理该星系的守护者部队申请调查许可。然而，当这些请求屡次被拒后，海雷丁家族的武装调查舰不顾禁令展开了调查。当守护者部队的最后警告无人回应时，其奇美拉巡洋舰开火摧毁了海雷丁家族的调查舰。冲突很快升级为双方之间的全面战斗。",
   "quote": "信仰因怀疑而被抛弃；被接纳的怀疑则成为信仰。循环往复。——文哲，宇宙哲学家"
  },
  {
   "name": "奇美拉级-火炮巡���舰",
   "variant": "B型",
   "type": "巡洋舰",
   "position": "前排",
   "commandValue": 20,
   "hp": 89390,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 80,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 8850,
    "antiAir": 1282,
    "siege": 80
   },
   "modules": [
    "堡垒火炮系统SP"
   ],
   "size": 1110,
   "maxShip": 8,
   "build": {
    "metal": 80370,
    "crystal": 9220,
    "deuterium": 2560,
    "time": 0.13,
    "capacity": 25000
   },
   "desc": "将原有的反舰导弹发射器替换为重型火炮，与中型火炮协同齐射。",
   "story": "探索者联盟最先发现了米特拉斯星系内的流放者遗迹。此后，仲裁委员会、探索者联盟与海雷丁家族都向管理该星系的守护者部队申请调查许可。然而，当这些请求屡次被拒后，海雷丁家族的武装调查舰不顾禁令展开了调查。当守护者部队的最后警告无人回应时，其奇美拉巡洋舰开火摧毁了海雷丁家族的调查舰。冲突很快升级为双方之间的全面战斗。",
   "quote": "信仰因怀疑而被抛弃；被接纳的怀疑则成为信仰。循环往复。——文哲，宇宙哲学家"
  },
  {
   "name": "奇美拉级-防御巡洋舰",
   "variant": "C型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 20,
   "hp": 97270,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 130,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 7650,
    "antiAir": 1102,
    "siege": 0
   },
   "modules": [
    "综合武器库"
   ],
   "size": 1110,
   "maxShip": 8,
   "build": {
    "metal": 85680,
    "crystal": 8100,
    "deuterium": 2660,
    "time": 0.13,
    "capacity": 25000
   },
   "desc": "将右舷火炮替换为重型装甲模块以提升生存能力。",
   "story": "探索者联盟最先发现了米特拉斯星系内的流放者遗迹。此后，仲裁委员会、探索者联盟与海雷丁家族都向管理该星系的守护者部队申请调查许可。然而，当这些请求屡次被拒后，海雷丁家族的武装调查舰不顾禁令展开了调查。当守护者部队的最后警告无人回应时，其奇美拉巡洋舰开火摧毁了海雷丁家族的调查舰。冲突很快升级为双方之间的全面战斗。",
   "quote": "信仰因怀疑而被抛弃；被接纳的怀疑则成为信仰。循环往复。——文哲，宇宙哲学家"
  }
 ],
 "警惕级": [
  {
   "name": "警惕级-战术驱逐舰",
   "variant": "通用型A",
   "type": "驱逐舰",
   "position": "后排",
   "commandValue": 8,
   "hp": 34140,
   "cruise": 800,
   "warp": 4000,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 1000,
    "antiAir": 168,
    "siege": 42
   },
   "modules": [
    "近防系统"
   ],
   "size": 550,
   "maxShip": 10,
   "build": {
    "metal": 21360,
    "crystal": 1430,
    "deuterium": 860,
    "time": 0.04,
    "capacity": 12000
   },
   "desc": "神圣群星帝国海军驱逐舰，担任大型舰队的护航。装备小型舰载机机库与2门通用火炮，可对敌舰进行反击。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  }
 ],
 "凛冽级": [
  {
   "name": "凛冽级-导弹驱逐舰",
   "variant": "通用型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 10,
   "hp": 27230,
   "cruise": 850,
   "warp": 4250,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "B",
    "support": "C"
   },
   "firepower": {
    "antiShip": 6205,
    "antiAir": 800,
    "siege": 752
   },
   "modules": [
    "凛冽寒风火箭发射系统",
    "通用火炮系统"
   ],
   "size": 490,
   "maxShip": 10,
   "build": {
    "metal": 21450,
    "crystal": 2750,
    "deuterium": 480,
    "time": 0.04,
    "capacity": 11500
   },
   "desc": "神圣群星帝国海军担任主力火力的驱逐舰。装备\"凛冽寒风\"导弹发射系统，可对大型目标进行持续攻击。舰首舰尾各安装一座炮台，为对付小型目标提供额外火力。并携带强化装甲系统以提升战场防御。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  },
  {
   "name": "凛冽级-防御驱逐舰",
   "variant": "导弹型B",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 10,
   "hp": 25650,
   "cruise": 850,
   "warp": 4250,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "A",
    "strategy": "B",
    "support": "C"
   },
   "firepower": {
    "antiShip": 3134,
    "antiAir": 512,
    "siege": 102
   },
   "modules": [
    "凛冽寒风火箭发射系统",
    "通用火炮系统"
   ],
   "size": 490,
   "maxShip": 10,
   "build": {
    "metal": 21590,
    "crystal": 2430,
    "deuterium": 670,
    "time": 0.04,
    "capacity": 11500
   },
   "desc": "神圣群星帝国海军担任主力火力的驱逐舰。装备\"凛冽寒风\"导弹发射系统，可对大型目标进行持续攻击。舰首舰尾各安装一座炮台，为对付小型目标提供额外火力。并携带强化装甲系统以提升战场防御。此改进型号增加综合防御雷达阵列，为舰船提供防空能力。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  },
  {
   "name": "凛冽级-TE-高速导弹驱逐舰",
   "variant": "通用型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 27230,
   "cruise": "1000-1200",
   "warp": 5000,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 8,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 6205,
    "antiAir": 1501,
    "siege": 752
   },
   "modules": [
    "凛冽寒风火箭发射系统",
    "通用火炮系统"
   ]
  }
 ],
 "灼热级": [
  {
   "name": "灼热级-重炮突击舰",
   "variant": "通用型A",
   "type": "驱逐舰",
   "position": "前排",
   "commandValue": 7,
   "hp": 31240,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 4656,
    "antiAir": 540,
    "siege": 816
   },
   "modules": [
    "重型火炮系统",
    "小型火炮系统"
   ]
  },
  {
   "name": "灼热级-战术突击舰",
   "variant": "B型",
   "type": "驱逐舰",
   "position": "前排",
   "commandValue": 7,
   "hp": 31240,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "A",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3800,
    "antiAir": 2025,
    "siege": 700
   },
   "modules": [
    "重型火炮系统",
    "小型火炮系统"
   ]
  },
  {
   "name": "灼热级-TE-重型火炮突击舰",
   "variant": "通用型A",
   "type": "驱逐舰",
   "position": "前排",
   "commandValue": 8,
   "hp": 44310,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 20,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "B",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 9135,
    "antiAir": 1485,
    "siege": 1023
   },
   "modules": [
    "舰首联合重炮系统",
    "小型火炮系统"
   ]
  },
  {
   "name": "灼热级-TE-重型鱼雷突击舰",
   "variant": "鱼雷型",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 8,
   "hp": 44310,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 20,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "S",
    "antiAir": "-",
    "siege": "B",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 8163,
    "antiAir": 0,
    "siege": 1986
   },
   "modules": [
    "反舰鱼雷系统",
    "投射武器系统"
   ]
  }
 ],
 "亚达伯拉级": [
  {
   "name": "亚达伯拉级-重型防空驱逐舰",
   "variant": "防空型C",
   "type": "驱逐舰",
   "position": "前排",
   "commandValue": 8,
   "hp": 37090,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 4,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "A",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 5820,
    "antiAir": 1419,
    "siege": 8140
   },
   "modules": [
    "堡垒防空火炮系统",
    "近防系统"
   ],
   "size": 520,
   "maxShip": 10,
   "build": {
    "metal": 28990,
    "crystal": 2970,
    "deuterium": 660,
    "time": 0.05,
    "capacity": 7000
   },
   "desc": "强化侧舷装甲并改装主火力。在舰体两侧安装罕见的固定式重型炮台发射密集弹幕，提升攻城能力。由于没有旋转功能，该重型炮台对中小型目标效果有限。",
   "story": "诺玛运输集团从物流业起家，在大型舰船与民用舰船的设计制造方面拥有雄厚的技术实力。它曾被评价为\"不擅长设计小型舰船\"。然而在过去几十年里，其研发部门不断推出令人惊叹的护卫舰与驱逐舰型号，在诺玛运输集团百年庆典阅兵式上大放异彩。亚达伯拉驱逐舰就是近年推出的优秀型号之一。",
   "quote": "被轻视是一种巨大的战略优势。——佐尔坦·李，诺玛运输集团首席战略官"
  },
  {
   "name": "亚达伯拉级-重型火炮驱逐舰",
   "variant": "通用型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 8,
   "hp": 37090,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 4,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "C",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 5820,
    "antiAir": 2600,
    "siege": 775
   },
   "modules": [
    "堡垒火炮系统",
    "近防系统"
   ]
  },
  {
   "name": "亚达伯拉级-重型攻坚驱逐舰",
   "variant": "装甲型B",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 8,
   "hp": 40799,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 4,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 5280,
    "antiAir": 1012,
    "siege": 1048
   },
   "modules": [
    "堡垒火炮系统"
   ]
  }
 ],
 "严酷级": [
  {
   "name": "严酷级-攻坚护卫舰",
   "variant": "通用型",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 5,
   "hp": 12540,
   "cruise": 1050,
   "warp": 5250,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "B",
    "support": "C"
   },
   "firepower": {
    "antiShip": 3150,
    "antiAir": 1361,
    "siege": 65
   },
   "modules": [
    "舰首轨道炮系统",
    "快速火炮系统"
   ],
   "size": 260,
   "maxShip": 10,
   "build": {
    "metal": 10080,
    "crystal": 740,
    "deuterium": 140,
    "time": 0.01,
    "capacity": 2500
   },
   "desc": "神圣群星帝国海军护卫舰，曾用于执行特种打击任务。舰首轨道炮提供击毁大型或重装甲目标的火力，速射炮台作为防御武器。在特殊战斗中是非凡的攻城单位。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  }
 ],
 "XT": [
  {
   "name": "XT-8级-两栖登陆舰",
   "variant": "攻城型",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 7070,
   "cruise": "1000-1200",
   "warp": 5000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "A",
    "support": "A"
   },
   "firepower": {
    "antiShip": 246,
    "antiAir": 101,
    "siege": 1530
   },
   "modules": [
    "攻城无人机系统",
    "防卫系统"
   ],
   "desc": "由X20工程舰改装而来的辅助巡洋舰，被私掠者用作指挥舰。原有的采矿支援设施被改装为维修坞，可在战场上提供战术支援。",
   "story": "银河战争期间，安东塔斯城的部分外部建筑被XT-20搭载的护航艇摧毁。在战后城市修缮中，安东尼奥斯财团借助一张古老的建筑设计图恢复了城市的原始风貌。",
   "quote": "建筑之美依赖于强大先进的技术，而无能糟糕的设计师才是建筑丑陋的罪魁祸首。——马库斯"
  },
  {
   "name": "XT-20级-护航巡洋舰",
   "variant": "运载型A",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 14,
   "hp": 57510,
   "cruise": "600-1200",
   "warp": 3000,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "-",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 2880,
    "antiAir": 0,
    "siege": 97
   },
   "modules": [
    "舰载机平台",
    "防御火炮系统"
   ]
  },
  {
   "name": "XT-20级-载机巡洋舰",
   "variant": "载机型B",
   "type": "巡洋舰",
   "position": "后排",
   "commandValue": 14,
   "hp": 57510,
   "cruise": 600,
   "warp": 3000,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "A",
    "support": "A"
   },
   "firepower": {
    "antiShip": 3600,
    "antiAir": 1234,
    "siege": 288
   },
   "modules": [
    "舰载机系统",
    "防御火炮系统"
   ],
   "size": 850,
   "maxShip": 10,
   "build": {
    "metal": 33720,
    "crystal": 3670,
    "deuterium": 2080,
    "time": 0.07,
    "capacity": 25000
   },
   "desc": "由X20工程舰改装而来的军用舰船，被私掠者广泛使用。在原设计基础上增加简易舰载机机库与维修坞，可搭载舰载机。",
   "story": "银河战争期间，安东塔斯城的部分外部建筑被XT-20搭载的护航艇摧毁。在战后城市修缮中，安东尼奥斯财团借助一张古老的建筑设计图恢复了城市的原始风貌。",
   "quote": "建筑之美依赖于强大先进的技术，而无能糟糕的设计师才是建筑丑陋的罪魁祸首。——马库斯"
  },
  {
   "name": "XT-20级-支援巡洋舰",
   "variant": "支援型C",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 14,
   "hp": 57510,
   "cruise": "600-1200",
   "warp": 3000,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 2880,
    "antiAir": 4608,
    "siege": 97
   },
   "modules": [
    "支援无人机系统",
    "防御火炮系统"
   ]
  },
  {
   "name": "XT-6级-火炮护卫舰",
   "variant": "火炮型A",
   "type": "护卫舰",
   "position": "后排",
   "commandValue": 14,
   "hp": 57510,
   "cruise": 600,
   "warp": 3000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "A",
    "support": "S"
   },
   "firepower": {
    "antiShip": 1157,
    "antiAir": 1735,
    "siege": 270
   },
   "modules": [
    "快速火炮系统"
   ],
   "size": 850,
   "maxShip": 10,
   "build": {
    "metal": 33720,
    "crystal": 3670,
    "deuterium": 2080,
    "time": 0.07,
    "capacity": 25000
   },
   "desc": "由X20工程舰改装而来的军用舰船，被私掠者广泛使用。搭载护航艇并装备防御火炮以提升防御能力。",
   "story": "银河战争期间，安东塔斯城的部分外部建筑被XT-20搭载的护航艇摧毁。在战后城市修缮中，安东尼奥斯财团借助一张古老的建筑设计图恢复了城市的原始风貌。",
   "quote": "建筑之美依赖于强大先进的技术，而无能糟糕的设计师才是建筑丑陋的罪魁祸首。——马库斯"
  },
  {
   "name": "XT-11级-导弹驱逐舰",
   "variant": "导弹型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 31240,
   "cruise": "800-1200",
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "A",
    "siege": "C",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3300,
    "antiAir": 1462,
    "siege": 345
   },
   "modules": [
    "FK-200S垂直发射系统",
    "通用火炮系统"
   ]
  },
  {
   "name": "XT-10级-武装鱼雷驱逐舰",
   "variant": "鱼雷型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 10,
   "hp": 25650,
   "cruise": 850,
   "warp": 4250,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 5659,
    "antiAir": 1791,
    "siege": 80
   },
   "modules": [
    "永远的北极星投射系统",
    "通用火炮系统"
   ],
   "size": 490,
   "maxShip": 10,
   "build": {
    "metal": 24810,
    "crystal": 3170,
    "deuterium": 810,
    "time": 0.05,
    "capacity": 11500
   },
   "desc": "由X10工程舰改装而来。工程无人机舱与储存空间被改装为弹药库。此外加装了走私版\"永恒北极星\"投射系统，提供可观的反舰火力。",
   "story": "由安东尼奥斯财团开发的集束鱼雷攻击技术成果\"永恒北极星\"投射发射系统，能够对舰船造成极高伤害。财团只与少数亲密盟友签署了该技术的授权共享协议。然而近年来，其技术授权与复制品出现在跳蚤市场上，数量有限，短时间内被匿名高价买走。安东尼奥斯财团展开了一系列调查，却一无所获。不久后，XT10鱼雷驱逐舰",
   "quote": "我们共享技术的起源与发展道路，却不共享社会与文化。或许这就是战争的根源。——科尼·冯，首席"
  }
 ],
 "诺玛M470级": [
  {
   "name": "诺玛M470级-支援护卫舰",
   "variant": "支援型B",
   "type": "护卫舰",
   "position": "后排",
   "commandValue": 6,
   "hp": 14000,
   "cruise": 800,
   "warp": 4000,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 200,
    "antiAir": 71,
    "siege": 138
   },
   "modules": [
    "维修无人机保障系统"
   ],
   "size": 296,
   "maxShip": 10,
   "build": {
    "metal": 10230,
    "crystal": 650,
    "deuterium": 350,
    "time": 0.02,
    "capacity": 2000
   },
   "desc": "搭载1个工程无人机维护舱，仅装备少量防御武器。其RT-1无人机可在战斗中维修友方舰船。",
   "story": "战神军团与鹰卫围绕资源行星普里西拉的冲突引发了一场大规模战争。鹰卫无法迅速攻占普里西拉，于是佯装撤退并留下舰船作为诱饵。战神军团派出防御舰队越过防线追击，同时用工程舰将战利品拖回行星表面，削弱了自身防线。鹰卫组织了一支以M470护卫舰为主的登陆舰队，集中攻击行星表面的关键防御设施。这成为了战争的转折点。",
   "quote": "为恐惧所困时前进；为贪婪与疯狂所触动时撤退。——鹰卫三大军规·第二条"
  },
  {
   "name": "诺玛M470级-防空护卫舰",
   "variant": "防空型C",
   "type": "护卫舰",
   "position": "后排",
   "commandValue": 6,
   "hp": 14000,
   "cruise": 800,
   "warp": 4000,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "siege": "C",
    "survival": "B",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 200,
    "antiAir": 71,
    "siege": 4638
   },
   "modules": [
    "防空无人机支援系统"
   ],
   "size": 296,
   "maxShip": 10,
   "build": {
    "metal": 9440,
    "crystal": 560,
    "deuterium": 320,
    "time": 0.02,
    "capacity": 2000
   },
   "desc": "搭载1个防空无人机舱。其DT-1无人机在战斗中为友方舰船提供防空支援。需要靠近己方舰船才能提供支援。",
   "story": "战神军团与鹰卫围绕资源行星普里西拉的冲突引发了一场大规模战争。鹰卫无法迅速攻占普里西拉，于是佯装撤退并留下舰船作为诱饵。战神军团派出防御舰队越过防线追击，同时用工程舰将战利品拖回行星表面，削弱了自身防线。鹰卫组织了一支以M470护卫舰为主的登陆舰队，集中攻击行星表面的关键防御设施。这成为了战争的转折点。",
   "quote": "为恐惧所困时前进；为贪婪与疯狂所触动时撤退。——鹰卫三大军规·第二条"
  },
  {
   "name": "诺玛M470级-重型登陆舰（攻城型A）",
   "variant": "重型登陆舰",
   "type": "护卫舰",
   "position": "后排",
   "commandValue": 6,
   "hp": 14000,
   "cruise": 800,
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "S",
    "survival": "B",
    "strategy": "C",
    "support": "C"
   },
   "firepower": {
    "antiShip": 200,
    "antiAir": 1583,
    "siege": 138
   },
   "modules": [
    "一、攻城无人机保障系统（CST-4型攻城无人机吊舱）",
    "二、通用火炮系统"
   ],
   "size": 296,
   "maxShip": 10,
   "build": {
    "metal": 8150,
    "crystal": 660,
    "deuterium": 130,
    "time": 0.01,
    "capacity": 2200
   },
   "desc": "搭载1个攻城无人机舱，可放出ST-1无人机攻击城市防御并进行常规对舰攻击。防御武器很少。",
   "story": "战神军团与鹰卫围绕资源行星普里西拉的冲突引发了一场大规模战争。鹰卫无法迅速攻占普里西拉，于是佯装撤退并留下舰船作为诱饵。战神军团派出防御舰队越过防线追击，同时用工程舰将战利品拖回行星表面，削弱了自身防线。鹰卫组织了一支以M470护卫舰为主的登陆舰队，集中攻击行星表面的关键防御设施。这成为了战争的转折点。",
   "quote": "为恐惧所困时前进；为贪婪与疯狂所触动时撤退。——鹰卫三大军规·第二条"
  }
 ],
 "海尔波普": [
  {
   "name": "海尔波普-系统支援护航艇",
   "variant": "多功能A型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 7735,
   "cruise": "2400",
   "warp": "-",
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "-",
    "antiAir": "-",
    "siege": "-",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "应急维修系统"
   ]
  },
  {
   "name": "海尔波普-维修支援护航艇",
   "variant": "对接B型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 7735,
   "cruise": "2400",
   "warp": "-",
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "-",
    "antiAir": "-",
    "siege": "-",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "超频维修系统"
   ]
  }
 ],
 "星云追逐者": [
  {
   "name": "星云追逐者-重型护航艇",
   "variant": "弹炮A型",
   "type": "护航艇",
   "position": "前排",
   "commandValue": 2,
   "hp": 6300,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 2400,
    "antiAir": 1584,
    "siege": 588
   },
   "modules": [
    "机载武器系统",
    "攻击导弹系统"
   ],
   "size": 110,
   "maxShip": 10,
   "build": {
    "metal": 6470,
    "crystal": 430,
    "deuterium": 90,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "重型护航艇，装备1座火箭塔与2座速射炮塔。进入射程后可快速攻击敌方阵型前后排单位，短时间内造成可观伤害。",
   "story": "安东尼奥斯财团的一支科研舰队在NGC7293星云中失踪。这艘原型护航艇被命名为星云追逐者，以纪念失踪的科学家们及其对真理的追求。",
   "quote": "我们使用拉格朗日网络，如同古人使用火。但使用与理解是截然不同的两回事。——张约翰，《拉格朗日网络理论》"
  },
  {
   "name": "星云追逐者-脉冲炮艇",
   "variant": "脉冲B型",
   "type": "护航艇",
   "position": "前排",
   "commandValue": 2,
   "hp": 5400,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "A",
    "siege": "-",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3200,
    "antiAir": 1920,
    "siege": 64
   },
   "modules": [
    "机载武器系统"
   ],
   "size": 110,
   "maxShip": 10,
   "build": {
    "metal": 4720,
    "crystal": 410,
    "deuterium": 140,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "船体安装了实验型近程充能脉冲炮，利用护航艇的机动性在近程发动有效攻击。",
   "story": "安东尼奥斯财团的一支科研舰队在NGC7293星云中失踪。这艘原型护航艇被命名为星云追逐者，以纪念失踪的科学家们及其对真理的追求。",
   "quote": "我们使用拉格朗日网络，如同古人使用火。但使用与理解是截然不同的两回事。——张约翰，《拉格朗日网络理论》"
  }
 ],
 "虚灵": [
  {
   "name": "虚灵-隐身导弹艇",
   "variant": "攻击A型",
   "type": "护航艇",
   "position": "前排",
   "commandValue": 2,
   "hp": 5200,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3593,
    "antiAir": 596,
    "siege": 187
   },
   "modules": [
    "风暴MKD.1导弹系统",
    "快速火炮系统"
   ],
   "size": 90,
   "maxShip": 10,
   "build": {
    "metal": 8220,
    "crystal": 570,
    "deuterium": 110,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "全隐身攻击导弹护航艇。流线型船体与特制引擎结合信息干扰系统，大幅降低被探测与命中的概率。装备小型导弹发射系统与突击火炮，可对小型舰船发动有效攻击。",
   "story": "虚灵之名源于宇宙诞生之初原始而混沌的状态。",
   "quote": "道生一，一生二，二生三，三生万物。——泰拉谚语"
  }
 ],
 "康纳马拉混沌级": [
  {
   "name": "康纳马拉混沌级-轨道炮巡洋舰",
   "variant": "A型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 20,
   "hp": 71600,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 12380,
    "antiAir": 1780,
    "siege": 0
   },
   "modules": [
    "舰首轨道炮系统"
   ],
   "size": 980,
   "maxShip": 8,
   "build": {
    "metal": 50880,
    "crystal": 6630,
    "deuterium": 2100,
    "time": 0.1,
    "capacity": 20000
   },
   "desc": "以木卫二上的一片混乱地形区域命名的巡洋舰。舰首装备双联轨道炮，可对大型目标造成巨大伤害。在常规武器配置基础上加装侧向引擎，用于调整舰船角度以提升战斗生存能力。为提升机动性牺牲了装甲。",
   "story": "康纳马拉混沌区是木卫二上一片地形混乱的区域，曾被引为木卫二冰层下存在海洋的证据。太阳系开发时代，科学家与工程技术人员在其地表下发现了辉锑晶体矿脉，随后进行了大规模开采。经过数百年的工业开发，康纳马拉混沌区从木卫二上消失了。后来在其工业遗址上竖立了一座纪念碑，以纪念它对高能曲速工业作出的巨大贡献。",
   "quote": "没有人能真正拥有拉格朗日技术，每个人都只是在为下一代保管它。——阿诺德，拉格朗日遗产委员会常任主席"
  },
  {
   "name": "康纳马拉混沌级-高速等离子体巡洋舰",
   "variant": "B型",
   "type": "巡洋舰",
   "position": "后排",
   "commandValue": 20,
   "hp": 71600,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 15908,
    "antiAir": 3082,
    "siege": 0
   },
   "modules": [
    "舰首等离子体投射系统"
   ],
   "size": 980,
   "maxShip": 8,
   "build": {
    "metal": 56250,
    "crystal": 11570,
    "deuterium": 4580,
    "time": 0.17,
    "capacity": 20000
   },
   "desc": "以木卫二上的一片混乱地形区域命名的巡洋舰。装备可直射的实验型等离子投射器。在常规武器配置基础上加装侧向引擎，用于调整舰船角度以提升战斗生存能力。",
   "story": "康纳马拉混沌区是木卫二上一片地形混乱的区域，曾被引为木卫二冰层下存在海洋的证据。太阳系开发时代，科学家与工程技术人员在其地表下发现了辉锑晶体矿脉，随后进行了大规模开采。经过数百年的工业开发，康纳马拉混沌区从木卫二上消失了。后来在其工业遗址上竖立了一座纪念碑，以纪念它对高能曲速工业作出的巨大贡献。",
   "quote": "没有人能真正拥有拉格朗日技术，每个人都只是在为下一代保管它。——阿诺德，拉格朗日遗产委员会常任主席"
  }
 ],
 "狩猎者级": [
  {
   "name": "狩猎者级-载机巡洋舰",
   "variant": "A型",
   "type": "巡洋舰",
   "position": "后排",
   "commandValue": 18,
   "hp": 76190,
   "cruise": 500,
   "warp": 2500,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 8,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "-",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3114,
    "antiAir": 571,
    "siege": 119
   },
   "modules": [
    "战机搭载系统",
    "投射武器系统"
   ],
   "size": 1120,
   "maxShip": 8,
   "build": {
    "metal": 55970,
    "crystal": 5750,
    "deuterium": 4430,
    "time": 0.13,
    "capacity": 26000
   },
   "desc": "舰体中央安装4个中型战机机库，可搭载攻击机与战机中队执行各种远程攻击任务。防御武器包括防空导弹与通用炮台。",
   "story": "近年来，仲裁委员会与安东尼奥斯财团在多个领域展开合作。在第六轮谈判中，仲裁委员会希望获得安东尼奥斯财团各种舰船蓝图与武器技术的授权，包括狩猎者巡洋舰、新君士坦丁大帝级战列巡洋舰以及各类导弹技术。这些舰船与武器技术将大幅提升仲裁委员会旗下灭绝者对付中小型目标的能力。与此同时，安东尼奥斯财团也希望与仲裁委员会合作。",
   "quote": "合作与分离的基础是利益的交换与冲突；疑虑提醒双方重新评估自身利益。——第一条规则"
  },
  {
   "name": "狩猎者级-防空载机巡洋舰",
   "variant": "C型",
   "type": "巡洋舰",
   "position": "后排",
   "commandValue": 18,
   "hp": 76190,
   "cruise": 500,
   "warp": 2500,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 8,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "-",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 1647,
    "antiAir": 215,
    "siege": 60
   },
   "modules": [
    "战机搭载系统",
    "防空导弹系统"
   ],
   "size": 1120,
   "maxShip": 8,
   "build": {
    "metal": 65510,
    "crystal": 4420,
    "deuterium": 4440,
    "time": 0.12,
    "capacity": 27000
   },
   "desc": "基于原型机的升级版本。舰首导弹系统被替换为2组防空导弹发射阵列，以提升防空能力。",
   "story": "近年来，仲裁委员会与安东尼奥斯财团在多个领域展开合作。在第六轮谈判中，仲裁委员会希望获得安东尼奥斯财团各种舰船蓝图与武器技术的授权，包括狩猎者巡洋舰、新君士坦丁大帝级战列巡洋舰以及各类导弹技术。这些舰船与武器技术将大幅提升仲裁委员会旗下灭绝者对付中小型目标的能力。与此同时，安东尼奥斯财团也希望与仲裁委员会合作。",
   "quote": "合作与分离的基础是利益的交换与冲突；疑虑提醒双方重新评估自身利益。——第一条规则"
  },
  {
   "name": "狩猎者级-战术载机巡洋舰",
   "variant": "B型(战术)",
   "type": "巡洋舰",
   "position": "后排",
   "commandValue": 18,
   "hp": 76190,
   "cruise": 500,
   "warp": 2500,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 8,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "-",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 600,
    "antiAir": 215,
    "siege": 60
   },
   "modules": [
    "战机搭载系统",
    "信息指挥系统"
   ],
   "size": 1120,
   "maxShip": 8,
   "build": {
    "metal": 61260,
    "crystal": 3760,
    "deuterium": 4040,
    "time": 0.11,
    "capacity": 25000
   },
   "desc": "基于原型机的升级版本。舰首导弹系统被替换为航空指挥无人机系统，可向附近战机下达综合指令并提升其命中率。",
   "story": "近年来，仲裁委员会与安东尼奥斯财团在多个领域展开合作。在第六轮谈判中，仲裁委员会希望获得安东尼奥斯财团各种舰船蓝图与武器技术的授权，包括狩猎者巡洋舰、新君士坦丁大帝级战列巡洋舰以及各类导弹技术。这些舰船与武器技术将大幅提升仲裁委员会旗下灭绝者对付中小型目标的能力。与此同时，安东尼奥斯财团也希望与仲裁委员会合作。",
   "quote": "合作与分离的基础是利益的交换与冲突；疑虑提醒双方重新评估自身利益。——第一条规则"
  }
 ],
 "卡利斯托": [
  {
   "name": "卡利斯托-集束鱼雷袭击舰",
   "variant": "A型",
   "type": "巡洋舰",
   "position": "后排",
   "commandValue": 20,
   "hp": 79630,
   "cruise": 400,
   "warp": 2000,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 14350,
    "antiAir": 2226,
    "siege": 3983
   },
   "modules": [
    "永远的北极星大型投射系统"
   ],
   "size": 1140,
   "maxShip": 8,
   "build": {
    "metal": 59110,
    "crystal": 10120,
    "deuterium": 3190,
    "time": 0.14,
    "capacity": 21000
   },
   "desc": "黑曜石矿业公司设计开发的巡洋舰。独特的外形为其赢得了\"黑曜石\"的绰号。核心周围布置鱼雷发射器，可搭载各类大型鱼雷进行饱和攻击。作为突击舰，可对各类重型目标造成毁灭性伤害。仅装备少量防御武器，防御力低于同级巡洋舰。",
   "story": "为恢复泰拉领域的工业与经济体系，仲裁委员会启动了\"太阳系复兴计划\"，包含156个建设项目与694个技术研究项目。该计划培育了木星工业、盘古集团、地球开发银行等大型企业与组织。卡利斯托巡洋舰是该计划衍生的军事工程项目的伟大成就之一，也大幅提升了灭绝者的整体反舰能力。",
   "quote": "从零重建远比修复半毁之物简单。——高迪，《无尽黎明设计史》"
  },
  {
   "name": "卡利斯托-重型鱼雷袭击舰",
   "variant": "B型",
   "type": "巡洋舰",
   "position": "后排",
   "commandValue": 20,
   "hp": 79630,
   "cruise": 400,
   "warp": 2000,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "C",
    "support": "B"
   },
   "firepower": {
    "antiShip": 10950,
    "antiAir": 1701,
    "siege": 3003
   },
   "modules": [
    "永远的北极星大型投射系统"
   ],
   "size": 1140,
   "maxShip": 8,
   "build": {
    "metal": 53110,
    "crystal": 6500,
    "deuterium": 3340,
    "time": 0.12,
    "capacity": 25000
   },
   "desc": "基于原型机的升级版本。移除50%的鱼雷以腾出空间安装无人机机库。由此获得区域防空能力，并提升整个舰队的作战能力。",
   "story": "为恢复泰拉领域的工业与经济体系，仲裁委员会启动了\"太阳系复兴计划\"，包含156个建设项目与694个技术研究项目。该计划培育了木星工业、盘古集团、地球开发银行等大型企业与组织。卡利斯托巡洋舰是该计划衍生的军事工程项目的伟大成就之一，也大幅提升了灭绝者的整体反舰能力。",
   "quote": "从零重建远比修复半毁之物简单。——高迪，《无尽黎明设计史》"
  },
  {
   "name": "卡利斯托-重型无人机巡洋舰",
   "variant": "C型(支援)",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 18,
   "hp": 79630,
   "cruise": "400-1200",
   "warp": 2000,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 12553,
    "antiAir": 4691,
    "siege": 3618
   },
   "modules": [
    "防空无人机系统",
    "永远的北极星大型投射系统"
   ]
  }
 ],
 "艾奥级": [
  {
   "name": "艾奥级-攻坚离子炮巡洋舰",
   "variant": "A型",
   "type": "巡洋舰",
   "position": "前排",
   "commandValue": 18,
   "hp": 62120,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "A",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 15739,
    "antiAir": 11979,
    "siege": 0
   },
   "modules": [
    "雷式离子炮系统",
    "通用导弹发射系统"
   ],
   "size": 960,
   "maxShip": 8,
   "build": {
    "metal": 58000,
    "crystal": 9960,
    "deuterium": 2700,
    "time": 0.13,
    "capacity": 20000
   },
   "desc": "基于原型机的升级版本。舰首离子炮与冷却系统被替换为单发装填攻城离子炮。攻城离子炮位置固定，但以更长的攻击持续时间弥补，可对建筑造成毁灭性伤害。另安装防御火炮以增强通用性。",
   "story": "艾奥巡洋舰原型在几年前灭绝者的军事演习中首次亮相，其高功率离子炮给仲裁委员会高层留下了深刻印象。经过多轮武器测试与改进，艾奥巡洋舰在\"毯式行动\"实战中证明了自身价值。一支由艾奥巡洋舰组成的小型舰队摧毁了数百艘冥王星流浪兄弟会舰船，基本歼灭了其隐藏在柯伊伯带的所有力量。",
   "quote": "实验室中反复的测试，要么意味着重大错误，要么意味着关键突破。——梁A.K.，木星工业离子炮技术专家"
  },
  {
   "name": "艾奥级-高速离子炮巡洋舰",
   "variant": "B型",
   "type": "巡洋舰",
   "position": "前排",
   "commandValue": 18,
   "hp": 62120,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 15100,
    "antiAir": 1009,
    "siege": 126
   },
   "modules": [
    "雷式离子炮系统",
    "对舰导弹发射系统"
   ],
   "size": 960,
   "maxShip": 8,
   "build": {
    "metal": 52720,
    "crystal": 10690,
    "deuterium": 3050,
    "time": 0.14,
    "capacity": 20000
   },
   "desc": "基于原型机的升级版本。舰首离子炮经过改装可快速连续射击，可迅速歼灭中小型目标。另装备升级后的突击导弹系统。",
   "story": "艾奥巡洋舰原型在几年前灭绝者的军事演习中首次亮相，其高功率离子炮给仲裁委员会高层留下了深刻印象。经过多轮武器测试与改进，艾奥巡洋舰在\"毯式行动\"实战中证明了自身价值。一支由艾奥巡洋舰组成的小型舰队摧毁了数百艘冥王星流浪兄弟会舰船，基本歼灭了其隐藏在柯伊伯带的所有力量。",
   "quote": "实验室中反复的测试，要么意味着重大错误，要么意味着关键突破。——梁A.K.，木星工业离子炮技术专家"
  }
 ],
 "白垩级": [
  {
   "name": "白垩级-战术无人机巡洋舰",
   "variant": "A型(干扰)",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 16,
   "hp": 62120,
   "cruise": "450-1200",
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3600,
    "antiAir": 2250,
    "siege": 320
   },
   "modules": [
    "浮游载机系统I型",
    "综合武器系统"
   ]
  },
  {
   "name": "白垩级-综合防空巡洋舰",
   "variant": "B型(防空)",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 16,
   "hp": 62120,
   "cruise": "450-1200",
   "warp": 2250,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "S",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 7200,
    "antiAir": 9655,
    "siege": 160
   },
   "modules": [
    "浮游载机系统II型",
    "综合导弹系统"
   ]
  }
 ],
 "光锥级": [
  {
   "name": "光锥级-综合导弹巡洋舰",
   "variant": "A型(通用)",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 20,
   "hp": 69570,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "B",
    "support": "B"
   },
   "firepower": {
    "antiShip": 12471,
    "antiAir": 1439,
    "siege": 232
   },
   "modules": [
    "苔原防空无人机系统",
    "矿车投射矩阵"
   ],
   "size": 1090,
   "maxShip": 8,
   "build": {
    "metal": 61950,
    "crystal": 7670,
    "deuterium": 2860,
    "time": 0.13,
    "capacity": 26000
   },
   "desc": "装备\"矿车\"综合制导导弹发射阵列系统。包含2组中型反舰导弹阵列与2组轻型反舰导弹阵列，可对全战场各类目标发动有效攻击。另装备防御炮台与防空无人机系统，提升自卫能力并为友军提供防空支援。",
   "story": "为镇压哈珀5号的叛乱，鹰卫第三远征军切断了该行星的补给线与通信网络。叛军多次试图突破封锁，最终均告失败。在最后一次突破行动中，叛军领袖的光锥级巡洋舰凭借防空无人机突破封锁，带着少量舰船逃脱。失去领袖后，叛乱很快瓦解。哈珀5号的叛乱共持续了245天。",
   "quote": "我宁愿原谅一次考虑不周的行动，也不愿认可无所作为。——哈珀5号叛军匿名指挥官"
  },
  {
   "name": "光锥级-区域防空巡洋舰",
   "variant": "B型(防空)",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 20,
   "hp": 69570,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "siege": "C",
    "survival": "B",
    "strategy": "B",
    "support": "A"
   },
   "firepower": {
    "antiShip": 6750,
    "antiAir": 690,
    "siege": 150
   },
   "modules": [
    "苔原拦截无人机系统",
    "矿车投射矩阵"
   ],
   "size": 1090,
   "maxShip": 8,
   "build": {
    "metal": 58270,
    "crystal": 6970,
    "deuterium": 3030,
    "time": 0.12,
    "capacity": 26000
   },
   "desc": "基于原型机的升级版本。安装防空导弹阵列提升防空能力。另装备反导无人机系统，增强为友军舰队拦截来袭导弹的能力。",
   "story": "为镇压哈珀5号的叛乱，鹰卫第三远征军切断了该行星的补给线与通信网络。叛军多次试图突破封锁，最终均告失败。在最后一次突破行动中，叛军领袖的光锥级巡洋舰凭借防空无人机突破封锁，带着少量舰船逃脱。失去领袖后，叛乱很快瓦解。哈珀5号的叛乱共持续了245天。",
   "quote": "我宁愿原谅一次考虑不周的行动，也不愿认可无所作为。——哈珀5号叛军匿名指挥官"
  },
  {
   "name": "光锥级-攻击导弹巡洋舰",
   "variant": "C型(突击)",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 20,
   "hp": 69570,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "B",
    "support": "C"
   },
   "firepower": {
    "antiShip": 13500,
    "antiAir": 1496,
    "siege": 112
   },
   "modules": [
    "矿车投射矩阵"
   ],
   "size": 1090,
   "maxShip": 8,
   "build": {
    "metal": 57180,
    "crystal": 6180,
    "deuterium": 2130,
    "time": 0.1,
    "capacity": 25000
   },
   "desc": "基于原型机的升级版本。增加一组重型导弹以提升对主力舰的伤害输出。装备侦查无人机系统提升命中率。",
   "story": "为镇压哈珀5号的叛乱，鹰卫第三远征军切断了该行星的补给线与通信网络。叛军多次试图突破封锁，最终均告失败。在最后一次突破行动中，叛军领袖的光锥级巡洋舰凭借防空无人机突破封锁，带着少量舰船逃脱。失去领袖后，叛乱很快瓦解。哈珀5号的叛乱共持续了245天。",
   "quote": "我宁愿原谅一次考虑不周的行动，也不愿认可无所作为。——哈珀5号叛军匿名指挥官"
  }
 ],
 "棕熊级": [
  {
   "name": "棕熊级-综合巡洋舰",
   "variant": "A型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 20,
   "hp": 88250,
   "cruise": "450-1200",
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "C",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 17127,
    "antiAir": 3428,
    "siege": 1043
   },
   "modules": [
    "激光束II型离子炮系统",
    "综合武器系统"
   ]
  },
  {
   "name": "棕熊级-防空巡洋舰",
   "variant": "B型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 20,
   "hp": 88250,
   "cruise": "450-1200",
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "A",
    "siege": "-",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 5400,
    "antiAir": 8408,
    "siege": 0
   },
   "modules": [
    "矿车防空导弹系统",
    "综合武器系统"
   ]
  },
  {
   "name": "棕熊级-重型巡洋舰",
   "variant": "C型(突防)",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 20,
   "hp": 88250,
   "cruise": "450-1200",
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "A",
    "siege": "-",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 8566,
    "antiAir": 4912,
    "siege": 0
   },
   "modules": [
    "综合武器系统",
    "导弹发射平台"
   ]
  }
 ],
 "云海级": [
  {
   "name": "云海级-防空护卫舰",
   "variant": "防空型B",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 9030,
   "cruise": 900,
   "warp": 4500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "-",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 685,
    "antiAir": 128,
    "siege": 5950
   },
   "modules": [
    "防空无人机系统"
   ],
   "size": 202,
   "maxShip": 10,
   "build": {
    "metal": 9430,
    "crystal": 590,
    "deuterium": 190,
    "time": 0.01,
    "capacity": 1800
   },
   "desc": "防空护卫舰，搭载1个防空无人机舱。可派出无人机拦截邻近的战机与护航艇。另装备火箭塔用于防空防御。",
   "story": "灭绝者每年举行代号\"挑战者\"的军事演习。演习中以冥王星流浪兄弟会为假想敌，进行从巡逻遭遇战、空间站夺取到小行星带伏击等多种战斗演练，以提升云海级护卫舰的防空与登陆效能。",
   "quote": "不积跬步，无以至千里；不积小流，无以成江海。——泰拉文学作品"
  },
  {
   "name": "云海级-轻型登陆舰（突击型A）",
   "variant": "轻型登陆舰",
   "type": "护卫舰",
   "position": "后排",
   "commandValue": 4,
   "hp": 9030,
   "cruise": 900,
   "warp": 4500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "—",
    "siege": "—",
    "survival": "B",
    "strategy": "B",
    "support": "C"
   },
   "firepower": {
    "antiShip": 857,
    "antiAir": 1532,
    "siege": 0
   },
   "modules": [
    "一、突击登陆无人机系统（主战武器系统）",
    "二、导弹支援系统"
   ],
   "size": 202,
   "maxShip": 10,
   "build": {
    "metal": 10280,
    "crystal": 630,
    "deuterium": 130,
    "time": 0.01,
    "capacity": 1700
   },
   "desc": "轻型登陆舰，搭载1个攻城无人机舱，可在攻城行动中发动快速突击。另装备综合火箭塔用于登陆行动中的火力支援。",
   "story": "灭绝者每年举行代号\"挑战者\"的军事演习。演习中以冥王星流浪兄弟会为假想敌，进行从巡逻遭遇战、空间站夺取到小行星带伏击等多种战斗演练，以提升云海级护卫舰的防空与登陆效能。",
   "quote": "不积跬步，无以至千里；不积小流，无以成江海。——泰拉文学作品"
  }
 ],
 "静海区": [
  {
   "name": "静海区-导弹护卫舰",
   "variant": "综合型A",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 12360,
   "cruise": 1000,
   "warp": 5000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 1028,
    "antiAir": 1234,
    "siege": 216
   },
   "modules": [
    "十字联合火炮系统"
   ],
   "size": 255,
   "maxShip": 10,
   "build": {
    "metal": 8470,
    "crystal": 700,
    "deuterium": 120,
    "time": 0.01,
    "capacity": 1800
   },
   "desc": "改进型通用导弹发射巢，可用密集集中的火力拦截各类导弹与鱼雷。装备通用火炮时可攻击各类目标。",
   "story": "日耳曼军团一艘静海级护卫舰在萨巴尔殖民地上方轨道进行武器测试时发生故障意外开火，造成行星表面大量伤亡。这一事件导致萨巴尔星系内多方势力关系紧张，最终演变为鹰卫与日耳曼军团之间的全面战争。后来这场战争被称为\"萨巴尔星系战争\"与\"一枚导弹引发的战争\"。",
   "quote": "压垮骆驼的从来不是最后一根稻草，而是每一根稻草的重量。——萨巴尔殖民地谚语"
  },
  {
   "name": "静海区-脉冲炮护卫舰",
   "variant": "脉冲型B",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 12360,
   "cruise": 1000,
   "warp": 5000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "siege": "C",
    "survival": "C",
    "strategy": "B",
    "support": "B"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 1350,
    "siege": 0
   },
   "modules": [
    "防卫脉冲炮系统"
   ],
   "size": 255,
   "maxShip": 10,
   "build": {
    "metal": 8370,
    "crystal": 680,
    "deuterium": 170,
    "time": 0.01,
    "capacity": 1500
   },
   "desc": "将原有武器系统改装为三门脉冲炮与通用小型导弹发射阵列。可有效拦截敌方舰载机并将火力集中于小型舰船。",
   "story": "日耳曼军团一艘静海级护卫舰在萨巴尔殖民地上方轨道进行武器测试时发生故障意外开火，造成行星表面大量伤亡。这一事件导致萨巴尔星系内多方势力关系紧张，最终演变为鹰卫与日耳曼军团之间的全面战争。后来这场战争被称为\"萨巴尔星系战争\"与\"一枚导弹引发的战争\"。",
   "quote": "压垮骆驼的从来不是最后一根稻草，而是每一根稻草的重量。——萨巴尔殖民地谚语"
  },
  {
   "name": "静海区-拦截护卫舰",
   "variant": "防空型C",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 12360,
   "cruise": 1000,
   "warp": 5000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "siege": "C",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 535,
    "antiAir": 2306,
    "siege": 120
   },
   "modules": [
    "通用火炮系统",
    "永远的北极星投射系统"
   ],
   "size": 255,
   "maxShip": 10,
   "build": {
    "metal": 9510,
    "crystal": 1070,
    "deuterium": 300,
    "time": 0.02,
    "capacity": 2000
   }
  }
 ],
 "FG300型": [
  {
   "name": "FG300型-多用途护卫舰",
   "variant": "多功能型A",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 3,
   "hp": 10530,
   "cruise": 1000,
   "warp": 5000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 1157,
    "antiAir": 607,
    "siege": 270
   },
   "modules": [
    "FG-300通用火炮系统"
   ],
   "size": 250,
   "maxShip": 15,
   "build": {
    "metal": 7990,
    "crystal": 540,
    "deuterium": 110,
    "time": 0.01,
    "capacity": 2000
   },
   "desc": "通用多用途护卫舰，装备3门通用速射火炮，可执行多种攻防任务。采用大量通用组件与简单结构，易于制造，是理想的侦察舰。",
   "story": "灭绝者第九巡逻队在距萨巴尔星系之门约32天文单位处失踪。第九巡逻队以FG300护卫舰为主力，辅以少量驱逐舰护航，负责保障仲裁委员会与萨巴尔星系之间的航线安全。该象限以舰船与舰队失踪的神秘事件闻名，被称为\"银河百慕大三角\"。失踪舰船从未被发现任何残骸或黑匣子。",
   "quote": "我们对星系与象限了解得越多，对未知的恐惧就越深。——多米尼克·甘地，量子通信技术专家"
  },
  {
   "name": "FG300型-装甲护卫舰",
   "variant": "装甲型B",
   "type": "护卫舰",
   "position": "前排",
   "commandValue": 3,
   "hp": 12540,
   "cruise": 1000,
   "warp": 5000,
   "physicalArmor": 15,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 771,
    "antiAir": 462,
    "siege": 180
   },
   "modules": [
    "FG-302通用火炮系统"
   ],
   "size": 250,
   "maxShip": 15,
   "build": {
    "metal": 10500,
    "crystal": 670,
    "deuterium": 140,
    "time": 0.01,
    "capacity": 1500
   },
   "desc": "在原设计基础上增加附加装甲与防御火炮，适合激烈的战斗场景。",
   "story": "灭绝者第九巡逻队在距萨巴尔星系之门约32天文单位处失踪。第九巡逻队以FG300护卫舰为主力，辅以少量驱逐舰护航，负责保障仲裁委员会与萨巴尔星系之间的航线安全。该象限以舰船与舰队失踪的神秘事件闻名，被称为\"银河百慕大三角\"。失踪舰船从未被发现任何残骸或黑匣子。",
   "quote": "我们对星系与象限了解得越多，对未知的恐惧就越深。——多米尼克·甘地，量子通信技术专家"
  },
  {
   "name": "FG300型-侦察护卫舰",
   "variant": "侦察型C",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 3,
   "hp": 12540,
   "cruise": 1100,
   "warp": 5500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 385,
    "antiAir": 289,
    "siege": 90
   },
   "modules": [
    "FG-300通用火炮系统"
   ],
   "size": 250,
   "maxShip": 15,
   "build": {
    "metal": 6250,
    "crystal": 590,
    "deuterium": 140,
    "time": 0.01,
    "capacity": 2200
   },
   "desc": "基于原型机的升级版本。移除炮塔并强化引擎，曲速与闪避显著提升。",
   "story": "灭绝者第九巡逻队在距萨巴尔星系之门约32天文单位处失踪。第九巡逻队以FG300护卫舰为主力，辅以少量驱逐舰护航，负责保障仲裁委员会与萨巴尔星系之间的航线安全。该象限以舰船与舰队失踪的神秘事件闻名，被称为\"银河百慕大三角\"。失踪舰船从未被发现任何残骸或黑匣子。",
   "quote": "我们对星系与象限了解得越多，对未知的恐惧就越深。——多米尼克·甘地，量子通信技术专家"
  }
 ],
 "诺玛330": [
  {
   "name": "诺玛330-TE-快速武装调查船",
   "variant": "高速型",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 3,
   "hp": 12180,
   "cruise": 1100,
   "warp": 5500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 900,
    "antiAir": 161,
    "siege": 229
   },
   "modules": [
    "快速火炮系统"
   ],
   "size": 205,
   "maxShip": 10,
   "build": {
    "metal": 8530,
    "crystal": 480,
    "deuterium": 110,
    "time": 0.01,
    "capacity": 1600
   },
   "desc": "采用较老的护卫舰设计，但由于制造技术成熟、成本较低，常被私掠者建造使用。主要武器为火炮，火力与火炮护航艇相当。",
   "story": "据探索者公会统计，其40%的注册成员将诺玛运输集团的武装调查舰作为探索舰队的组成部分。诺玛的武装调查舰常用于探索远古遗迹与新星系、拉格朗日节点观测、太空发掘等众多领域，在民用舰船市场上销量巨大。",
   "quote": "一连串的调查与研究只能意味着某处出了问题。——孟德斯鸠，太空探险家，银河考古学会主席"
  }
 ],
 "全能级": [
  {
   "name": "全能级-TE-离子炮巡洋舰",
   "variant": "离子炮型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 16,
   "hp": 56320,
   "cruise": "450-1200",
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 10192,
    "antiAir": 1643,
    "siege": 1721
   },
   "modules": [
    "舰首离子炮系统",
    "防空系统"
   ]
  }
 ],
 "迅捷级": [
  {
   "name": "迅捷级-武装运输船",
   "variant": "通用型",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 12,
   "hp": 48290,
   "cruise": "600-1200",
   "warp": 3000,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 2400,
    "antiAir": 720,
    "siege": 256
   },
   "modules": [
    "防御火炮系统"
   ]
  },
  {
   "name": "迅捷级-载机运输船",
   "variant": "载机型B",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 12,
   "hp": 48290,
   "cruise": "600-1200",
   "warp": 3000,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 2400,
    "antiAir": 720,
    "siege": 256
   },
   "modules": [
    "舰载机系统",
    "防御火炮系统"
   ]
  },
  {
   "name": "迅捷级-TE-高速载机运输船（载机型A）",
   "variant": "TE-高速载机运输船",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 14,
   "hp": 48290,
   "cruise": "600~1200",
   "warp": 3200,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "A：舰载机系统",
    "2. 系统机制：负责舰载机存放、整备、投放，为本舰核心支援模块，无火炮伤害、攻击时序相关参数。",
    "B：防御火炮系统",
    "5. 系统机制：双联装攻击主炮，主要针对小型舰船以及空中舰载目标作战。"
   ]
  }
 ],
 "玉衡级": [
  {
   "name": "玉衡级-维修巡洋舰",
   "variant": "综合型A",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 16,
   "hp": 81950,
   "cruise": "450-1200",
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 5280,
    "antiAir": 270,
    "siege": 460
   },
   "modules": [
    "综合武器系统"
   ]
  },
  {
   "name": "玉衡级-防御巡洋舰",
   "variant": "防御型B",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 16,
   "hp": 89390,
   "cruise": "450-1200",
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 6000,
    "antiAir": 1944,
    "siege": 460
   },
   "modules": [
    "主动反应防御系统",
    "导弹发射系统"
   ]
  },
  {
   "name": "玉衡级-支援巡洋舰",
   "variant": "支援型C",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 16,
   "hp": 71600,
   "cruise": "450-1200",
   "warp": 2250,
   "physicalArmor": 10,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 5280,
    "antiAir": 2214,
    "siege": 460
   },
   "modules": [
    "小型舰船支援系统",
    "综合武器系统"
   ]
  }
 ],
 "天璇A": [
  {
   "name": "天璇A-轻型攻击机",
   "variant": "干扰型",
   "type": "战机",
   "position": "aircraft",
   "commandValue": 5,
   "hp": 5600,
   "cruise": "-",
   "warp": "-",
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 2400,
    "antiAir": 0,
    "siege": 144
   },
   "modules": [
    "火炮攻击系统"
   ]
  }
 ],
 "雷火V022": [
  {
   "name": "雷火V022-轻型战斗机",
   "variant": "防空型A",
   "type": "战机",
   "position": "aircraft",
   "commandValue": 5,
   "hp": 5250,
   "cruise": "-",
   "warp": "-",
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "S",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 1290,
    "antiAir": 1814,
    "siege": 206
   },
   "modules": [
    "防空导弹系统"
   ]
  },
  {
   "name": "雷火V022-特种战斗机-B",
   "variant": "特种战斗机-B",
   "type": "战机",
   "position": "中排",
   "commandValue": 10,
   "hp": 50000,
   "cruise": "600~1200",
   "warp": 3200,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "—",
    "antiAir": "—",
    "siege": "—",
    "survival": "—",
    "strategy": "—"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "一、防空导弹系统（左1，武器系统）"
   ]
  },
  {
   "name": "雷火V022-两栖战斗机-C（干扰型）",
   "variant": "两栖战斗机-C",
   "type": "战机",
   "position": "中排",
   "commandValue": 10,
   "hp": 50000,
   "cruise": "600~1200",
   "warp": 3200,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "—",
    "antiAir": "—",
    "siege": "—",
    "survival": "—",
    "strategy": "—"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "一、机载制导系统（火控武器系统）"
   ]
  }
 ],
 "BR050": [
  {
   "name": "BR050-标准轰炸机",
   "variant": "对舰型A",
   "type": "战机",
   "position": "aircraft",
   "commandValue": 6,
   "hp": 5040,
   "cruise": "2800",
   "warp": "-",
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "-",
    "siege": "A",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3964,
    "antiAir": 0,
    "siege": 1416
   },
   "modules": [
    "机载投弹系统"
   ]
  },
  {
   "name": "BR050-多用途轰炸机-B（防御型）",
   "variant": "多用途轰炸机-B",
   "type": "战机",
   "position": "中排",
   "commandValue": 10,
   "hp": 50000,
   "cruise": "600~1200",
   "warp": 3200,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "—",
    "antiAir": "—",
    "siege": "—",
    "survival": "—",
    "strategy": "—"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "一、机载投弹系统（投射主武器系统）",
    "3.补充说明：无武器输出、无子系统打击相关设定。",
    "3.补充说明：无武器属性，无舰船子系统攻击效率设定。"
   ]
  },
  {
   "name": "BR050-鱼雷轰炸机-C（鱼雷型）",
   "variant": "鱼雷轰炸机-C",
   "type": "战机",
   "position": "中排",
   "commandValue": 10,
   "hp": 50000,
   "cruise": "600~1200",
   "warp": 3200,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "—",
    "antiAir": "—",
    "siege": "—",
    "survival": "—",
    "strategy": "—"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "一、试验型特种鱼雷投送系统（主武器系统）",
    "3.补充说明：无武器属性，无舰船子系统攻击效率设定。"
   ]
  }
 ],
 "米斯特拉": [
  {
   "name": "米斯特拉-战斗攻击机",
   "variant": "对空型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 5400,
   "cruise": 3100,
   "warp": 15500,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "S",
    "siege": "-",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 288,
    "antiAir": 2764,
    "siege": 2750
   },
   "modules": [
    "机载武器系统"
   ],
   "size": 35,
   "maxShip": 10,
   "build": {
    "metal": 7520,
    "crystal": 650,
    "deuterium": 220,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "装备2门速射机炮与强大空战能力，可迅速反击来袭的敌方舰载机与护卫护航艇。重量轻，可承受长时间打击。",
   "story": "米斯特拉战机上的许多技术源自神圣群星帝国时期的科学研究。虽然数百年过去了，其技术成果至今仍然重要且具有现实意义。",
   "quote": "如果为错过太阳而流泪，你也会错过群星。——神圣群星帝国谚语"
  }
 ],
 "刺鳐": [
  {
   "name": "刺鳐-鱼雷轰炸机",
   "variant": "隐身型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 5200,
   "cruise": 3200,
   "warp": 16000,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "-",
    "siege": "B",
    "survival": "A",
    "strategy": "C",
    "support": "B"
   },
   "firepower": {
    "antiShip": 5200,
    "antiAir": 1652,
    "siege": 0
   },
   "modules": [
    "机载投弹系统"
   ],
   "size": 90,
   "maxShip": 10,
   "build": {
    "metal": 5360,
    "crystal": 730,
    "deuterium": 260,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "具备隐身能力的特种高速轰炸机。扁平机身与信号干扰装置使其难以被探测，机动性优越。可在近距离发射重型鱼雷，对中大型目标造成毁灭性伤害。",
   "story": "这架战机因其扁平后掠翼设计而得名。作为木星工业的绝密项目，其研发持续了数十年。",
   "quote": "创新与复古都是前进的方式。——文哲，哲学家，复古未来主义代表"
  }
 ],
 "孢孑A404": [
  {
   "name": "孢孑A404-轻型战斗机",
   "variant": "对空型",
   "type": "战机",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 3550,
   "cruise": "3100",
   "warp": "-",
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "siege": "-",
    "survival": "B",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 145,
    "antiAir": 2090,
    "siege": 0
   },
   "modules": [
    "机载格斗系统"
   ]
  }
 ],
 "B192新大地": [
  {
   "name": "B192新大地-重型攻击机",
   "variant": "多功能型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 4680,
   "cruise": 3300,
   "warp": 16500,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "B",
    "support": "A"
   },
   "firepower": {
    "antiShip": 2745,
    "antiAir": 348,
    "siege": 2250
   },
   "modules": [
    "攻击火炮系统",
    "防空导弹系统"
   ],
   "size": 54,
   "maxShip": 10,
   "build": {
    "metal": 7300,
    "crystal": 660,
    "deuterium": 290,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "利用80mm火炮对敌舰进行精准打击，同时伤害敌方子系统。装备防空作战导弹，可对来袭舰载机进行有效反击。",
   "story": "研发中的新型原型机被命名为\"新大地\"，以表达对类地行星的眷恋之情。",
   "quote": "舰船载我远行，陆地引我归家。——吟游诗人斯坦利《太空奥德赛》第五章"
  }
 ],
 "瑶光级": [
  {
   "name": "瑶光级-通用护卫舰",
   "variant": "通用型A",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 24064,
   "cruise": "900-1200",
   "warp": 4500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "-",
    "siege": "B",
    "survival": "A",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 1210,
    "antiAir": 0,
    "siege": 138
   },
   "modules": [
    "瑶光I型护盾无人机系统"
   ]
  },
  {
   "name": "瑶光级-特种护卫舰（特种型B）",
   "variant": "特种护卫舰",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 10,
   "hp": 18952,
   "cruise": "900~1200",
   "warp": 4500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "—",
    "siege": "B",
    "survival": "A",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 1210,
    "antiAir": 0,
    "siege": 138
   },
   "modules": [
    "一、“瑶光II型”护盾无人机系统（搭载×4 ENT-5型护盾无人机吊舱）",
    "二、舰首轨道炮系统（搭载×1 ER-850A型舰首轨道炮）"
   ]
  }
 ],
 "刺水母级": [
  {
   "name": "刺水母级-战术护卫舰",
   "variant": "特种型A",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 5,
   "hp": 17284,
   "cruise": "960-1200",
   "warp": 4050,
   "physicalArmor": 11,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "S",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 10292,
    "antiAir": 0,
    "siege": 2056
   },
   "modules": [
    "毒刺无人机攻击系统"
   ]
  },
  {
   "name": "刺水母级-防御护卫舰",
   "variant": "防空型B",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 5,
   "hp": 12146,
   "cruise": "800-1200",
   "warp": 4050,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "S",
    "siege": "-",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 2456,
    "siege": 0
   },
   "modules": [
    "毒刺无人机防卫系统"
   ]
  },
  {
   "name": "刺水母级-无人机登陆舰（登陆型C）",
   "variant": "无人机登陆舰",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 8,
   "hp": 11150,
   "cruise": "800~1200",
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "S",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "一、通用火炮系统（搭载×2“堡垒”MK1-BG-245型通用火炮）"
   ]
  }
 ],
 "狼蜥级": [
  {
   "name": "狼蜥级-防御护卫舰",
   "variant": "防御型A",
   "type": "护卫舰",
   "position": "后排",
   "commandValue": 6,
   "hp": 10530,
   "cruise": 800,
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "S",
    "siege": "B",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 240,
    "antiAir": 1206,
    "siege": 28
   },
   "modules": [
    "狼牙无人机防御系统"
   ],
   "size": 253,
   "maxShip": 10,
   "build": {
    "metal": 10300,
    "crystal": 650,
    "deuterium": 270,
    "time": 0.02,
    "capacity": 1200
   },
   "desc": "安装\"毒刺\"防御无人机系统，可有效拦截己方空域内的舰载机。其无人机装备小型等离子防空武器。",
   "story": "在诺玛运输集团百年庆典阅兵式上，诺玛的小型舰船研发部门赢得了大量赞誉与认可。除红宝石级护卫舰外，该部门还通过狼蜥级护卫舰展示了无人机研究的最新成果。这艘护卫舰搭载了全套造型独特的无人机，被誉为\"次世代概念舰\"。小型舰船研发部门在阅兵式上荣获\"诺玛英雄团队勋章\"。",
   "quote": "从历史中可以清楚地看到，量的变化不会带来质的提升，反而会阻碍它。——《太空史》序言"
  },
  {
   "name": "狼蜥级-突击护卫舰",
   "variant": "攻击型B",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 14480,
   "cruise": "800-1200",
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3380,
    "antiAir": 450,
    "siege": 24
   },
   "modules": [
    "狼牙无人机攻击系统",
    "通用火炮系统"
   ]
  },
  {
   "name": "狼蜥级-攻坚护卫舰",
   "variant": "特种型C",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 14480,
   "cruise": "800-1200",
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "S",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 4520,
    "antiAir": 360,
    "siege": 24
   },
   "modules": [
    "狼牙无人机特种系统",
    "通用火炮系统"
   ]
  }
 ],
 "雨海级": [
  {
   "name": "雨海级-突击护卫舰",
   "variant": "轨道炮型A",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 15585,
   "cruise": "900-1200",
   "warp": 4550,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 3207,
    "antiAir": 0,
    "siege": 727
   },
   "modules": [
    "舰首轨道炮系统"
   ]
  },
  {
   "name": "雨海级-脉冲炮护卫舰",
   "variant": "脉冲型B",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 15585,
   "cruise": "900-1200",
   "warp": 4550,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 4104,
    "antiAir": 972,
    "siege": 287
   },
   "modules": [
    "雨式脉冲炮系统"
   ]
  }
 ],
 "澄海级": [
  {
   "name": "澄海级-重型护卫舰",
   "variant": "对舰型A",
   "type": "护卫舰",
   "position": "后排",
   "commandValue": 5,
   "hp": 14970,
   "cruise": 900,
   "warp": 4500,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "A",
    "strategy": "C",
    "support": "C"
   },
   "firepower": {
    "antiShip": 3385,
    "antiAir": 1131,
    "siege": 4300
   },
   "modules": [
    "永远的北极星投射系统MARK I-A1",
    "十字联合火炮系统"
   ],
   "size": 297,
   "maxShip": 10,
   "build": {
    "metal": 15820,
    "crystal": 910,
    "deuterium": 170,
    "time": 0.02,
    "capacity": 2000
   },
   "desc": "装备Mk I\"永恒北极星\"投射发射系统发射TR-360鱼雷，可对中大型舰船进行远程攻击。生存能力出众。",
   "story": "为确保双方共用的星门安全，日耳曼军团与仲裁委员会合作启动了\"毯式行动\"，反击流浪兄弟会的舰队。仲裁委员会向日耳曼军团提供了大量武器装备，包括数十艘澄海级护卫舰。双方在各自领土的资源带内展开大规模搜索歼灭行动，重创藏匿其中的流浪兄弟会部队。该行动迫使冥王星流浪兄弟会",
   "quote": "我们的意志如铁；我们的胜利必然；我们的传承永恒。——流浪兄弟会信条"
  },
  {
   "name": "澄海级-导弹护卫舰",
   "variant": "导弹型B",
   "type": "护卫舰",
   "position": "后排",
   "commandValue": 5,
   "hp": 14970,
   "cruise": 900,
   "warp": 4500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 2300,
    "antiAir": 478,
    "siege": 4300
   },
   "modules": [
    "永远的北极星投射系统",
    "十字联合火炮系统"
   ],
   "size": 297,
   "maxShip": 10,
   "build": {
    "metal": 10530,
    "crystal": 710,
    "deuterium": 140,
    "time": 0.01,
    "capacity": 1800
   },
   "desc": "将主武器改装为双侧导弹发射巢，可向敌方后排目标倾泻突击导弹。也能对小型舰船造成有效伤害。",
   "story": "为确保双方共用的星门安全，日耳曼军团与仲裁委员会合作启动了\"毯式行动\"，反击流浪兄弟会的舰队。仲裁委员会向日耳曼军团提供了大量武器装备，包括数十艘澄海级护卫舰。双方在各自领土的资源带内展开大规模搜索歼灭行动，重创藏匿其中的流浪兄弟会部队。该行动迫使冥王星流浪兄弟会",
   "quote": "我们的意志如铁；我们的胜利必然；我们的传承永恒。——流浪兄弟会信条"
  },
  {
   "name": "澄海级-防空护卫舰",
   "variant": "防空型C",
   "type": "护卫舰",
   "position": "后排",
   "commandValue": 5,
   "hp": 14970,
   "cruise": 900,
   "warp": 4500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "siege": "C",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 780,
    "antiAir": 640,
    "siege": 8600
   },
   "modules": [
    "永远的北极星投射系统"
   ],
   "size": 297,
   "maxShip": 10,
   "build": {
    "metal": 9700,
    "crystal": 670,
    "deuterium": 200,
    "time": 0.02,
    "capacity": 2200
   },
   "desc": "将主武器改装为双侧防空导弹发射巢，可对空中目标发动反复攻击。",
   "story": "为确保双方共用的星门安全，日耳曼军团与仲裁委员会合作启动了\"毯式行动\"，反击流浪兄弟会的舰队。仲裁委员会向日耳曼军团提供了大量武器装备，包括数十艘澄海级护卫舰。双方在各自领土的资源带内展开大规模搜索歼灭行动，重创藏匿其中的流浪兄弟会部队。该行动迫使冥王星流浪兄弟会",
   "quote": "我们的意志如铁；我们的胜利必然；我们的传承永恒。——流浪兄弟会信条"
  }
 ],
 "红宝石级": [
  {
   "name": "红宝石级-重型轨道炮护卫舰",
   "variant": "轨道炮型A",
   "type": "护卫舰",
   "position": "前排",
   "commandValue": 5,
   "hp": 17550,
   "cruise": 900,
   "warp": 4500,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "B",
    "survival": "B",
    "strategy": "C",
    "support": "C"
   },
   "firepower": {
    "antiShip": 3172,
    "antiAir": 683,
    "siege": 50
   },
   "modules": [
    "望远镜轨道炮攻击系统"
   ],
   "size": 298,
   "maxShip": 10,
   "build": {
    "metal": 18700,
    "crystal": 1000,
    "deuterium": 420,
    "time": 0.03,
    "capacity": 1400
   },
   "desc": "移除舰首火炮为强化装甲腾出空间以承受更多伤害。另装备自我维修系统进行基础自修。",
   "story": "红宝石级护卫舰原型作为新装备展示的一部分在诺玛运输集团百年庆典阅兵式上亮相，赢得了诺玛运输集团高层的一致赞誉。当它的轨道炮击中目标时，天空中爆发出巨大的耀眼爆炸，由此得名\"红宝石\"。红宝石之名也代表其作为诺玛研发部门皇冠明珠的地位。",
   "quote": "技术是从自然规则中解放出来的贪婪；它催生对不朽的渴望，同时威胁毁灭世界。——《太空伊利亚特》第一章"
  },
  {
   "name": "红宝石级-离子炮护卫舰",
   "variant": "离子炮型B",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 5,
   "hp": 14970,
   "cruise": 900,
   "warp": 4500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 4743,
    "antiAir": 1070,
    "siege": 711
   },
   "modules": [
    "激光束离子炮系统",
    "闪光防空离子炮系统"
   ],
   "size": 298,
   "maxShip": 10,
   "build": {
    "metal": 13000,
    "crystal": 780,
    "deuterium": 280,
    "time": 0.02,
    "capacity": 1000
   }
  },
  {
   "name": "红宝石级-重型防御护卫舰",
   "variant": "防护型C",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 17550,
   "cruise": "900-1200",
   "warp": 4500,
   "physicalArmor": 35,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 1632,
    "antiAir": 0,
    "siege": 656
   },
   "modules": [
    "攻城鱼雷系统",
    "强化装甲系统"
   ]
  }
 ],
 "雷里亚特级": [
  {
   "name": "雷里亚特级-快速鱼雷护卫舰",
   "variant": "对舰型A",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 10530,
   "cruise": 800,
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 2072,
    "antiAir": 411,
    "siege": 330
   },
   "modules": [
    "反舰鱼雷系统"
   ],
   "size": 220,
   "maxShip": 10,
   "build": {
    "metal": 12490,
    "crystal": 950,
    "deuterium": 230,
    "time": 0.02,
    "capacity": 2000
   },
   "desc": "舰体两侧各安装一座速射反舰鱼雷发射器，另装备3座高速通用炮塔。可一边开炮一边向中小型主力舰发射鱼雷。以防御能力与生存能力为代价提升航速。",
   "story": "海雷丁家族正式申请调查米特拉斯星系内已知的大型流放者遗迹位置。然而，管理该星系的守护者部队屡次拒绝其请求，导致双方在米特拉斯之门附近爆发大规模冲突。战斗中，海雷丁家族一艘雷里亚特级护卫舰向附近的敌方战列舰发起自杀式冲锋，以全速撞击并成功将其击毁。这一损失震动了守护者部队高层，雷里亚特级护卫舰随后被称为",
   "quote": "如果弹药耗尽，你的舰船本身也可以成为最后手段的武器。——雷里亚特级护卫舰黑匣子录音记录"
  },
  {
   "name": "雷里亚特级-战术鱼雷护卫舰",
   "variant": "鱼雷型B",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 10530,
   "cruise": 800,
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3088,
    "antiAir": 946,
    "siege": 14
   },
   "modules": [
    "反舰鱼雷系统"
   ],
   "size": 220,
   "maxShip": 10,
   "build": {
    "metal": 12190,
    "crystal": 1190,
    "deuterium": 220,
    "time": 0.02,
    "capacity": 1800
   },
   "desc": "装备特殊能量鱼雷发射器，可发射充能鱼雷伤害各类重装甲目标。",
   "story": "海雷丁家族正式申请调查米特拉斯星系内已知的大型流放者遗迹位置。然而，管理该星系的守护者部队屡次拒绝其请求，导致双方在米特拉斯之门附近爆发大规模冲突。战斗中，海雷丁家族一艘雷里亚特级护卫舰向附近的敌方战列舰发起自杀式冲锋，以全速撞击并成功将其击毁。这一损失震动了守护者部队高层，雷里亚特级护卫舰随后被称为",
   "quote": "如果弹药耗尽，你的舰船本身也可以成为最后手段的武器。——雷里亚特级护卫舰黑匣子录音记录"
  },
  {
   "name": "雷里亚特级-隐身护卫舰",
   "variant": "隐身型C",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 10530,
   "cruise": 800,
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "C",
    "support": "B"
   },
   "firepower": {
    "antiShip": 3257,
    "antiAir": 205,
    "siege": 0
   },
   "modules": [
    "隐身鱼雷系统"
   ],
   "size": 220,
   "maxShip": 10,
   "build": {
    "metal": 13270,
    "crystal": 1300,
    "deuterium": 300,
    "time": 0.03,
    "capacity": 1500
   },
   "desc": "舰船涂覆隐身涂层并移除所有可能暴露的炮塔。装备隐身鱼雷，攻击时更难被拦截。加装信息控制模块降低被探测概率。其特殊隐身鱼雷可对目标子系统造成伤害。",
   "story": "海雷丁家族正式申请调查米特拉斯星系内已知的大型流放者遗迹位置。然而，管理该星系的守护者部队屡次拒绝其请求，导致双方在米特拉斯之门附近爆发大规模冲突。战斗中，海雷丁家族一艘雷里亚特级护卫舰向附近的敌方战列舰发起自杀式冲锋，以全速撞击并成功将其击毁。这一损失震动了守护者部队高层，雷里亚特级护卫舰随后被称为",
   "quote": "如果弹药耗尽，你的舰船本身也可以成为最后手段的武器。——雷里亚特级护卫舰黑匣子录音记录"
  }
 ],
 "卡利莱恩级": [
  {
   "name": "卡利莱恩级-特种护卫舰",
   "variant": "特种型C",
   "type": "护卫舰",
   "position": "前排",
   "commandValue": 5,
   "hp": 9770,
   "cruise": 1100,
   "warp": 5500,
   "physicalArmor": 8,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 1221,
    "antiAir": 189,
    "siege": 3015
   },
   "modules": [
    "对舰快速火炮系统"
   ],
   "size": 203,
   "maxShip": 10,
   "build": {
    "metal": 8930,
    "crystal": 660,
    "deuterium": 260,
    "time": 0.02,
    "capacity": 1200
   },
   "desc": "特殊改装的侦察护卫舰，装备态势感知与战场伪装系统，赋予其战斗中非凡的闪避与防御能力。",
   "story": "为争夺新巴纳德星系的开发权，星际解放者与战神军团在通往新巴纳德星系的拉格朗日网络区域展开交战。战神军团起初派出大量突击舰与轰炸机包围星际解放者，在其舰队周围形成封锁。当交战区域即将被完全包围时，星际解放者组织了一支以卡利莱恩级护卫舰为主的突围舰队。凭借速度与机动性，他们成功突破",
   "quote": "闪电战的原则是以时间换空间；时间越长，收益与价值越低。——马尔斯，战神军团总参谋长"
  },
  {
   "name": "卡利莱恩级-重炮护卫舰",
   "variant": "重炮型B",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 5,
   "hp": 9840,
   "cruise": 950,
   "warp": 4750,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 2485,
    "antiAir": 0,
    "siege": 540
   },
   "modules": [
    "舰首重炮系统"
   ],
   "size": 203,
   "maxShip": 10,
   "build": {
    "metal": 8590,
    "crystal": 630,
    "deuterium": 120,
    "time": 0.01,
    "capacity": 1500
   }
  },
  {
   "name": "卡利莱恩级-侦察护卫舰（侦察型A）",
   "variant": "侦察护卫舰",
   "type": "护卫舰",
   "position": "前排",
   "commandValue": 4,
   "hp": 8340,
   "cruise": 1100,
   "warp": 5500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "—",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 1297,
    "antiAir": 189,
    "siege": 3015
   },
   "modules": [
    "1.对舰快速火炮系统",
    "2.近防火炮系统"
   ],
   "size": 203,
   "maxShip": 10,
   "build": {
    "metal": 7810,
    "crystal": 660,
    "deuterium": 170,
    "time": 0.01,
    "capacity": 1800
   },
   "desc": "以火炮为主要火力，可发动反舰攻击并具备近程防御能力。机动性优于同类舰船，常用于执行侦察任务与骚扰。",
   "story": "为争夺新巴纳德星系的开发权，星际解放者与战神军团在通往新巴纳德星系的拉格朗日网络区域展开交战。战神军团起初派出大量突击舰与轰炸机包围星际解放者，在其舰队周围形成封锁。当交战区域即将被完全包围时，星际解放者组织了一支以卡利莱恩级护卫舰为主的突围舰队。凭借速度与机动性，他们成功突破",
   "quote": "闪电战的原则是以时间换空间；时间越长，收益与价值越低。——马尔斯，战神军团总参谋长"
  }
 ],
 "索姆河之影": [
  {
   "name": "索姆河之影-装甲飞行坦克",
   "variant": "重炮型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 5,
   "hp": 7455,
   "cruise": "2500",
   "warp": "-",
   "physicalArmor": 8,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "-",
    "siege": "C",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3405,
    "antiAir": 0,
    "siege": 207
   },
   "modules": [
    "重型火炮系统"
   ]
  }
 ],
 "天玑": [
  {
   "name": "天玑-重型护航艇",
   "variant": "对舰A型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 5,
   "hp": 9932,
   "cruise": "2500",
   "warp": "-",
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 1760,
    "antiAir": 460,
    "siege": 280
   },
   "modules": [
    "鱼雷发射系统",
    "通用火炮系统"
   ]
  },
  {
   "name": "天玑-攻击护航艇（攻击B型）",
   "variant": "攻击护航艇",
   "type": "护航艇",
   "position": "中排",
   "commandValue": 10,
   "hp": 50000,
   "cruise": "2500",
   "warp": 3200,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "—",
    "antiAir": "—",
    "siege": "—",
    "survival": "—",
    "strategy": "—"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "A：鱼雷发射系统（ET-250T型能量鱼雷轰炸系统）",
    "1. 主武器系统：效率低",
    "2. 主机库系统：效率低",
    "B：通用火炮系统"
   ]
  }
 ],
 "野火": [
  {
   "name": "野火-格斗护航艇",
   "variant": "防御A型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 6600,
   "cruise": "2500",
   "warp": "-",
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "A",
    "siege": "-",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 900,
    "antiAir": 576,
    "siege": 0
   },
   "modules": [
    "快速火炮系统"
   ]
  },
  {
   "name": "野火-格斗护航艇",
   "variant": "防御A型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 6600,
   "cruise": "2500",
   "warp": "-",
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "A",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 900,
    "antiAir": 576,
    "siege": 0
   },
   "modules": [
    "快速火炮系统"
   ]
  },
  {
   "name": "野火-TE-鱼雷艇",
   "variant": "对舰A型",
   "type": "护航艇",
   "position": "前排",
   "commandValue": 2,
   "hp": 4900,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 1780,
    "antiAir": 483,
    "siege": 0
   },
   "modules": [
    "攻击鱼雷系统"
   ],
   "size": 90,
   "maxShip": 10,
   "build": {
    "metal": 4210,
    "crystal": 270,
    "deuterium": 60,
    "time": 0,
    "capacity": 0
   },
   "desc": "两侧装有鱼雷发射器，可远距离以高射速和高火力密度对中型舰船发动大规模打击，命中时造成大量伤害。尽管机动性与命中率平平，但凭借成熟的技术与强大火力，被神圣群星帝国海军广泛装备，常被用于首轮攻击。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  },
  {
   "name": "野火-TE-鱼雷艇（对舰A型）",
   "variant": "战术鱼雷护航艇",
   "type": "护航艇",
   "position": "中排",
   "commandValue": 10,
   "hp": 6800,
   "cruise": "2500",
   "warp": 3200,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "—",
    "antiAir": "—",
    "siege": "—",
    "survival": "—",
    "strategy": "—"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "A：鱼雷发射系统（HT-1-450D型鱼雷发射系统）"
   ]
  }
 ],
 "坦普尔1号": [
  {
   "name": "坦普尔1号-信息护航艇",
   "variant": "干扰A型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 7100,
   "cruise": "2400",
   "warp": "-",
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "-",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 120,
    "antiAir": 432,
    "siege": 0
   },
   "modules": [
    "反击火炮系统"
   ]
  },
  {
   "name": "坦普尔1号-预警护航艇",
   "variant": "预警B型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 7100,
   "cruise": "2400",
   "warp": "-",
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 600,
    "antiAir": 432,
    "siege": 0
   },
   "modules": [
    "电子侦查系统",
    "反击火炮系统"
   ]
  }
 ],
 "蜂巢守卫者": [
  {
   "name": "蜂巢守卫者-重型鱼雷艇",
   "variant": "多功能A型",
   "type": "护航艇",
   "position": "前排",
   "commandValue": 2,
   "hp": 6650,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "S",
    "antiAir": "B",
    "siege": "A",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 4771,
    "antiAir": 1469,
    "siege": 3500
   },
   "modules": [
    "鱼雷攻击系统",
    "快速火炮系统"
   ],
   "size": 130,
   "maxShip": 10,
   "build": {
    "metal": 7910,
    "crystal": 560,
    "deuterium": 110,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "其\"蜂巢\"鱼雷攻击系统可快速向敌方目标发射中型鱼雷。防御炮系统与态势感知系统大幅提升对抗小型舰船与舰载机时的生存能力。",
   "story": "蜂巢守卫者是安东尼奥斯财团为实施\"蜂巢战术理论\"而专门设计的作战单位。该理论强调以蜂巢式组织结构将小型作战单位联结起来，以适应小规模太空交战。",
   "quote": "要么给我命令，要么站到队里。——《蜂巢战术理论》，《太空军事与科学》第482期"
  }
 ],
 "AC720": [
  {
   "name": "AC720-艾格勒姆未名者",
   "variant": "英雄舰",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 8,
   "hp": 72075,
   "cruise": "920-1200",
   "warp": 5200,
   "physicalArmor": 13,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "A",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 7320,
    "antiAir": 1701,
    "siege": 378
   },
   "modules": [
    "未名者无人机系统",
    "未名者辅助舰炮系统"
   ]
  }
 ],
 "先登级": [
  {
   "name": "先登级-两栖突击舰",
   "variant": "登陆型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 22710,
   "cruise": "850-1200",
   "warp": 4250,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 2100,
    "antiAir": 607,
    "siege": 297
   },
   "modules": [
    "两栖战机维护指挥系统",
    "通用火炮系统"
   ]
  },
  {
   "name": "先登级-载机驱逐舰",
   "variant": "B型",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 28860,
   "cruise": "850-1200",
   "warp": 4250,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 2850,
    "antiAir": 202,
    "siege": 703
   },
   "modules": [
    "联合机库I型",
    "通用火炮系统",
    "舰首鱼雷系统"
   ]
  }
 ],
 "开阳级": [
  {
   "name": "开阳级-机动驱逐舰",
   "variant": "通用型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 8,
   "hp": 51623,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 3,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "-",
    "siege": "C",
    "survival": "A",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 4625,
    "antiAir": 0,
    "siege": 283
   },
   "modules": [
    "舰首鱼雷系统"
   ]
  },
  {
   "name": "开阳级-鱼雷驱逐舰",
   "variant": "对舰型B",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 8,
   "hp": 42600,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 3,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "-",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 5400,
    "antiAir": 0,
    "siege": 220
   },
   "modules": [
    "舰首鱼雷系统"
   ]
  }
 ],
 "斗牛级": [
  {
   "name": "斗牛级-脉冲炮驱逐舰",
   "variant": "攻击型A",
   "type": "驱逐舰",
   "position": "前排",
   "commandValue": 8,
   "hp": 36040,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 1200,
    "antiAir": 283,
    "siege": 8100
   },
   "modules": [
    "牛角脉冲炮系统"
   ],
   "size": 520,
   "maxShip": 10,
   "build": {
    "metal": 27440,
    "crystal": 2690,
    "deuterium": 610,
    "time": 0.04,
    "capacity": 7000
   },
   "desc": "综合脉冲炮驱逐舰，配备能量武器组，生存能力高。舰首安装带大型机械瞄准系统的大型脉冲炮塔，可对各类目标造成毁灭性伤害。另装备小型防空脉冲炮系统。",
   "story": "哈珀5号是鹰卫控制下的一颗行星，曾发生叛乱。叛军摧毁了多座资源采集器，导致附近的拉格朗日之门无法恢复正常运转。鹰卫第三远征军奉命镇压叛军。这支以斗牛级驱逐舰为主的远征军封锁了象限与运输航线，切断了叛军的补给线。非暴力的封锁最终因资源匮乏引发叛军内讧，不战而胜。",
   "quote": "勇于挑战难关的不是智者，而是别无选择的人。——地-半人马经济圈谚语"
  },
  {
   "name": "斗牛级-突击攻击舰",
   "variant": "突击型B",
   "type": "驱逐舰",
   "position": "前排",
   "commandValue": 8,
   "hp": 40030,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 4,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 5700,
    "antiAir": 1633,
    "siege": 8550
   },
   "modules": [
    "牛角脉冲炮系统"
   ],
   "size": 520,
   "maxShip": 10,
   "build": {
    "metal": 29720,
    "crystal": 2870,
    "deuterium": 660,
    "time": 0.05,
    "capacity": 7500
   },
   "desc": "加厚装甲与速射脉冲炮在冲入阵型前沿集火敌舰时效果最佳。舰首脉冲炮塔增加三连发模式，并移除瞄准系统以弥补火力不足。",
   "story": "哈珀5号是鹰卫控制下的一颗行星，曾发生叛乱。叛军摧毁了多座资源采集器，导致附近的拉格朗日之门无法恢复正常运转。鹰卫第三远征军奉命镇压叛军。这支以斗牛级驱逐舰为主的远征军封锁了象限与运输航线，切断了叛军的补给线。非暴力的封锁最终因资源匮乏引发叛军内讧，不战而胜。",
   "quote": "勇于挑战难关的不是智者，而是别无选择的人。——地-半人马经济圈谚语"
  },
  {
   "name": "斗牛级-防御驱逐舰",
   "variant": "防护型C",
   "type": "驱逐舰",
   "position": "前排",
   "commandValue": 8,
   "hp": 40030,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 4,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "A",
    "strategy": "B",
    "support": "A"
   },
   "firepower": {
    "antiShip": 4200,
    "antiAir": 630,
    "siege": 294
   },
   "modules": [
    "牛角脉冲炮系统"
   ],
   "size": 520,
   "maxShip": 10,
   "build": {
    "metal": 32660,
    "crystal": 2690,
    "deuterium": 520,
    "time": 0.04,
    "capacity": 7000
   },
   "desc": "利用其强大的防御能力在前排构筑反导屏障，同时攻击敌舰并拦截来袭的舰载机与导弹。",
   "story": "哈珀5号是鹰卫控制下的一颗行星，曾发生叛乱。叛军摧毁了多座资源采集器，导致附近的拉格朗日之门无法恢复正常运转。鹰卫第三远征军奉命镇压叛军。这支以斗牛级驱逐舰为主的远征军封锁了象限与运输航线，切断了叛军的补给线。非暴力的封锁最终因资源匮乏引发叛军内讧，不战而胜。",
   "quote": "勇于挑战难关的不是智者，而是别无选择的人。——地-半人马经济圈谚语"
  }
 ],
 "卫士": [
  {
   "name": "卫士-支援驱逐舰",
   "variant": "支援型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 9,
   "hp": 25650,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "B",
    "support": "A"
   },
   "firepower": {
    "antiShip": 3054,
    "antiAir": 837,
    "siege": 14749
   },
   "modules": [
    "无人机支援系统",
    "风暴导弹系统"
   ],
   "size": 599,
   "maxShip": 10,
   "build": {
    "metal": 25470,
    "crystal": 2260,
    "deuterium": 1840,
    "time": 0.07,
    "capacity": 10000
   },
   "desc": "舰体底部安装2个护航艇挂架，并配备护航艇维护与支援设备。突击时可释放护航艇提供巨大伤害输出。保留\"风暴\"导弹系统作为火力支援。",
   "story": "巴比伦·沃兰特位于萨巴尔星系附近，占据战略要地，拥有大量资源仓库与民用港口。它是日耳曼军团与鹰卫争夺的关键战略位置。双方在争夺中，对停泊在巴比伦·沃兰特W2港口的工程舰船发动了无差别攻击。为避免平民伤亡，日耳曼第五舰队几艘卫士驱逐舰派出无人机保护工程舰船，不惜牺牲自身防空能力。战争结束后，日耳曼军团这些舰船的名字被",
   "quote": "武器对准敌人；鲜花留给后代；子弹留给自己。——无名墓碑铭文"
  },
  {
   "name": "卫士-两栖突击舰",
   "variant": "两栖型B",
   "type": "驱逐舰",
   "position": "后排",
   "commandValue": 9,
   "hp": 25650,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "A",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 3054,
    "antiAir": 2244,
    "siege": 349
   },
   "modules": [
    "护航艇维护系统",
    "风暴导弹系统"
   ],
   "size": 599,
   "maxShip": 10,
   "build": {
    "metal": 24100,
    "crystal": 1970,
    "deuterium": 1450,
    "time": 0.06,
    "capacity": 9500
   }
  },
  {
   "name": "卫士-实验型脉冲突击舰",
   "variant": "脉冲型C",
   "type": "驱逐舰",
   "position": "前排",
   "commandValue": 9,
   "hp": 25650,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 5400,
    "antiAir": 515,
    "siege": 48
   },
   "modules": [
    "恒星法典脉冲炮系统"
   ],
   "size": 599,
   "maxShip": 10,
   "build": {
    "metal": 24040,
    "crystal": 2730,
    "deuterium": 730,
    "time": 0.05,
    "capacity": 8500
   },
   "desc": "利用其大容量优势，安装实验型脉冲能量系统为其\"星典\"攻击系统供能。该系统由多座脉冲炮塔组成，有充足能量对抗敌方中型舰船。",
   "story": "巴比伦·沃兰特位于萨巴尔星系附近，占据战略要地，拥有大量资源仓库与民用港口。它是日耳曼军团与鹰卫争夺的关键战略位置。双方在争夺中，对停泊在巴比伦·沃兰特W2港口的工程舰船发动了无差别攻击。为避免平民伤亡，日耳曼第五舰队几艘卫士驱逐舰派出无人机保护工程舰船，不惜牺牲自身防空能力。战争结束后，日耳曼军团这些舰船的名字被",
   "quote": "武器对准敌人；鲜花留给后代；子弹留给自己。——无名墓碑铭文"
  }
 ],
 "苔原级": [
  {
   "name": "苔原级-战术驱逐舰",
   "variant": "支援型A",
   "type": "驱逐舰",
   "position": "后排",
   "commandValue": 9,
   "hp": 41190,
   "cruise": 700,
   "warp": 3500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 1350,
    "antiAir": 519,
    "siege": 16357
   },
   "modules": [
    "苔原无人机系统",
    "快速火炮系统"
   ],
   "size": 610,
   "maxShip": 10,
   "build": {
    "metal": 26270,
    "crystal": 2530,
    "deuterium": 1170,
    "time": 0.06,
    "capacity": 10000
   },
   "desc": "装备\"苔原\"多用途无人机系统的驱逐舰。可放出2个防空无人机中队与1个维修无人机中队，在战斗中提供空中支援并维修友方舰船。装备通用炮台用于防御。",
   "story": "在新巴纳德星系战役中，星际解放者与战神军团在米拉小行星带附近爆发激烈冲突。小行星带的密度使舰船难以编队行进。为适应局势，战神军团将主力舰队拆分为小型中队进行游击战，并部署苔原级驱逐舰为这些小型舰队提供维修与补给。星际解放者在此战中损失惨重，失去了对小行星带的控制。因此，米拉小行星带被称为\"死亡\"",
   "quote": "猛鹰有时也会败给十只麻雀。——罗萨里奥《革命回忆录》"
  },
  {
   "name": "苔原级-载机驱逐舰",
   "variant": "载机型B",
   "type": "驱逐舰",
   "position": "后排",
   "commandValue": 9,
   "hp": 40030,
   "cruise": 700,
   "warp": 3500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 2022,
    "antiAir": 684,
    "siege": 157
   },
   "modules": [
    "综合武器库系统",
    "苔原载机系统"
   ],
   "size": 610,
   "maxShip": 10,
   "build": {
    "metal": 27620,
    "crystal": 2810,
    "deuterium": 1250,
    "time": 0.06,
    "capacity": 10000
   },
   "desc": "将原有无人机机库改装为2个中型舰载机机库。搭载2个中型战机编队中队，可执行多项突击任务。",
   "story": "在新巴纳德星系战役中，星际解放者与战神军团在米拉小行星带附近爆发激烈冲突。小行星带的密度使舰船难以编队行进。为适应局势，战神军团将主力舰队拆分为小型中队进行游击战，并部署苔原级驱逐舰为这些小型舰队提供维修与补给。星际解放者在此战中损失惨重，失去了对小行星带的控制。因此，米拉小行星带被称为\"死亡\"",
   "quote": "猛鹰有时也会败给十只麻雀。——罗萨里奥《革命回忆录》"
  }
 ],
 "谷神星级": [
  {
   "name": "谷神星级-载机驱逐舰",
   "variant": "载机型A",
   "type": "驱逐舰",
   "position": "后排",
   "commandValue": 8,
   "hp": 32310,
   "cruise": 850,
   "warp": 4250,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 1500,
    "antiAir": 215,
    "siege": 252
   },
   "modules": [
    "战机维护指挥系统",
    "通用火炮系统"
   ],
   "size": 580,
   "maxShip": 10,
   "build": {
    "metal": 17460,
    "crystal": 1740,
    "deuterium": 1230,
    "time": 0.05,
    "capacity": 10000
   },
   "desc": "搭载完整的舰载机维护与指挥系统，在有限空间内可容纳2个战机中队。作为特种载机驱逐舰，可借助不同舰载机执行各种空中支援任务。仅装备基础防御炮台。",
   "story": "天狼星β是一座以商业与政治立场中立著称的城市。正因如此，各方势力都喜欢在此商议多边事务。仲裁委员会在此与安东尼奥斯财团就舰船技术交流与拉格朗日网络合作进行了六轮谈判。第六轮谈判期间，安保舰队发现不明攻击者试图袭击外交舰船。安保舰队一艘谷神星级驱逐舰随即放出全部无人机进行拦截，谈判被迫中止并疏散人员。",
   "quote": "中立本身就是一种立场。——天狼星β市长在第32届银河友好城市会议上的开幕词"
  },
  {
   "name": "谷神星级-支援驱逐舰",
   "variant": "支援型B",
   "type": "驱逐舰",
   "position": "后排",
   "commandValue": 8,
   "hp": 32310,
   "cruise": 850,
   "warp": 4250,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 1500,
    "antiAir": 215,
    "siege": 18252
   },
   "modules": [
    "战术无人机系统",
    "通用火炮系统"
   ],
   "size": 580,
   "maxShip": 10,
   "build": {
    "metal": 17460,
    "crystal": 1740,
    "deuterium": 1230,
    "time": 0.05,
    "capacity": 9000
   },
   "desc": "将原有舰载机机库改装为3个部分：2个用于支援无人机，1个用于防御无人机。战斗中可派出无人机强化防空并维修友方舰船。仅装备基础防御炮台。",
   "story": "天狼星β是一座以商业与政治立场中立著称的城市。正因如此，各方势力都喜欢在此商议多边事务。仲裁委员会在此与安东尼奥斯财团就舰船技术交流与拉格朗日网络合作进行了六轮谈判。第六轮谈判期间，安保舰队发现不明攻击者试图袭击外交舰船。安保舰队一艘谷神星级驱逐舰随即放出全部无人机进行拦截，谈判被迫中止并疏散人员。",
   "quote": "中立本身就是一种立场。——天狼星β市长在第32届银河友好城市会议上的开幕词"
  },
  {
   "name": "谷神星级-战术驱逐舰",
   "variant": "C型(战术)",
   "type": "驱逐舰",
   "position": "后排",
   "commandValue": 8,
   "hp": 32310,
   "cruise": 850,
   "warp": 4250,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "C",
    "support": "A"
   },
   "firepower": {
    "antiShip": 1500,
    "antiAir": 215,
    "siege": 252
   },
   "modules": [
    "通用火炮系统"
   ],
   "size": 580,
   "maxShip": 10,
   "build": {
    "metal": 17460,
    "crystal": 1740,
    "deuterium": 1230,
    "time": 0.05,
    "capacity": 9000
   },
   "desc": "将原有舰载机机库改造为带信息支援功能的特种无人机机库。为舰队其他舰船提供信息支援以提升其命中率。",
   "story": "天狼星β是一座以商业与政治立场中立著称的城市。正因如此，各方势力都喜欢在此商议多边事务。仲裁委员会在此与安东尼奥斯财团就舰船技术交流与拉格朗日网络合作进行了六轮谈判。第六轮谈判期间，安保舰队发现不明攻击者试图袭击外交舰船。安保舰队一艘谷神星级驱逐舰随即放出全部无人机进行拦截，谈判被迫中止并疏散人员。",
   "quote": "中立本身就是一种立场。——天狼星β市长在第32届银河友好城市会议上的开幕词"
  }
 ],
 "AC721": [
  {
   "name": "AC721-重型运载驱逐舰",
   "variant": "通用型A",
   "type": "驱逐舰",
   "position": "后排",
   "commandValue": 8,
   "hp": 30730,
   "cruise": 800,
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "B",
    "strategy": "B",
    "support": "A"
   },
   "firepower": {
    "antiShip": 3972,
    "antiAir": 407,
    "siege": 7245
   },
   "modules": [
    "721型综合舰炮系统"
   ],
   "size": 560,
   "maxShip": 15,
   "build": {
    "metal": 20170,
    "crystal": 1930,
    "deuterium": 890,
    "time": 0.04,
    "capacity": 8500
   },
   "desc": "舰体下方可搭载两艘全尺寸火炮护航艇，成为护航艇母舰。船体内还安装了护航艇维护与指挥设备，可搭载不同护航艇执行不同增援任务。",
   "story": "仲裁委员会成立之初，优先致力于恢复太阳系经济。在那些早期岁月里，其灭绝者缺乏资金，难以获得充足的军事物资与装备。盘古集团曾向灭绝者捐赠一批军事装备，包括12艘装备精良的AC721驱逐舰。灭绝者依靠这些舰船度过了艰难时期，逐渐成为银河中一支不可忽视的力量。",
   "quote": "一项好的投资通常伴随着对未来的深刻洞察。——马克·盖茨，盘古集团首席执行官"
  },
  {
   "name": "AC721-重型导弹驱逐舰",
   "variant": "导弹型B",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 34140,
   "cruise": "800-1200",
   "warp": 4000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "A",
    "siege": "C",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 3450,
    "antiAir": 1525,
    "siege": 360
   },
   "modules": [
    "MK-200通用垂直发射系统",
    "720型辅助舰炮系统"
   ]
  },
  {
   "name": "AC721-重型两栖突击舰",
   "variant": "载机型D",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 30730,
   "cruise": "800-1200",
   "warp": 4000,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 1200,
    "antiAir": 322,
    "siege": 181
   },
   "modules": [
    "护航艇维护系统",
    "721型综合舰炮系统"
   ]
  }
 ],
 "塔拉萨萤石级": [
  {
   "name": "塔拉萨萤石级-信息驱逐舰",
   "variant": "防空型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 27960,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 1440,
    "antiAir": 216,
    "siege": 0
   },
   "modules": [
    "电子干扰系统",
    "防空武器系统"
   ]
  },
  {
   "name": "塔拉萨萤石级-电子驱逐舰",
   "variant": "干扰型B",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 29570,
   "cruise": "650-1200",
   "warp": 3250,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 1440,
    "antiAir": 216,
    "siege": 0
   },
   "modules": [
    "电子干扰系统",
    "防空武器系统"
   ]
  }
 ],
 "阅神星Ⅰ级": [
  {
   "name": "阅神星Ⅰ级-机动突击驱逐舰",
   "variant": "火炮型A",
   "type": "驱逐舰",
   "position": "前排",
   "commandValue": 7,
   "hp": 34392,
   "cruise": "900-1200",
   "warp": 4550,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 4500,
    "antiAir": 1440,
    "siege": 350
   },
   "modules": [
    "阅神联合舰炮系统"
   ]
  },
  {
   "name": "阅神星Ⅰ级-重炮驱逐舰",
   "variant": "重炮型B",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 8,
   "hp": 43580,
   "cruise": "850-1200",
   "warp": 4300,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "A",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 16700,
    "antiAir": 1285,
    "siege": 4705
   },
   "modules": [
    "阅神灰烬重炮系统"
   ]
  },
  {
   "name": "阅神星Ⅰ级-装甲驱逐舰",
   "variant": "装甲型C",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 39222,
   "cruise": "850-1200",
   "warp": 4300,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "A",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 4500,
    "antiAir": 1440,
    "siege": 350
   },
   "modules": [
    "阅神通用火炮系统"
   ]
  }
 ],
 "创神星级": [
  {
   "name": "创神星级-轨道炮驱逐舰",
   "variant": "轨道炮型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 6,
   "hp": 30540,
   "cruise": 850,
   "warp": 4250,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 4800,
    "antiAir": 721,
    "siege": 0
   },
   "modules": [
    "联合轨道炮系统"
   ],
   "size": 525,
   "maxShip": 10,
   "build": {
    "metal": 23020,
    "crystal": 2630,
    "deuterium": 430,
    "time": 0.03,
    "capacity": 8500
   },
   "desc": "以轨道炮为主的驱逐舰。舰内安装大型弹药库以支持持续射击。",
   "story": "木星工业与灭绝者保持着长期伙伴关系。他们经常以舰船性能测试为名，在其管辖的星系内举行军事演习。通过这种方式展示军事实力，对附近的中小势力形成巨大压力与威慑。",
   "quote": "未经测试的武器系统，从任何有意义的角度看都等于不存在。——道明寺常正，动能研究所研究员"
  },
  {
   "name": "创神星级-鱼雷驱逐舰",
   "variant": "鱼雷型B",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 6,
   "hp": 30540,
   "cruise": 850,
   "warp": 4250,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 5309,
    "antiAir": 1020,
    "siege": 381
   },
   "modules": [
    "永远的北极星投射系统"
   ],
   "size": 525,
   "maxShip": 10,
   "build": {
    "metal": 24160,
    "crystal": 2860,
    "deuterium": 460,
    "time": 0.04,
    "capacity": 8500
   },
   "desc": "部分武器被替换为重型攻城鱼雷，以更集中的方式攻击更少但更大的目标。在巨大弹药库支持下，可对大型战列舰与城市防御持续施以有效火力。",
   "story": "木星工业与灭绝者保持着长期伙伴关系。他们经常以舰船性能测试为名，在其管辖的星系内举行军事演习。通过这种方式展示军事实力，对附近的中小势力形成巨大压力与威慑。",
   "quote": "未经测试的武器系统，从任何有意义的角度看都等于不存在。——道明寺常正，动能研究所研究员"
  }
 ],
 "枪骑兵级": [
  {
   "name": "枪骑兵级-轻型导弹驱逐舰",
   "variant": "对舰型A",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 24440,
   "cruise": "700-1200",
   "warp": 3550,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 4612,
    "antiAir": 661,
    "siege": 1376
   },
   "modules": [
    "风暴导弹系统",
    "卡利莱恩重炮系统"
   ]
  },
  {
   "name": "枪骑兵级-综合导弹驱逐舰",
   "variant": "综合型B",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 24440,
   "cruise": "850-1200",
   "warp": 4300,
   "physicalArmor": 0,
   "energyArmor": 2,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 4100,
    "antiAir": 1012,
    "siege": 366
   },
   "modules": [
    "风暴导弹系统"
   ]
  },
  {
   "name": "枪骑兵级-区域防空驱逐舰",
   "variant": "防空型C",
   "type": "驱逐舰",
   "position": "中排",
   "commandValue": 7,
   "hp": 24440,
   "cruise": "850-1200",
   "warp": 4300,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "S",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 3540,
    "antiAir": 2160,
    "siege": 75
   },
   "modules": [
    "风暴导弹系统"
   ]
  }
 ],
 "锆石级": [
  {
   "name": "锆石级-突击护卫舰",
   "variant": "突击型A",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 13400,
   "cruise": "900-1200",
   "warp": 4500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "A",
    "siege": "C",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 2828,
    "antiAir": 2022,
    "siege": 207
   },
   "modules": [
    "浮游载机指挥系统",
    "舰首火炮系统"
   ]
  },
  {
   "name": "锆石级-特种护卫舰",
   "variant": "特种型B",
   "type": "护卫舰",
   "position": "中排",
   "commandValue": 4,
   "hp": 13400,
   "cruise": "900-1200",
   "warp": 4500,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "S",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 5832,
    "antiAir": 0,
    "siege": 340
   },
   "modules": [
    "浮游载机指挥系统",
    "舰首轨道炮系统"
   ]
  }
 ],
 "鳐": [
  {
   "name": "鳐-装甲护航艇",
   "variant": "高速A型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 5350,
   "cruise": "2500",
   "warp": "-",
   "physicalArmor": 6,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 1800,
    "antiAir": 0,
    "siege": 630
   },
   "modules": [
    "快速火炮系统"
   ]
  },
  {
   "name": "鳐-特种护航艇",
   "variant": "特种B型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 7700,
   "cruise": "2500",
   "warp": "-",
   "physicalArmor": 8,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "B",
    "survival": "S",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 1800,
    "antiAir": 0,
    "siege": 630
   },
   "modules": [
    "快速火炮系统"
   ]
  }
 ],
 "RB7": [
  {
   "name": "RB7-13型-导弹艇",
   "variant": "攻击A型",
   "type": "护航艇",
   "position": "前排",
   "commandValue": 2,
   "hp": 5200,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 2652,
    "antiAir": 378,
    "siege": 194
   },
   "modules": [
    "攻击导弹系统"
   ],
   "size": 80,
   "maxShip": 10,
   "build": {
    "metal": 3690,
    "crystal": 220,
    "deuterium": 50,
    "time": 0,
    "capacity": 0
   },
   "desc": "舰体两侧装有集束导弹发射器，可对近程目标持续输出伤害，对小型舰船造成大量伤害。是一艘出色的攻击护航艇。",
   "story": "红兽7-13护航艇由诺玛运输集团下属、绰号RB7的红兽7号实验室开发。RB7实验室主要承担秘密研究项目，为诺玛运输集团开发了许多著名舰船。",
   "quote": "导弹护航艇永远拥有优先通行权。——鹰卫第313号命令，戈尔，第三舰队指挥官"
  },
  {
   "name": "RB7-13型-突防护航艇",
   "variant": "突防B型",
   "type": "护航艇",
   "position": "aircraft",
   "commandValue": 4,
   "hp": 5200,
   "cruise": "2500",
   "warp": "-",
   "physicalArmor": 2,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 4094,
    "antiAir": 423,
    "siege": 211
   },
   "modules": [
    "突防导弹系统"
   ]
  }
 ],
 "猎兵级": [
  {
   "name": "猎兵级-重型载机巡洋舰",
   "variant": "载机型",
   "type": "巡洋舰",
   "position": "后排",
   "commandValue": 18,
   "hp": 76190,
   "cruise": 500,
   "warp": 2500,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "B",
    "support": "A"
   },
   "firepower": {
    "antiShip": 5571,
    "antiAir": 1089,
    "siege": 60
   },
   "modules": [
    "护航艇搭载系统",
    "联合火炮系统"
   ],
   "size": 1120,
   "maxShip": 8,
   "build": {
    "metal": 58390,
    "crystal": 7950,
    "deuterium": 2450,
    "time": 0.12,
    "capacity": 27000
   },
   "desc": "将舰首的护卫护航艇挂架改装为两门双联重型火炮，强化反舰作战能力。",
   "story": "安东尼奥斯财团数百年来一直研究并积累数学与金融衍生品的知识。一些经典的金融衍生品数值模型被代代沿用，至今仍在为财团创造利润。",
   "quote": "许多经典设计消亡，不是因为被其他设计超越，而是毁于自我迭代。——方丹，衍生设计"
  },
  {
   "name": "猎兵级-重型火炮巡洋舰",
   "variant": "B型(对舰)",
   "type": "巡洋舰",
   "position": "中排",
   "commandValue": 16,
   "hp": 76190,
   "cruise": "500-1200",
   "warp": 2500,
   "physicalArmor": 0,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "B",
    "survival": "B",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 11100,
    "antiAir": 1500,
    "siege": 1803
   },
   "modules": [
    "舰首武器系统",
    "联合火炮系统"
   ]
  }
 ],
 "AT021": [
  {
   "name": "AT021-脉冲攻击机-A（脉冲型）",
   "variant": "脉冲攻击机-A",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 4920,
   "cruise": 3000,
   "warp": 15000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "—",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 1668,
    "antiAir": 999,
    "siege": 48
   },
   "modules": [
    "一、脉冲机炮系统（主武器系统）"
   ],
   "size": 54,
   "maxShip": 15,
   "build": {
    "metal": 5600,
    "crystal": 450,
    "deuterium": 240,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "装备单门大口径脉冲炮，可快速打击中小型舰船。另装备特殊能量增强装置进一步提升能量输出。",
   "story": "这架战机全名为021型攻击机，其机身经过多次标准改装，日益精良。航天动力学界有一句名言：\"一旦机身框架达到一定成熟度，通过改型升级进行改进就远比从零设计一架新战机困难得多。\"",
   "quote": "如果宇宙是一台庞大精密的计算机，那么拉格朗日网络就是它的操作系统，按照同一套标准安排一切。"
  },
  {
   "name": "AT021-战术攻击机-B（干扰型）",
   "variant": "战术攻击机-B",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 4920,
   "cruise": 3000,
   "warp": 15000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "A",
    "strategy": "B",
    "support": "A"
   },
   "firepower": {
    "antiShip": 3093,
    "antiAir": 675,
    "siege": 96
   },
   "modules": [
    "2. 主动效果舰船命中干扰：模组工作期间干扰目标武器系统，使目标武器命中率下降12%。",
    "二、机载武器系统"
   ],
   "size": 54,
   "maxShip": 15,
   "build": {
    "metal": 5520,
    "crystal": 430,
    "deuterium": 230,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "主系统采用电子干扰系统并装备信号干扰模块，可大幅降低目标武器系统的命中率。另装备机载速射反舰炮，可对小型舰船造成伤害并为舰船提供反击防空能力。",
   "story": "这架战机全名为021型攻击机，其机身经过多次标准改装，日益精良。航天动力学界有一句名言：\"一旦机身框架达到一定成熟度，通过改型升级进行改进就远比从零设计一架新战机困难得多。\"",
   "quote": "如果宇宙是一台庞大精密的计算机，那么拉格朗日网络就是它的操作系统，按照同一套标准安排一切。"
  },
  {
   "name": "AT021-重型攻击机-C（多功能型）",
   "variant": "重型攻击机-C",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 4920,
   "cruise": 3000,
   "warp": 15000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "B",
    "support": "B"
   },
   "firepower": {
    "antiShip": 4236,
    "antiAir": 480,
    "siege": 0
   },
   "modules": [
    "一、精确攻击系统（主武器系统，编号A模块）",
    "二、机载制导系统（副武器系统）"
   ],
   "size": 54,
   "maxShip": 15,
   "build": {
    "metal": 6100,
    "crystal": 480,
    "deuterium": 170,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "以精准打击系统为主系统，装备小型导弹发射巢，可精确打击大型舰船的系统。同时装备机载反舰导弹直接攻击大型舰船。",
   "story": "这架战机全名为021型攻击机，其机身经过多次标准改装，日益精良。航天动力学界有一句名言：\"一旦机身框架达到一定成熟度，通过改型升级进行改进就远比从零设计一架新战机困难得多。\"",
   "quote": "如果宇宙是一台庞大精密的计算机，那么拉格朗日网络就是它的操作系统，按照同一套标准安排一切。"
  }
 ],
 "天璇": [
  {
   "name": "天璇-战斗攻击机-B",
   "variant": "战斗攻击机-B",
   "type": "战机",
   "position": "中排",
   "commandValue": 10,
   "hp": 5600,
   "cruise": "600~1200",
   "warp": 3200,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "—",
    "antiAir": "—",
    "siege": "—",
    "survival": "—",
    "strategy": "—"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [
    "一、火炮攻击系统"
   ]
  }
 ],
 "理智A101": [
  {
   "name": "理智A101-战斗攻击机-B",
   "variant": "战斗攻击机-B",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 4050,
   "cruise": 2800,
   "warp": 14000,
   "physicalArmor": 5,
   "energyArmor": 5,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "C",
    "strategy": "B",
    "support": "C"
   },
   "firepower": {
    "antiShip": 2844,
    "antiAir": 930,
    "siege": 2200
   },
   "modules": [
    "一、机载武器系统"
   ],
   "size": 35,
   "maxShip": 10,
   "build": {
    "metal": 5470,
    "crystal": 460,
    "deuterium": 160,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "神圣群星帝国武库中的主力战机之一。拥有1门可用于对舰的机载火炮与2门附加伤害的支援机炮，支援机炮在近程还可用于防空。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  }
 ],
 "佩刀Aer410": [
  {
   "name": "佩刀Aer410-强击攻击机",
   "variant": "基础型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 4050,
   "cruise": 3500,
   "warp": 17500,
   "physicalArmor": 3,
   "energyArmor": 3,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "C",
    "siege": "C",
    "survival": "C",
    "strategy": "A",
    "support": "B"
   },
   "firepower": {
    "antiShip": 1692,
    "antiAir": 1491,
    "siege": 1800
   },
   "modules": [],
   "size": 45,
   "maxShip": 10,
   "build": {
    "metal": 6070,
    "crystal": 480,
    "deuterium": 200,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "采用火炮/导弹综合系统的攻击机。用制导导弹攻击中小型舰船，进入射程后用轻型机炮对舰船子系统造成伤害。",
   "story": "佩刀引擎是木星工业开发的新型引擎单元。该引擎的部分技术被应用于其研发中的新型战机，战机也因此得名。",
   "quote": "宇宙如此浩瀚，拥有一两件神秘技术根本不足为奇。——匿名走私者"
  }
 ],
 "牛蛙": [
  {
   "name": "牛蛙-两栖轰炸机",
   "variant": "基础型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 4740,
   "cruise": 2800,
   "warp": 14000,
   "physicalArmor": 3,
   "energyArmor": 3,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "A",
    "antiAir": "—",
    "siege": "—",
    "survival": "C",
    "strategy": "B",
    "support": "B"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": [],
   "size": 70,
   "maxShip": 10,
   "build": {
    "metal": 7130,
    "crystal": 500,
    "deuterium": 190,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "装备大型鱼雷发射系统与2枚攻城用重型攻击鱼雷。可在行星大气层内行动，是攻城战中的强大工具，也可对重型舰船发动攻击。",
   "story": "由诺玛运输集团下属的RB7实验室开发。集团创立之初，该实验室设备简陋、管理不善。然而凭借热情与创造力，它为诺玛运输集团开发了许多先进舰船与武器。如今它已是集团顶尖的舰船研究中心。",
   "quote": "一次轰炸机巡逻抵得上一百次警告。——佐尔坦·李，诺玛运输集团首席战略官"
  }
 ],
 "海氏追随者型": [
  {
   "name": "海氏追随者型-脉冲攻击机",
   "variant": "基础型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 6480,
   "cruise": 3000,
   "warp": 15000,
   "physicalArmor": 3,
   "energyArmor": 3,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "S",
    "antiAir": "A",
    "siege": "A",
    "survival": "—",
    "strategy": "C"
   },
   "firepower": {
    "antiShip": 4614,
    "antiAir": 2214,
    "siege": 1521
   },
   "modules": [],
   "size": 60,
   "maxShip": 8,
   "build": {
    "metal": 9760,
    "crystal": 900,
    "deuterium": 490,
    "time": 0.02,
    "capacity": 0
   },
   "desc": "海雷丁家族特制战机，装备两门充能脉冲炮，可近距离持续打击敌方目标。同时装备独特的复合装甲与强化矢量引擎，确保战场生存能力。",
   "story": "这是一个古老的银河势力，其历史可追溯至淘金热时代初期。当时随着海王星矿业公司倒闭，该家族独立出来，开始经营自己的星系与网络。海王星在家族历史上扮演了极其重要的角色，其祖先将这颗行星的名字与另一个古老的名字融入\"海雷丁\"之中。海雷丁家族由此建立。海雷丁家族专注于舰载机的研发与制造，其战机与护卫护航艇拥有独特的设计美学，",
   "quote": "我们不断回溯过去，共同塑造未来。也许有一天，历史、现在与未来会再次在这拉格朗日网络中相遇。"
  }
 ],
 "林鸮A100型": [
  {
   "name": "林鸮A100型-联合攻击机",
   "variant": "基础型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 4920,
   "cruise": 2800,
   "warp": 14000,
   "physicalArmor": 3,
   "energyArmor": 3,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "survival": "B",
    "strategy": "C",
    "support": "B"
   },
   "firepower": {
    "antiShip": 2529,
    "antiAir": 1749,
    "siege": 504
   },
   "modules": [],
   "size": 40,
   "maxShip": 10,
   "build": {
    "metal": 7460,
    "crystal": 480,
    "deuterium": 200,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "搭载以射程换取伤害的强力充能脉冲炮。适合突击敌舰，同时也能伤害敌方护航艇。",
   "story": "由诺玛运输集团下属的RB7实验室开发。该实验室享有高度自主权，以防止创造力受到官僚体制的束缚与限制。",
   "quote": "官僚体制并非总是坏事；在经济发展的早期阶段，它远比市场经济更为有益。——拉斯洛·杨，资深经济"
  }
 ],
 "砂龙": [
  {
   "name": "砂龙-大气层拦截机",
   "variant": "基础型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 4200,
   "cruise": 2800,
   "warp": 14000,
   "physicalArmor": 3,
   "energyArmor": 3,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "siege": "—",
    "survival": "—",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 1965,
    "antiAir": 1190,
    "siege": 4500
   },
   "modules": [],
   "size": 34,
   "maxShip": 10,
   "build": {
    "metal": 4990,
    "crystal": 440,
    "deuterium": 140,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "装备防空火炮/导弹系统的机动截击机。作为截击机火力强大，采用空气动力学设计，可作为两用载具。",
   "story": "由诺玛运输集团下属的RB7实验室开发。实验室的创新精神广为人知，被称为\"红兽\"，舰船因此得名。",
   "quote": "一个好故事有助于传达心境。——古勒·萨莫伊洛夫在RB7百年庆典上的演讲"
  }
 ],
 "平衡安德森SC020": [
  {
   "name": "平衡安德森SC020-侦察机",
   "variant": "基础型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 3450,
   "cruise": 2800,
   "warp": 14000,
   "physicalArmor": 3,
   "energyArmor": 3,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "B",
    "siege": "—",
    "survival": "—",
    "strategy": "B"
   },
   "firepower": {
    "antiShip": 1700,
    "antiAir": 860,
    "siege": 1800
   },
   "modules": [],
   "size": 35,
   "maxShip": 10,
   "build": {
    "metal": 6030,
    "crystal": 400,
    "deuterium": 160,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "装备电子干扰系统的侦察机，可干扰敌方舰船系统并降低被攻击概率。机动性与生存能力出色，另装备2门火炮攻击各类目标。",
   "story": "以宇宙学先驱与领袖安德森命名。他为不稳定空间节点研究与拉格朗日网络理论作出了巨大贡献。",
   "quote": "哦，你是何等浩瀚，神秘的宇宙，却仍只是永恒蔚蓝中的一粒沙。——安德森《阿贝尔2744的历史》"
  }
 ],
 "SC002型": [
  {
   "name": "SC002型-量子侦察机",
   "variant": "基础型",
   "type": "战机",
   "position": "前排",
   "commandValue": 1,
   "hp": 2850,
   "cruise": 2800,
   "warp": 14000,
   "physicalArmor": 3,
   "energyArmor": 3,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "—",
    "survival": "—",
    "strategy": "A"
   },
   "firepower": {
    "antiShip": 1850,
    "antiAir": 700,
    "siege": 1550
   },
   "modules": [],
   "size": 27,
   "maxShip": 15,
   "build": {
    "metal": 4160,
    "crystal": 300,
    "deuterium": 140,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "标准通用侦察机，用电子战设备骚扰敌舰并降低被攻击概率。机载20mm机炮可干扰各类目标。",
   "story": "SC002，全称002型侦察机，是一艘基于成熟技术的舰船，被各方势力广泛使用。它曾代表灭绝者参加\"奥尔特云战役\"，代表战神军团参加\"新巴纳德星系战役\"。",
   "quote": "如果调查比预期更顺利，那么你只会看到敌人想让你看到的东西。——《奥尔特云战役记录》"
  }
 ],
 "理智级A101": [
  {
   "name": "理智级A101-TE-战斗机",
   "variant": "基础型",
   "type": "战机",
   "position": "中排",
   "commandValue": 1,
   "hp": 4000,
   "cruise": "600~1200",
   "warp": 3200,
   "physicalArmor": 3,
   "energyArmor": 3,
   "serviceLimit": 10,
   "ratings": {
    "antiShip": "—",
    "antiAir": "—",
    "siege": "—",
    "survival": "—",
    "strategy": "—"
   },
   "firepower": {
    "antiShip": 0,
    "antiAir": 0,
    "siege": 0
   },
   "modules": []
  }
 ],
 "寂灭刺客": [
  {
   "name": "寂灭刺客-装甲型",
   "type": "护航艇",
   "position": "前排",
   "size": 88,
   "maxShip": 10,
   "commandValue": 2,
   "hp": 5350,
   "cruise": 2500,
   "warp": 12500,
   "physicalArmor": 0,
   "energyArmor": 0,
   "serviceLimit": 10,
   "firepower": {
    "antiShip": 1800,
    "antiAir": 630,
    "siege": 0
   },
   "ratings": {
    "antiShip": "B",
    "strategy": "B"
   },
   "modules": [
    "高速推进系统",
    "速射炮台系统",
    "装甲系统",
    "指挥系统"
   ],
   "build": {
    "metal": 6310,
    "crystal": 380,
    "deuterium": 80,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "装备3门轻型速射火炮与4台加速高速引擎，对中小型目标非常有效。强化装甲可抵御轻型武器火力。性价比极高的护航艇。",
   "story": "寂灭刺客护航艇因其外观得名，但其强大的火力还为其赢得了\"胖子\"的绰号。",
   "quote": "火力不足的恐惧困扰着每一支舰队。——席琪，盘古集团高级工程师"
  }
 ],
 "破袭者级": [
  {
   "name": "破袭者级-武装运输型",
   "type": "巡洋舰",
   "position": "后排",
   "size": 798,
   "maxShip": 8,
   "commandValue": 14,
   "hp": 48290,
   "cruise": 600,
   "warp": 3000,
   "physicalArmor": 0,
   "energyArmor": 0,
   "serviceLimit": 8,
   "firepower": {
    "antiShip": 2400,
    "antiAir": 383,
    "siege": 256
   },
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "support": "C",
    "survival": "C",
    "strategy": "A"
   },
   "modules": [
    "仓储系统",
    "防御炮台系统",
    "装甲系统",
    "推进系统",
    "指挥系统"
   ],
   "build": {
    "metal": 42250,
    "crystal": 3090,
    "deuterium": 2200,
    "time": 0.07,
    "capacity": 28000
   },
   "desc": "神圣群星帝国海军运输舰，防御能力有限。帝国统治期间大量部署。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  },
  {
   "name": "破袭者级-载机运输型",
   "type": "巡洋舰",
   "position": "后排",
   "size": 798,
   "maxShip": 8,
   "commandValue": 14,
   "hp": 48290,
   "cruise": 600,
   "warp": 3000,
   "physicalArmor": 0,
   "energyArmor": 0,
   "serviceLimit": 8,
   "firepower": {
    "antiShip": 2400,
    "antiAir": 383,
    "siege": 256
   },
   "ratings": {
    "antiShip": "C",
    "antiAir": "C",
    "siege": "C",
    "support": "A",
    "survival": "C",
    "strategy": "B"
   },
   "modules": [
    "舰载机系统",
    "防御炮台系统",
    "装甲系统",
    "推进系统",
    "指挥系统"
   ],
   "build": {
    "metal": 47060,
    "crystal": 3950,
    "deuterium": 3430,
    "time": 0.1,
    "capacity": 28000
   },
   "desc": "神圣群星帝国海军运输舰，防御能力有限。许多武装力量改装其大型货舱以运输舰载机发动突袭。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  }
 ],
 "星空巡游者": [
  {
   "name": "星空巡游者-离子炮型",
   "type": "巡洋舰",
   "position": "中排",
   "size": 850,
   "maxShip": 8,
   "commandValue": 18,
   "hp": 56320,
   "cruise": 450,
   "warp": 2250,
   "physicalArmor": 0,
   "energyArmor": 0,
   "serviceLimit": 8,
   "firepower": {
    "antiShip": 10192,
    "antiAir": 2217,
    "siege": 0
   },
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "support": "C",
    "survival": "C",
    "strategy": "B"
   },
   "modules": [
    "舰首离子炮系统",
    "防空系统",
    "装甲系统",
    "推进系统",
    "指挥系统"
   ],
   "build": {
    "metal": 47020,
    "crystal": 7670,
    "deuterium": 2560,
    "time": 0.11,
    "capacity": 27000
   },
   "desc": "神圣群星帝国海军常用巡洋舰，兼具侦察、防空与进攻能力。雷达模块可在大范围内快速识别敌方空中目标，使防空火炮进行精确打击。舰首安装大型离子炮提供强大突击能力。该巡洋舰注重对大型舰船的火力，但对付驱逐舰、护卫舰等更灵活的目标时力不从心。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  }
 ],
 "阋神星I级": [
  {
   "name": "阋神星I级-轻型速射火炮型",
   "type": "驱逐舰",
   "position": "中排",
   "size": 516,
   "maxShip": 10,
   "commandValue": 7,
   "hp": 30540,
   "cruise": 900,
   "warp": 4500,
   "physicalArmor": 0,
   "energyArmor": 0,
   "serviceLimit": 10,
   "firepower": {
    "antiShip": 3000,
    "antiAir": 269,
    "siege": 320
   },
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "strategy": "A"
   },
   "modules": [
    "阋神星联合炮台系统",
    "装甲系统",
    "指挥系统",
    "推进系统"
   ],
   "build": {
    "metal": 22670,
    "crystal": 2150,
    "deuterium": 500,
    "time": 0.03,
    "capacity": 9000
   },
   "desc": "其特制的\"阋神星\"炮台可兼顾反舰与防空作战。凭借高巡航速度，常被用作快速反应或机动单位。结构简单，制造成本较低。",
   "story": "加利波利卫星城是木星工业的舰船制造基地，拥有多座主力舰船坞与舰载机装配线，为灭绝者提供大量武器装备。冥王星流浪兄弟会曾对加利波利卫星城发动大规模袭击，摧毁了大量船坞与在建舰船，包括数十艘阋神星级驱逐舰。这场灾难性事件后来被称为\"加利波利危机\"。此后，仲裁委员会派遣灭绝者追捕所有流浪兄弟会",
   "quote": "补给线被切断并不意味着战争会停止，只会使它变得更加凶残。——曼恩·赞达尔，秘书长"
  },
  {
   "name": "阋神星I级-重型火炮型",
   "type": "驱逐舰",
   "position": "前排",
   "size": 516,
   "maxShip": 10,
   "commandValue": 7,
   "hp": 30540,
   "cruise": 850,
   "warp": 4250,
   "physicalArmor": 0,
   "energyArmor": 0,
   "serviceLimit": 10,
   "firepower": {
    "antiShip": 4963,
    "antiAir": 1299,
    "siege": 192
   },
   "ratings": {
    "antiShip": "A",
    "antiAir": "C",
    "siege": "B",
    "strategy": "B"
   },
   "modules": [
    "推进系统",
    "指挥系统",
    "阋神星之烬重型火炮",
    "装甲系统"
   ],
   "build": {
    "metal": 23980,
    "crystal": 2830,
    "deuterium": 350,
    "time": 0.03,
    "capacity": 8500
   },
   "desc": "在原有通用炮台基础上，将舰首改装为固定式重型炮台。高机动性使其成为突击行动的首选。可对中型舰船发动快速有效的突击。",
   "story": "加利波利卫星城是木星工业的舰船制造基地，拥有多座主力舰船坞与舰载机装配线，为灭绝者提供大量武器装备。冥王星流浪兄弟会曾对加利波利卫星城发动大规模袭击，摧毁了大量船坞与在建舰船，包括数十艘阋神星级驱逐舰。这场灾难性事件后来被称为\"加利波利危机\"。此后，仲裁委员会派遣灭绝者追捕所有流浪兄弟会",
   "quote": "补给线被切断并不意味着战争会停止，只会使它变得更加凶残。——曼恩·赞达尔，秘书长"
  },
  {
   "name": "阋神星I级-装甲型",
   "type": "驱逐舰",
   "position": "前排",
   "size": 516,
   "maxShip": 10,
   "commandValue": 7,
   "hp": 35140,
   "cruise": 850,
   "warp": 4250,
   "physicalArmor": 0,
   "energyArmor": 0,
   "serviceLimit": 10,
   "firepower": {
    "antiShip": 3000,
    "antiAir": 269,
    "siege": 320
   },
   "ratings": {
    "antiShip": "B",
    "antiAir": "B",
    "siege": "C",
    "strategy": "C"
   },
   "modules": [
    "推进系统",
    "阋神星通用炮台系统",
    "装甲系统",
    "指挥系统"
   ],
   "build": {
    "metal": 25940,
    "crystal": 2700,
    "deuterium": 790,
    "time": 0.05,
    "capacity": 9500
   },
   "desc": "在原有快速反应设计基础上增加附加装甲，成为装甲驱逐舰。以部分机动性换取防御能力，使其在要塞突击等更激烈的战斗场景中成为有效力量。",
   "story": "加利波利卫星城是木星工业的舰船制造基地，拥有多座主力舰船坞与舰载机装配线，为灭绝者提供大量武器装备。冥王星流浪兄弟会曾对加利波利卫星城发动大规模袭击，摧毁了大量船坞与在建舰船，包括数十艘阋神星级驱逐舰。这场灾难性事件后来被称为\"加利波利危机\"。此后，仲裁委员会派遣灭绝者追捕所有流浪兄弟会",
   "quote": "补给线被切断并不意味着战争会停止，只会使它变得更加凶残。——曼恩·赞达尔，秘书长"
  }
 ],
 "赫利俄斯级": [
  {
   "name": "赫利俄斯级-重型火炮突击型",
   "type": "驱逐舰",
   "position": "前排",
   "size": 610,
   "maxShip": 10,
   "commandValue": 15,
   "hp": 44310,
   "cruise": 650,
   "warp": 3250,
   "physicalArmor": 0,
   "energyArmor": 0,
   "serviceLimit": 10,
   "firepower": {
    "antiShip": 9135,
    "antiAir": 1178,
    "siege": 123
   },
   "ratings": {
    "antiShip": "S",
    "antiAir": "C",
    "siege": "B",
    "support": "C",
    "survival": "B",
    "strategy": "C"
   },
   "modules": [
    "舰首综合重型炮台系统",
    "小型炮台系统",
    "装甲系统",
    "推进系统",
    "指挥系统"
   ],
   "build": {
    "metal": 28080,
    "crystal": 3220,
    "deuterium": 660,
    "time": 0.05,
    "capacity": 11000
   },
   "desc": "火力强大的神圣群星帝国海军火炮突击舰。装备2门舰载火炮与5门速射火炮用于集中攻击，火力足以媲美巡洋舰。",
   "story": "这艘舰曾服役于神圣群星帝国第一舰队。帝国覆灭后，其军事装备被无数竞争势力瓜分。因此这艘舰成为银河市场上最常见的型号之一。",
   "quote": "你所踏足之处，皆是我的疆土；那里的凡民，皆是我的子民。——神圣群星帝国楚皇"
  }
 ],
 "孢子A404": [
  {
   "name": "孢子A404-轻型战斗机",
   "type": "战机",
   "position": "前排",
   "size": 23,
   "maxShip": 10,
   "commandValue": 1,
   "hp": 3550,
   "cruise": 3100,
   "warp": 15500,
   "physicalArmor": 0,
   "energyArmor": 0,
   "serviceLimit": 10,
   "firepower": {
    "antiShip": 180,
    "antiAir": 2590,
    "siege": 1850
   },
   "ratings": {
    "antiShip": "C",
    "antiAir": "A",
    "survival": "B",
    "strategy": "A"
   },
   "modules": [
    "机载作战系统",
    "装甲系统",
    "推进系统",
    "指挥系统"
   ],
   "build": {
    "metal": 4640,
    "crystal": 310,
    "deuterium": 120,
    "time": 0.01,
    "capacity": 0
   },
   "desc": "为缠斗设计的轻型战斗机。装备双联机载作战机炮，机动性强，可拦截来袭的敌方舰载机中队或攻击敌方防御舰载机。",
   "story": "孢子战机由木星工业为实施\"去中心化作战理论\"而开发。该理论强调通过有意的去中心化、协作与支援来创造作战优势。其原则与安东尼奥斯的\"蜂巢战术理论\"观点一致。",
   "quote": "陈述自己错误的想法，比宣扬他人的真理更有意义。——《去中心化作战理论的利弊》"
  }
 ]
};
