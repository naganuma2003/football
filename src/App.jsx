import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// PL
const PL_POSITIONS = {
  "Man Utd":     { color: "#DA291C", data: {
    "46/47":2,"47/48":2,"48/49":2,"49/50":4,"50/51":2,"51/52":1,"52/53":8,"53/54":4,"54/55":5,"55/56":1,
    "56/57":1,"57/58":9,"58/59":2,"59/60":7,"60/61":7,"61/62":15,"62/63":19,"63/64":2,"64/65":1,"65/66":4,
    "66/67":1,"67/68":2,"68/69":11,"69/70":8,"70/71":8,"71/72":8,"72/73":18,"73/74":21,"74/75":null,"75/76":3,
    "76/77":6,"77/78":10,"78/79":9,"79/80":2,"80/81":8,"81/82":3,"82/83":3,"83/84":4,"84/85":4,"85/86":4,
    "86/87":11,"87/88":2,"88/89":11,"89/90":13,"90/91":6,"91/92":2,
    "92/93":1,"93/94":1,"94/95":2,"95/96":1,"96/97":1,"97/98":2,"98/99":1,"99/00":1,"00/01":1,"01/02":3,
    "02/03":1,"03/04":3,"04/05":3,"05/06":2,"06/07":1,"07/08":1,"08/09":1,"09/10":2,"10/11":1,"11/12":2,
    "12/13":1,"13/14":7,"14/15":4,"15/16":5,"16/17":6,"17/18":2,"18/19":6,"19/20":3,"20/21":2,"21/22":6,
    "22/23":3,"23/24":8,"24/25":15,"25/26":3,
  }},
  "Liverpool":   { color: "#C8102E", data: {
    "46/47":1,"47/48":11,"48/49":12,"49/50":8,"50/51":9,"51/52":11,"52/53":17,"53/54":22,"54/55":null,"55/56":null,
    "56/57":null,"57/58":null,"58/59":null,"59/60":null,"60/61":null,"61/62":null,"62/63":8,"63/64":1,"64/65":7,"65/66":1,
    "66/67":5,"67/68":3,"68/69":2,"69/70":5,"70/71":5,"71/72":3,"72/73":1,"73/74":2,"74/75":2,"75/76":1,
    "76/77":1,"77/78":2,"78/79":1,"79/80":1,"80/81":5,"81/82":1,"82/83":1,"83/84":1,"84/85":2,"85/86":1,
    "86/87":2,"87/88":1,"88/89":2,"89/90":1,"90/91":2,"91/92":6,
    "92/93":6,"93/94":8,"94/95":4,"95/96":3,"96/97":4,"97/98":3,"98/99":7,"99/00":4,"00/01":3,"01/02":2,
    "02/03":5,"03/04":4,"04/05":5,"05/06":3,"06/07":3,"07/08":4,"08/09":2,"09/10":7,"10/11":6,"11/12":8,
    "12/13":7,"13/14":2,"14/15":6,"15/16":8,"16/17":4,"17/18":4,"18/19":2,"19/20":1,"20/21":3,"21/22":2,
    "22/23":5,"23/24":3,"24/25":1,"25/26":5,
  }},
  "Arsenal":     { color: "#EF0107", data: {
    "46/47":13,"47/48":1,"48/49":5,"49/50":6,"50/51":5,"51/52":3,"52/53":1,"53/54":12,"54/55":9,"55/56":5,
    "56/57":5,"57/58":12,"58/59":3,"59/60":13,"60/61":11,"61/62":10,"62/63":7,"63/64":8,"64/65":13,"65/66":14,
    "66/67":7,"67/68":9,"68/69":4,"69/70":12,"70/71":1,"71/72":5,"72/73":2,"73/74":10,"74/75":16,"75/76":17,
    "76/77":8,"77/78":5,"78/79":7,"79/80":4,"80/81":3,"81/82":5,"82/83":10,"83/84":6,"84/85":7,"85/86":7,
    "86/87":4,"87/88":6,"88/89":1,"89/90":4,"90/91":1,"91/92":4,
    "92/93":10,"93/94":4,"94/95":12,"95/96":5,"96/97":3,"97/98":1,"98/99":2,"99/00":2,"00/01":2,"01/02":1,
    "02/03":2,"03/04":1,"04/05":2,"05/06":4,"06/07":4,"07/08":3,"08/09":4,"09/10":3,"10/11":4,"11/12":3,
    "12/13":4,"13/14":4,"14/15":3,"15/16":2,"16/17":5,"17/18":6,"18/19":5,"19/20":8,"20/21":8,"21/22":5,
    "22/23":2,"23/24":2,"24/25":2,"25/26":1,
  }},
  "Chelsea":     { color: "#034694", data: {
    "46/47":15,"47/48":18,"48/49":13,"49/50":13,"50/51":20,"51/52":19,"52/53":19,"53/54":8,"54/55":1,"55/56":16,
    "56/57":13,"57/58":11,"58/59":14,"59/60":18,"60/61":12,"61/62":22,"62/63":null,"63/64":5,"64/65":3,"65/66":5,
    "66/67":9,"67/68":6,"68/69":5,"69/70":3,"70/71":6,"71/72":7,"72/73":12,"73/74":17,"74/75":21,"75/76":null,
    "76/77":null,"77/78":16,"78/79":22,"79/80":null,"80/81":null,"81/82":null,"82/83":null,"83/84":null,"84/85":6,"85/86":6,
    "86/87":14,"87/88":18,"88/89":null,"89/90":5,"90/91":11,"91/92":14,
    "92/93":11,"93/94":14,"94/95":11,"95/96":11,"96/97":6,"97/98":4,"98/99":3,"99/00":5,"00/01":6,"01/02":6,
    "02/03":4,"03/04":2,"04/05":1,"05/06":1,"06/07":2,"07/08":2,"08/09":3,"09/10":1,"10/11":2,"11/12":6,
    "12/13":3,"13/14":3,"14/15":1,"15/16":10,"16/17":1,"17/18":5,"18/19":3,"19/20":4,"20/21":4,"21/22":3,
    "22/23":12,"23/24":6,"24/25":4,"25/26":9,
  }},
  "Man City":    { color: "#6CABDD", data: {
    "46/47":null,"47/48":10,"48/49":7,"49/50":21,"50/51":null,"51/52":15,"52/53":20,"53/54":17,"54/55":7,"55/56":4,
    "56/57":18,"57/58":5,"58/59":20,"59/60":17,"60/61":13,"61/62":12,"62/63":21,"63/64":null,"64/65":null,"65/66":null,
    "66/67":15,"67/68":1,"68/69":13,"69/70":10,"70/71":11,"71/72":4,"72/73":11,"73/74":14,"74/75":8,"75/76":8,
    "76/77":2,"77/78":4,"78/79":15,"79/80":17,"80/81":12,"81/82":10,"82/83":20,"83/84":null,"84/85":null,"85/86":15,
    "86/87":21,"87/88":null,"88/89":null,"89/90":14,"90/91":5,"91/92":5,
    "92/93":9,"93/94":16,"94/95":17,"95/96":18,"96/97":null,"97/98":null,"98/99":null,"99/00":null,"00/01":18,"01/02":null,
    "02/03":9,"03/04":16,"04/05":8,"05/06":15,"06/07":14,"07/08":9,"08/09":10,"09/10":5,"10/11":3,"11/12":1,
    "12/13":2,"13/14":1,"14/15":2,"15/16":4,"16/17":3,"17/18":1,"18/19":1,"19/20":2,"20/21":1,"21/22":1,
    "22/23":1,"23/24":1,"24/25":3,"25/26":2,
  }},
  "Tottenham":   { color: "#132257", data: {
    "46/47":null,"47/48":null,"48/49":null,"49/50":null,"50/51":1,"51/52":2,"52/53":10,"53/54":16,"54/55":16,"55/56":18,
    "56/57":2,"57/58":3,"58/59":18,"59/60":3,"60/61":1,"61/62":3,"62/63":2,"63/64":4,"64/65":6,"65/66":8,
    "66/67":3,"67/68":7,"68/69":6,"69/70":11,"70/71":3,"71/72":6,"72/73":8,"73/74":11,"74/75":19,"75/76":9,
    "76/77":22,"77/78":null,"78/79":11,"79/80":14,"80/81":10,"81/82":4,"82/83":4,"83/84":8,"84/85":3,"85/86":10,
    "86/87":3,"87/88":13,"88/89":6,"89/90":3,"90/91":10,"91/92":15,
    "92/93":8,"93/94":15,"94/95":7,"95/96":8,"96/97":10,"97/98":14,"98/99":11,"99/00":10,"00/01":12,"01/02":9,
    "02/03":10,"03/04":14,"04/05":9,"05/06":5,"06/07":5,"07/08":11,"08/09":8,"09/10":4,"10/11":5,"11/12":4,
    "12/13":5,"13/14":6,"14/15":5,"15/16":3,"16/17":2,"17/18":3,"18/19":4,"19/20":6,"20/21":7,"21/22":4,
    "22/23":8,"23/24":5,"24/25":17,"25/26":14,
  }},
  "Aston Villa": { color: "#F5A623", data: {
    "46/47":8,"47/48":6,"48/49":10,"49/50":12,"50/51":15,"51/52":6,"52/53":11,"53/54":13,"54/55":6,"55/56":20,
    "56/57":10,"57/58":14,"58/59":21,"59/60":null,"60/61":9,"61/62":7,"62/63":15,"63/64":19,"64/65":16,"65/66":16,
    "66/67":21,"67/68":null,"68/69":null,"69/70":null,"70/71":null,"71/72":null,"72/73":null,"73/74":null,"74/75":null,"75/76":16,
    "76/77":4,"77/78":8,"78/79":8,"79/80":7,"80/81":1,"81/82":11,"82/83":6,"83/84":10,"84/85":10,"85/86":16,
    "86/87":22,"87/88":null,"88/89":17,"89/90":2,"90/91":17,"91/92":7,
    "92/93":2,"93/94":10,"94/95":18,"95/96":4,"96/97":5,"97/98":7,"98/99":6,"99/00":6,"00/01":8,"01/02":8,
    "02/03":16,"03/04":6,"04/05":10,"05/06":16,"06/07":11,"07/08":6,"08/09":6,"09/10":6,"10/11":9,"11/12":16,
    "12/13":15,"13/14":15,"14/15":17,"15/16":20,"16/17":null,"17/18":null,"18/19":null,"19/20":17,"20/21":11,"21/22":14,
    "22/23":7,"23/24":4,"24/25":6,"25/26":4,
  }},
  "Newcastle":   { color: "#A8E10C", data: {
    "46/47":null,"47/48":null,"48/49":4,"49/50":5,"50/51":4,"51/52":8,"52/53":16,"53/54":15,"54/55":8,"55/56":11,
    "56/57":17,"57/58":19,"58/59":11,"59/60":8,"60/61":21,"61/62":null,"62/63":null,"63/64":null,"64/65":null,"65/66":15,
    "66/67":20,"67/68":10,"68/69":9,"69/70":7,"70/71":12,"71/72":11,"72/73":9,"73/74":15,"74/75":15,"75/76":15,
    "76/77":5,"77/78":21,"78/79":null,"79/80":null,"80/81":null,"81/82":null,"82/83":null,"83/84":null,"84/85":14,"85/86":15,
    "86/87":17,"87/88":8,"88/89":20,"89/90":null,"90/91":null,"91/92":null,
    "92/93":null,"93/94":3,"94/95":6,"95/96":2,"96/97":2,"97/98":13,"98/99":13,"99/00":11,"00/01":11,"01/02":4,
    "02/03":3,"03/04":5,"04/05":14,"05/06":7,"06/07":13,"07/08":12,"08/09":18,"09/10":null,"10/11":12,"11/12":5,
    "12/13":16,"13/14":10,"14/15":15,"15/16":18,"16/17":null,"17/18":10,"18/19":13,"19/20":13,"20/21":12,"21/22":11,
    "22/23":4,"23/24":7,"24/25":5,"25/26":10,
  }},
  "Everton":     { color: "#06D6A0", data: {
    "46/47":10,"47/48":14,"48/49":18,"49/50":18,"50/51":22,"51/52":null,"52/53":null,"53/54":null,"54/55":11,"55/56":15,
    "56/57":15,"57/58":16,"58/59":16,"59/60":11,"60/61":5,"61/62":4,"62/63":1,"63/64":3,"64/65":4,"65/66":11,
    "66/67":6,"67/68":5,"68/69":3,"69/70":1,"70/71":14,"71/72":15,"72/73":17,"73/74":7,"74/75":4,"75/76":11,
    "76/77":9,"77/78":3,"78/79":4,"79/80":19,"80/81":15,"81/82":8,"82/83":7,"83/84":7,"84/85":1,"85/86":2,
    "86/87":1,"87/88":4,"88/89":8,"89/90":6,"90/91":9,"91/92":12,
    "92/93":13,"93/94":17,"94/95":15,"95/96":6,"96/97":15,"97/98":17,"98/99":14,"99/00":13,"00/01":16,"01/02":15,
    "02/03":7,"03/04":17,"04/05":4,"05/06":11,"06/07":6,"07/08":5,"08/09":5,"09/10":8,"10/11":7,"11/12":7,
    "12/13":6,"13/14":5,"14/15":11,"15/16":11,"16/17":7,"17/18":8,"18/19":8,"19/20":12,"20/21":10,"21/22":16,
    "22/23":17,"23/24":15,"24/25":13,"25/26":14,
  }},
  "Nottm Forest":{ color: "#FF6B9D", data: {
    "46/47":null,"47/48":null,"48/49":null,"49/50":null,"50/51":null,"51/52":null,"52/53":null,"53/54":null,"54/55":null,"55/56":null,
    "56/57":null,"57/58":10,"58/59":14,"59/60":20,"60/61":14,"61/62":19,"62/63":9,"63/64":13,"64/65":5,"65/66":18,
    "66/67":2,"67/68":11,"68/69":18,"69/70":15,"70/71":16,"71/72":21,"72/73":null,"73/74":null,"74/75":null,"75/76":null,
    "76/77":null,"77/78":1,"78/79":2,"79/80":5,"80/81":7,"81/82":12,"82/83":5,"83/84":3,"84/85":9,"85/86":8,
    "86/87":8,"87/88":3,"88/89":3,"89/90":9,"90/91":8,"91/92":8,
    "92/93":22,"93/94":null,"94/95":3,"95/96":9,"96/97":20,"97/98":null,"98/99":20,"99/00":null,"00/01":null,"01/02":null,
    "02/03":null,"03/04":null,"04/05":null,"05/06":null,"06/07":null,"07/08":null,"08/09":null,"09/10":null,"10/11":null,"11/12":null,
    "12/13":null,"13/14":null,"14/15":null,"15/16":null,"16/17":null,"17/18":null,"18/19":null,"19/20":null,"20/21":null,"21/22":null,
    "22/23":16,"23/24":17,"24/25":7,"25/26":11,
  }},
  "Leicester":   { color: "#FFD700", data: {
    "46/47":null,"47/48":null,"48/49":null,"49/50":null,"50/51":null,"51/52":null,"52/53":null,"53/54":null,"54/55":21,"55/56":null,
    "56/57":null,"57/58":19,"58/59":19,"59/60":12,"60/61":6,"61/62":14,"62/63":4,"63/64":11,"64/65":18,"65/66":7,
    "66/67":8,"67/68":13,"68/69":21,"69/70":null,"70/71":null,"71/72":12,"72/73":16,"73/74":9,"74/75":18,"75/76":7,
    "76/77":11,"77/78":22,"78/79":null,"79/80":21,"80/81":null,"81/82":null,"82/83":null,"83/84":15,"84/85":15,"85/86":19,
    "86/87":20,"87/88":null,"88/89":null,"89/90":null,"90/91":null,"91/92":null,
    "92/93":null,"93/94":null,"94/95":21,"95/96":null,"96/97":9,"97/98":10,"98/99":10,"99/00":8,"00/01":13,"01/02":20,
    "02/03":null,"03/04":18,"04/05":null,"05/06":null,"06/07":null,"07/08":null,"08/09":null,"09/10":null,"10/11":null,"11/12":null,
    "12/13":null,"13/14":null,"14/15":14,"15/16":1,"16/17":12,"17/18":9,"18/19":9,"19/20":5,"20/21":5,"21/22":8,
    "22/23":18,"23/24":null,"24/25":18,"25/26":null,
  }},
  "West Ham":    { color: "#FF8C00", data: {
    "46/47":null,"47/48":null,"48/49":null,"49/50":null,"50/51":null,"51/52":null,"52/53":null,"53/54":null,"54/55":null,"55/56":null,
    "56/57":null,"57/58":null,"58/59":6,"59/60":14,"60/61":16,"61/62":8,"62/63":12,"63/64":14,"64/65":9,"65/66":12,
    "66/67":16,"67/68":12,"68/69":8,"69/70":17,"70/71":20,"71/72":14,"72/73":6,"73/74":18,"74/75":13,"75/76":18,
    "76/77":17,"77/78":20,"78/79":null,"79/80":null,"80/81":null,"81/82":9,"82/83":8,"83/84":9,"84/85":16,"85/86":3,
    "86/87":15,"87/88":16,"88/89":19,"89/90":null,"90/91":null,"91/92":22,
    "92/93":null,"93/94":13,"94/95":14,"95/96":10,"96/97":14,"97/98":8,"98/99":5,"99/00":9,"00/01":15,"01/02":7,
    "02/03":18,"03/04":null,"04/05":null,"05/06":9,"06/07":15,"07/08":10,"08/09":9,"09/10":17,"10/11":20,"11/12":null,
    "12/13":10,"13/14":13,"14/15":12,"15/16":7,"16/17":11,"17/18":13,"18/19":10,"19/20":16,"20/21":6,"21/22":7,
    "22/23":14,"23/24":9,"24/25":14,"25/26":18,
  }},
  "Southampton": { color: "#FF1493", data: {
    "46/47":null,"47/48":null,"48/49":null,"49/50":null,"50/51":null,"51/52":null,"52/53":null,"53/54":null,"54/55":null,"55/56":null,
    "56/57":null,"57/58":null,"58/59":null,"59/60":null,"60/61":null,"61/62":null,"62/63":null,"63/64":null,"64/65":null,"65/66":null,
    "66/67":19,"67/68":16,"68/69":7,"69/70":19,"70/71":7,"71/72":19,"72/73":13,"73/74":20,"74/75":null,"75/76":null,
    "76/77":null,"77/78":null,"78/79":14,"79/80":8,"80/81":6,"81/82":7,"82/83":12,"83/84":2,"84/85":5,"85/86":14,
    "86/87":12,"87/88":15,"88/89":13,"89/90":7,"90/91":14,"91/92":16,
    "92/93":18,"93/94":18,"94/95":10,"95/96":17,"96/97":16,"97/98":12,"98/99":17,"99/00":15,"00/01":10,"01/02":11,
    "02/03":8,"03/04":12,"04/05":20,"05/06":null,"06/07":null,"07/08":null,"08/09":null,"09/10":null,"10/11":null,"11/12":null,
    "12/13":14,"13/14":8,"14/15":7,"15/16":6,"16/17":8,"17/18":17,"18/19":16,"19/20":11,"20/21":15,"21/22":15,
    "22/23":20,"23/24":null,"24/25":20,"25/26":null,
  }},
  "Brighton":    { color: "#00E5FF", data: {
    "46/47":null,"47/48":null,"48/49":null,"49/50":null,"50/51":null,"51/52":null,"52/53":null,"53/54":null,"54/55":null,"55/56":null,
    "56/57":null,"57/58":null,"58/59":null,"59/60":null,"60/61":null,"61/62":null,"62/63":null,"63/64":null,"64/65":null,"65/66":null,
    "66/67":null,"67/68":null,"68/69":null,"69/70":null,"70/71":null,"71/72":null,"72/73":null,"73/74":null,"74/75":null,"75/76":null,
    "76/77":null,"77/78":null,"78/79":null,"79/80":16,"80/81":19,"81/82":13,"82/83":22,"83/84":null,"84/85":null,"85/86":null,
    "86/87":null,"87/88":null,"88/89":null,"89/90":null,"90/91":null,"91/92":null,
    "92/93":null,"93/94":null,"94/95":null,"95/96":null,"96/97":null,"97/98":null,"98/99":null,"99/00":null,"00/01":null,"01/02":null,
    "02/03":null,"03/04":null,"04/05":null,"05/06":null,"06/07":null,"07/08":null,"08/09":null,"09/10":null,"10/11":null,"11/12":null,
    "12/13":null,"13/14":null,"14/15":null,"15/16":null,"16/17":null,"17/18":15,"18/19":17,"19/20":15,"20/21":16,"21/22":9,
    "22/23":6,"23/24":11,"24/25":8,"25/26":8,
  }},
  "Crystal Palace": { color: "#B388FF", data: {
    "46/47":null,"47/48":null,"48/49":null,"49/50":null,"50/51":null,"51/52":null,"52/53":null,"53/54":null,"54/55":null,"55/56":null,
    "56/57":null,"57/58":null,"58/59":null,"59/60":null,"60/61":null,"61/62":null,"62/63":null,"63/64":null,"64/65":null,"65/66":null,
    "66/67":null,"67/68":null,"68/69":null,"69/70":20,"70/71":18,"71/72":20,"72/73":21,"73/74":null,"74/75":null,"75/76":null,
    "76/77":null,"77/78":null,"78/79":null,"79/80":13,"80/81":22,"81/82":null,"82/83":null,"83/84":null,"84/85":null,"85/86":null,
    "86/87":null,"87/88":null,"88/89":null,"89/90":15,"90/91":3,"91/92":10,
    "92/93":20,"93/94":null,"94/95":19,"95/96":null,"96/97":null,"97/98":20,"98/99":null,"99/00":null,"00/01":null,"01/02":null,
    "02/03":null,"03/04":null,"04/05":18,"05/06":null,"06/07":null,"07/08":null,"08/09":null,"09/10":null,"10/11":null,"11/12":null,
    "12/13":null,"13/14":11,"14/15":10,"15/16":15,"16/17":14,"17/18":11,"18/19":12,"19/20":14,"20/21":14,"21/22":12,
    "22/23":11,"23/24":10,"24/25":12,"25/26":13,
  }},
  "Sheff Wed":   { color: "#76FF03", data: {
    "46/47":18,"47/48":null,"48/49":null,"49/50":22,"50/51":null,"51/52":null,"52/53":null,"53/54":null,"54/55":19,"55/56":22,
    "56/57":null,"57/58":null,"58/59":15,"59/60":5,"60/61":2,"61/62":6,"62/63":6,"63/64":6,"64/65":8,"65/66":17,
    "66/67":11,"67/68":15,"68/69":15,"69/70":22,"70/71":null,"71/72":null,"72/73":null,"73/74":null,"74/75":null,"75/76":null,
    "76/77":null,"77/78":null,"78/79":null,"79/80":null,"80/81":null,"81/82":null,"82/83":null,"83/84":null,"84/85":8,"85/86":5,
    "86/87":13,"87/88":11,"88/89":15,"89/90":18,"90/91":null,"91/92":3,
    "92/93":7,"93/94":7,"94/95":13,"95/96":15,"96/97":7,"97/98":16,"98/99":12,"99/00":19,"00/01":null,"01/02":null,
    "02/03":null,"03/04":null,"04/05":null,"05/06":null,"06/07":null,"07/08":null,"08/09":null,"09/10":null,"10/11":null,"11/12":null,
    "12/13":null,"13/14":null,"14/15":null,"15/16":null,"16/17":null,"17/18":null,"18/19":null,"19/20":null,"20/21":null,"21/22":null,
    "22/23":null,"23/24":null,"24/25":null,"25/26":null,
  }},
  "Ipswich":     { color: "#0044A0", data: {
    "46/47":null,"47/48":null,"48/49":null,"49/50":null,"50/51":null,"51/52":null,"52/53":null,"53/54":null,"54/55":null,"55/56":null,
    "56/57":null,"57/58":null,"58/59":null,"59/60":null,"60/61":null,"61/62":1,"62/63":17,"63/64":22,"64/65":22,"65/66":15,
    "66/67":5,"67/68":18,"68/69":12,"69/70":18,"70/71":19,"71/72":13,"72/73":4,"73/74":4,"74/75":3,"75/76":6,
    "76/77":3,"77/78":18,"78/79":6,"79/80":3,"80/81":2,"81/82":1,"82/83":9,"83/84":12,"84/85":17,"85/86":20,
    "86/87":null,"87/88":null,"88/89":null,"89/90":null,"90/91":null,"91/92":null,
    "92/93":16,"93/94":19,"94/95":22,"95/96":null,"96/97":null,"97/98":null,"98/99":null,"99/00":null,"00/01":5,"01/02":18,
    "02/03":null,"03/04":null,"04/05":null,"05/06":null,"06/07":null,"07/08":null,"08/09":null,"09/10":null,"10/11":null,"11/12":null,
    "12/13":null,"13/14":null,"14/15":null,"15/16":null,"16/17":null,"17/18":null,"18/19":null,"19/20":null,"20/21":null,"21/22":null,
    "22/23":null,"23/24":null,"24/25":18,"25/26":null,
  }},
};

const PL_NAMES = {
  "Man Utd":"マンU","Liverpool":"リバプール","Arsenal":"アーセナル","Chelsea":"チェルシー",
  "Man City":"マンC","Tottenham":"トッテナム","Aston Villa":"ヴィラ","Newcastle":"ニューカッスル",
  "Everton":"エヴァートン","Nottm Forest":"フォレスト","Leicester":"レスター","West Ham":"ウェストハム",
  "Southampton":"サウサンプトン","Brighton":"ブライトン","Crystal Palace":"パレス",
  "Sheff Wed":"シェフW","Ipswich":"イプスウィッチ",
};

const THREE_PT_YEAR = { PL: 1982, LAL: 1996, BUN: 1996, SA: 1995, L1: 1995 };

function estimatePts(position, season, leagueKey) {
  if (position == null) return 0;
  const yr = parseInt(season.slice(0,2));
  const year = yr >= 26 ? 1900 + yr : 2000 + yr;
  const threePtYear = THREE_PT_YEAR[leagueKey] || 1982;
  const is3pt = year >= threePtYear;
  const teams = leagueKey === "BUN" ? 18 : (year >= 1995 ? 20 : year >= 1988 ? 20 : 22);
  const games = (teams - 1) * 2;
  const maxPts = is3pt ? Math.round(games * 2.4) : Math.round(games * 1.7);
  const minPts = is3pt ? Math.round(games * 0.8) : Math.round(games * 0.55);
  const fraction = (teams - position) / (teams - 1);
  return Math.round(minPts + fraction * (maxPts - minPts));
}

const LEAGUE_CONFIG = {
  PL: {
    label: "プレミアリーグ", color: "#00B4D8",
    positions: PL_POSITIONS, names: PL_NAMES,
    bigGroup: ["Man Utd","Liverpool","Arsenal","Chelsea","Man City","Tottenham"],
    bigLabel: "ビッグ6", yMax: 22, yTicks: [1,4,8,12,16,20,22],
    threePointSeason: "81/82",
  },
};

function seasonToYear(s) {
  const yr = parseInt(s.slice(0,2));
  return yr >= 26 ? 1900 + yr : 2000 + yr;
}

const qbtn = (color, dim=false) => ({
  background: dim ? "#111" : `${color}22`,
  color: color,
  border: `1px solid ${color}`,
  borderRadius: 3, padding:"4px 12px", fontSize:11, fontWeight:700, cursor:"pointer",
  fontFamily:"sans-serif",
});

function LeagueHistoryView({ leagueKey }) {
  const cfg = LEAGUE_CONFIG[leagueKey];
  const POSITIONS = cfg.positions;
  const TEAM_NAMES_JP = cfg.names;
  const BIG_GROUP = cfg.bigGroup;
  const ALL_TEAMS = Object.keys(POSITIONS);
  const ALL_SEASONS = Object.keys(POSITIONS[ALL_TEAMS[0]].data);

  const allYears = ALL_SEASONS.map(seasonToYear);
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);

  const [selected, setSelected] = useState(new Set(BIG_GROUP));
  const [zoomTop6, setZoomTop6] = useState(false);
  const [yearFrom, setYearFrom] = useState(1992);
  const [yearTo, setYearTo] = useState(maxYear);

  const toggle = (team) => setSelected(prev => {
    const n = new Set(prev); n.has(team) ? n.delete(team) : n.add(team); return n;
  });

  const visibleSeasons = useMemo(() =>
    ALL_SEASONS.filter(s => { const y = seasonToYear(s); return y >= yearFrom && y <= yearTo; }),
    [yearFrom, yearTo]
  );

  const chartData = useMemo(() => visibleSeasons.map(season => {
    const row = { season };
    [...selected].forEach(team => { row[team] = POSITIONS[team]?.data[season]; });
    return row;
  }), [selected, visibleSeasons]);

  const trophies = useMemo(() => {
    const result = {};
    [...selected].forEach(team => {
      if (!POSITIONS[team]) return;
      let titles=0, runners=0, top4=0;
      Object.entries(POSITIONS[team].data).forEach(([,pos]) => {
        if (pos === 1) titles++;
        if (pos === 2) runners++;
        if (pos != null && pos <= 4) top4++;
      });
      result[team] = { titles, runners, top4 };
    });
    return result;
  }, [selected]);

  const Tooltip2 = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const sorted = [...payload].filter(p => p.value != null).sort((a,b) => a.value - b.value);
    return (
      <div style={{ background:"#0a0a14",border:"1px solid #252535",borderRadius:4,padding:"10px 14px",fontFamily:"monospace",fontSize:11,minWidth:180 }}>
        <div style={{ color:"#888",marginBottom:6,fontSize:10,letterSpacing:2 }}>{label}</div>
        {sorted.map(p => (
          <div key={p.dataKey} style={{ display:"flex",justifyContent:"space-between",gap:10,color:p.color,marginBottom:2 }}>
            <span>{TEAM_NAMES_JP[p.dataKey]||p.dataKey}</span>
            <span style={{ fontWeight:700 }}>{p.value===1?"🏆 ":p.value<=4?"✓ ":""}{p.value}位</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div style={{ background:"#0b0c14",border:"1px solid #1a1a28",borderRadius:4,padding:"12px 16px",marginBottom:12 }}>
        <div style={{ display:"flex",gap:12,flexWrap:"wrap",alignItems:"center" }}>
          <span style={{ fontSize:10,color:"#9B5DE5",letterSpacing:2,fontWeight:700 }}>表示期間</span>
          <div style={{ display:"flex",alignItems:"center",gap:8,flex:1,minWidth:180 }}>
            <span style={{ fontSize:10,color:"#555" }}>開始</span>
            <input type="range" min={minYear} max={yearTo-1} value={yearFrom}
              onChange={e => setYearFrom(Number(e.target.value))}
              style={{ flex:1,accentColor:"#9B5DE5" }} />
            <span style={{ fontSize:11,color:"#FFD700",fontWeight:700,minWidth:36,textAlign:"right" }}>{yearFrom}</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8,flex:1,minWidth:180 }}>
            <span style={{ fontSize:10,color:"#555" }}>終了</span>
            <input type="range" min={yearFrom+1} max={maxYear} value={yearTo}
              onChange={e => setYearTo(Number(e.target.value))}
              style={{ flex:1,accentColor:"#9B5DE5" }} />
            <span style={{ fontSize:11,color:"#FFD700",fontWeight:700,minWidth:36,textAlign:"right" }}>{yearTo}</span>
          </div>
          <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
            {[
              { label:"全期間",from:minYear,to:maxYear },
              { label:"PL時代",from:1992,to:maxYear },
              { label:"2000〜",from:2000,to:maxYear },
              { label:"2010〜",from:2010,to:maxYear },
            ].map(({ label,from,to }) => (
              <button key={label} onClick={() => { setYearFrom(from); setYearTo(to); }} style={{
                background:yearFrom===from&&yearTo===to?"#9B5DE5":"#111",
                color:yearFrom===from&&yearTo===to?"#fff":"#555",
                border:`1px solid ${yearFrom===from&&yearTo===to?"#9B5DE5":"#333"}`,
                borderRadius:3,padding:"3px 8px",fontSize:10,cursor:"pointer",
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:"flex",justifyContent:"center",gap:6,marginBottom:8,flexWrap:"wrap" }}>
        <button onClick={() => setSelected(new Set(BIG_GROUP))} style={qbtn("#9B5DE5")}>{cfg.bigLabel}だけ</button>
        <button onClick={() => setSelected(new Set(ALL_TEAMS.filter(t=>!BIG_GROUP.includes(t))))} style={qbtn("#F5A623")}>{cfg.bigLabel}オフ</button>
        <button onClick={() => setSelected(new Set(ALL_TEAMS))} style={qbtn("#06D6A0")}>全部選択</button>
        <button onClick={() => setSelected(new Set())} style={qbtn("#555",true)}>全解除</button>
      </div>

      <div style={{ display:"flex",justifyContent:"center",gap:5,marginBottom:10,flexWrap:"wrap" }}>
        {ALL_TEAMS.map(team => {
          const on = selected.has(team);
          const c = POSITIONS[team]?.color || "#888";
          const lightColors = ["#FFFFFF","#FDE100","#FFE600","#FFD700","#A8E10C","#76FF03"];
          return (
            <button key={team} onClick={() => toggle(team)} style={{
              background:on?c:"#111",
              color:on?(lightColors.includes(c)?"#000":"#fff"):"#555",
              border:`1px solid ${on?c:"#222"}`,
              borderRadius:3,padding:"3px 8px",fontSize:10,cursor:"pointer",fontWeight:on?700:400,
            }}>{TEAM_NAMES_JP[team]||team}</button>
          );
        })}
      </div>

      <div style={{ display:"flex",justifyContent:"center",gap:8,marginBottom:14 }}>
        <button onClick={() => setZoomTop6(v=>!v)} style={{
          background:zoomTop6?"#9B5DE5":"#111",color:zoomTop6?"#fff":"#555",
          border:`1px solid ${zoomTop6?"#9B5DE5":"#222"}`,borderRadius:3,padding:"4px 14px",fontSize:11,cursor:"pointer",
        }}>{zoomTop6?"✓ 上位6位ズーム中":"上位6位ズーム"}</button>
      </div>

      <div style={{ background:"#0b0c14",border:"1px solid #1a1a28",borderRadius:4,padding:"20px 8px 12px 0",marginBottom:16 }}>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={chartData} margin={{ top:8,right:24,left:0,bottom:30 }}>
            <CartesianGrid stroke="#131320" strokeDasharray="3 3" />
            <XAxis dataKey="season"
              tick={{ fill:"#555",fontSize:9,fontFamily:"monospace" }}
              tickLine={false} axisLine={{ stroke:"#252535" }}
              angle={-45} textAnchor="end"
              interval={Math.max(0,Math.floor(visibleSeasons.length/24))} />
            <YAxis reversed
              domain={zoomTop6?[1,6]:[1,cfg.yMax]}
              ticks={zoomTop6?[1,2,3,4,5,6]:cfg.yTicks}
              tick={{ fill:"#555",fontSize:10,fontFamily:"monospace" }}
              tickLine={false} axisLine={false} width={36}
              tickFormatter={v=>`${v}位`} />
            {!zoomTop6 && (
              <ReferenceLine y={4} stroke="#FFD70044" strokeDasharray="4 2"
                label={{ value:"CL圏",fill:"#FFD70088",fontSize:9,position:"right" }} />
            )}
            <ReferenceLine y={1} stroke="#FFD70066" strokeDasharray="2 2" />
            {visibleSeasons.includes(cfg.threePointSeason) && (
              <ReferenceLine x={cfg.threePointSeason}
                stroke="#FF8C0099" strokeWidth={1.5} strokeDasharray="4 3"
                label={{ value:"3pt制",fill:"#FF8C00cc",fontSize:9,position:"insideTopLeft",offset:4 }} />
            )}
            <Tooltip content={<Tooltip2 />} />
            {[...selected].map(team => (
              <Line key={team} type="monotone" dataKey={team}
                stroke={POSITIONS[team]?.color||"#888"} strokeWidth={2}
                dot={{ r:2,fill:POSITIONS[team]?.color||"#888" }}
                activeDot={{ r:5,stroke:"#fff",strokeWidth:1 }}
                connectNulls={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background:"#0b0c14",border:"1px solid #1a1a28",borderRadius:4,padding:"14px 16px" }}>
        <div style={{ fontSize:10,color:"#555",marginBottom:10,letterSpacing:2 }}>通算成績（選択チームのみ）</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8 }}>
          {[...selected].filter(t=>POSITIONS[t]&&trophies[t]).sort((a,b)=>trophies[b].titles-trophies[a].titles).map(team => {
            const t = trophies[team];
            const c = POSITIONS[team]?.color || "#888";
            return (
              <div key={team} style={{ background:"#0e0e18",border:`1px solid ${c}44`,borderRadius:4,padding:"8px 10px" }}>
                <div style={{ color:c,fontSize:11,fontWeight:700,marginBottom:4 }}>{TEAM_NAMES_JP[team]||team}</div>
                <div style={{ fontSize:10,color:"#888",lineHeight:1.7 }}>
                  🏆 <span style={{ color:"#FFD700",fontWeight:700 }}>{t.titles}</span>
                  {" "}/ 🥈 <span style={{ color:"#aaa" }}>{t.runners}</span>
                  {" "}/ ✓Top4 <span style={{ color:"#06D6A0" }}>{t.top4}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ background:"#07080e",minHeight:"100vh",color:"#ccc",fontFamily:"'Noto Sans JP',sans-serif",padding:"20px 14px" }}>
      <div style={{ textAlign:"center",marginBottom:20 }}>
        <div style={{ fontSize:28,fontWeight:900,letterSpacing:5,color:"#fff",lineHeight:1 }}>
          FOOTBALL STATS HUB
        </div>
        <div style={{ fontSize:10,color:"#444",letterSpacing:3,marginTop:4 }}>
          プレミアリーグ 歴代順位
        </div>
      </div>
      <LeagueHistoryView leagueKey="PL" />
      <div style={{ textAlign:"center",fontSize:9,color:"#252535",marginTop:30 }}>
        フットボール統計アプリ — プレミアリーグ歴代順位
      </div>
    </div>
  );
}
