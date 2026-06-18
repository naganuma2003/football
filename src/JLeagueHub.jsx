import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// ─── J1 順位データ ─────────────────────────────────────────────
const J1 = {
  "鹿島":    { color:"#8B0000", data:{1993:2,1994:2,1995:6,1996:1,1997:2,1998:1,1999:2,2000:2,2001:1,2002:2,2003:4,2004:6,2005:2,2006:2,2007:1,2008:1,2009:1,2010:3,2011:2,2012:5,2013:6,2014:4,2015:2,2016:1,2017:4,2018:3,2019:3,2020:6,2021:9,2022:2,2023:3,2024:2,2025:1}},
  "横浜FM":  { color:"#0066B3", data:{1993:4,1994:3,1995:1,1996:2,1997:3,1998:3,1999:5,2000:5,2001:3,2002:4,2003:1,2004:1,2005:4,2006:7,2007:4,2008:5,2009:4,2010:4,2011:3,2012:3,2013:4,2014:3,2015:6,2016:2,2017:8,2018:3,2019:1,2020:4,2021:2,2022:1,2023:2,2024:7,2025:20}},
  "浦和":    { color:"#E60012", data:{1993:7,1994:5,1995:8,1996:5,1997:4,1998:4,1999:15,2001:4,2002:5,2003:3,2004:1,2005:3,2006:1,2007:5,2008:7,2009:6,2010:4,2011:7,2012:8,2013:2,2014:2,2015:3,2016:3,2017:3,2018:4,2019:5,2020:5,2021:4,2022:6,2023:5,2024:5,2025:3}},
  "ガンバ":  { color:"#003DA5", data:{1993:5,1994:8,1995:13,1996:6,1997:5,1998:9,1999:7,2000:8,2001:6,2002:7,2003:5,2004:4,2005:1,2006:5,2007:3,2008:3,2009:3,2010:2,2011:5,2012:17,2014:1,2015:4,2016:4,2017:5,2018:13,2019:7,2020:7,2021:12,2022:7,2023:7,2024:14,2025:12}},
  "川崎":    { color:"#009BDB", data:{2002:12,2003:8,2004:7,2005:6,2006:3,2007:2,2008:2,2009:2,2010:4,2011:4,2012:2,2013:3,2014:5,2015:5,2016:6,2017:1,2018:1,2019:4,2020:1,2021:1,2022:5,2023:4,2024:4,2025:7}},
  "名古屋":  { color:"#B22222", data:{1993:8,1994:2,1995:2,1996:3,1997:9,1998:7,1999:6,2000:6,2001:8,2002:9,2003:10,2004:8,2005:8,2006:10,2007:6,2008:4,2009:5,2010:1,2011:6,2012:5,2013:7,2018:6,2019:13,2020:3,2021:10,2022:14,2023:6,2024:15,2025:14}},
  "磐田":    { color:"#EEEEEE", data:{1994:4,1995:9,1996:4,1997:1,1998:2,1999:1,2000:3,2001:2,2002:1,2003:2,2004:3,2005:7,2006:8,2007:7,2008:10,2009:15,2013:9,2014:8,2015:8,2016:7,2018:16,2019:16,2022:12,2024:12}},
  "広島":    { color:"#9B0041", data:{1993:9,1994:6,1995:12,1996:9,1997:7,1998:10,1999:14,2000:13,2001:9,2002:3,2003:6,2004:5,2005:9,2006:12,2007:10,2008:9,2009:9,2010:8,2011:10,2012:1,2013:1,2017:2,2018:5,2019:6,2020:2,2021:5,2022:11,2023:9,2024:3,2025:5}},
  "神戸":    { color:"#FF1744", data:{1995:14,1996:10,1997:10,1998:8,1999:10,2000:11,2001:12,2002:8,2003:11,2004:10,2005:14,2006:13,2007:14,2008:15,2013:11,2014:10,2015:11,2016:9,2017:6,2018:9,2019:8,2020:8,2021:3,2022:3,2023:1,2024:1,2025:6}},
  "柏":      { color:"#FFD700", data:{1995:5,1996:8,1997:8,1998:5,1999:9,2000:10,2001:14,2011:1,2012:7,2013:13,2014:9,2015:7,2016:8,2017:12,2018:16,2021:11,2022:4,2023:8,2024:9,2025:4}},
  "FC東京":  { color:"#1565C0", data:{2000:2,2001:5,2002:6,2003:7,2004:9,2005:5,2006:6,2007:9,2008:8,2009:11,2010:6,2011:8,2012:6,2013:10,2014:7,2015:13,2016:5,2017:7,2018:7,2019:2,2020:9,2021:6,2022:9,2023:11,2024:17,2025:18}},
  "清水":    { color:"#F39800", data:{1993:3,1994:1,1995:4,1996:7,1997:6,1998:6,1999:3,2000:7,2001:7,2002:11,2003:9,2004:12,2005:13,2006:9,2007:11,2008:6,2009:7,2010:7,2011:9,2012:9,2013:12,2015:12,2016:15,2017:9,2018:11,2022:16,2025:9}},
  "C大阪":   { color:"#E95599", data:{1995:10,2001:10,2006:11,2007:12,2010:9,2011:13,2012:10,2015:16,2016:11,2017:10,2018:12,2019:5,2020:10,2021:8,2022:8,2023:12,2024:6,2025:8}},
  "京都":    { color:"#6C2D8F", data:{1997:11,1998:12,1999:12,2005:11,2023:14,2025:2}},
  "鳥栖":    { color:"#0E4C96", data:{2012:6,2013:8,2014:6,2015:9,2016:10,2017:14,2018:2,2019:9,2020:13,2021:7,2022:13,2023:15,2024:8}},
  "湘南":    { color:"#1A8C4E", data:{1993:10,1994:10,1995:14,2010:14,2011:14,2015:10,2018:14,2019:15,2020:15,2021:17,2023:13,2024:18,2025:16}},
  "札幌":    { color:"#BE0026", data:{1998:11,2017:13,2018:10,2019:10,2020:11,2021:14,2022:10,2023:16,2024:10}},
  "仙台":    { color:"#F0C030", data:{2009:12,2010:10,2011:12,2014:12,2015:14,2016:12,2017:11,2018:8,2019:11,2020:12,2021:18}},
  "東京V":   { color:"#00A040", data:{1993:1,1994:1,2009:16,2024:13,2025:13}},
  "横浜FC":  { color:"#0055A2", data:{2020:16,2021:16,2023:18,2024:16,2025:17}},
  "横浜F":   { color:"#1B4F8A", data:{1993:6,1994:7,1995:11,1996:4,1997:8,1998:6}},
  "市原":    { color:"#FF6B00", data:{1993:1,1994:9,1995:7,1996:8,1997:12,1998:16}},
  "平塚":    { color:"#005BAC", data:{1994:11,1995:5,1996:11,1997:13,1998:13}},
  "福岡":    { color:"#0044AA", data:{1996:14,1997:15,1998:9,1999:16,2007:16,2009:14,2011:16,2012:16,2013:14,2021:15,2022:15,2023:10,2024:11,2025:11}},
  "大分":    { color:"#1976B0", data:{2003:12,2004:14,2005:15,2006:15,2008:12,2009:16,2010:16,2012:15,2013:17,2019:12,2020:14,2021:19}},
  "新潟":    { color:"#F06400", data:{2004:11,2005:11,2006:4,2007:5,2008:11,2009:10,2010:9,2011:11,2012:14,2013:16,2022:17,2023:17}},
  "甲府":    { color:"#6633CC", data:{2007:15,2008:16,2013:8,2014:13,2015:17,2022:18}},
  "大宮":    { color:"#FF6B00", data:{2009:7,2010:12,2011:17,2012:13,2013:12,2014:16,2015:15,2016:16,2017:16}},
  "千葉":    { color:"#009900", data:{1999:1,2000:1,2001:11,2002:10,2003:13,2004:15,2005:12,2006:8,2007:13,2008:14}},
  "山形":    { color:"#990033", data:{2010:15,2011:15}},
  "岡山":    { color:"#00549A", data:{2025:10}},
  "長崎":    { color:"#2196A0", data:{2018:17,2019:17}},
  "松本":    { color:"#006633", data:{2014:17,2015:16,2018:17,2019:20}},
  "徳島":    { color:"#00838F", data:{2014:18,2021:20}},
  "讃岐":    { color:"#FFAA00", data:{}},
  "京都S":   { color:"#6C2D8F", data:{2022:20}},
  "町田":    { color:"#002D72", data:{2024:6,2025:15}},
  "いわき":  { color:"#E60000", data:{2024:19}},
  "栃木":    { color:"#FFDD00", data:{}},
};

// ─── J2 順位データ ──────────────────────────────────────────────
const J2 = {
  "浦和":    { color:"#E60012", data:{2000:2}},
  "ガンバ":  { color:"#003DA5", data:{2013:1}},
  "大宮":    { color:"#FF6B00", data:{1999:4,2000:4,2001:8,2002:7,2003:9,2004:5,2005:6,2006:10,2007:6,2008:1,2018:2,2019:12,2020:7,2021:12,2022:11,2023:11,2024:4,2025:3}},
  "千葉":    { color:"#009900", data:{2010:4,2011:5,2012:7,2013:7,2014:6,2015:5,2016:12,2017:11,2018:5,2019:7,2020:8,2021:14,2022:5,2023:5,2024:7,2025:2}},
  "岡山":    { color:"#00549A", data:{2014:18,2015:16,2016:8,2017:5,2018:7,2019:4,2020:9,2021:8,2022:9,2023:4}},
  "水戸":    { color:"#0066CC", data:{2001:14,2002:14,2003:13,2004:16,2005:17,2006:16,2007:14,2008:17,2009:18,2010:19,2011:13,2012:15,2013:18,2014:22,2015:18,2016:18,2017:9,2018:6,2019:10,2020:10,2021:16,2022:22,2023:18,2024:15,2025:6}},
  "山形":    { color:"#990033", data:{1999:6,2000:7,2001:6,2002:8,2003:8,2004:11,2005:5,2006:7,2007:4,2008:4,2009:5,2012:8,2013:3,2014:12,2015:9,2016:16,2017:13,2018:4,2019:9,2020:11,2021:15,2022:16,2023:8,2024:11,2025:7}},
  "熊本":    { color:"#E53935", data:{2012:22,2013:16,2014:7,2015:8,2016:15,2017:12,2018:9,2019:5,2020:14,2021:3,2022:6,2023:6,2024:13,2025:11}},
  "長崎":    { color:"#2196A0", data:{2009:9,2010:12,2011:3,2012:2,2013:5,2014:2,2015:4,2016:14,2017:2,2020:17,2021:7,2022:8,2023:1,2024:8,2025:10}},
  "徳島":    { color:"#00838F", data:{2006:13,2007:13,2008:3,2009:6,2010:8,2011:2,2012:4,2015:6,2016:5,2017:1,2022:4,2023:9,2024:12,2025:9}},
  "愛媛":    { color:"#E8380D", data:{2006:1,2007:2,2008:7,2009:4,2010:13,2011:12,2012:12,2013:15,2014:16,2015:13,2016:11,2017:16,2018:11,2019:14,2020:5,2021:10,2022:14,2023:14,2024:14,2025:15}},
  "琉球":    { color:"#C8001E", data:{2019:2,2020:13,2021:13,2022:18,2023:17,2024:20,2025:19}},
  "新潟":    { color:"#F06400", data:{1999:10,2000:11,2001:9,2002:4,2003:1,2023:1}},
  "甲府":    { color:"#6633CC", data:{1999:9,2000:10,2001:12,2002:11,2003:7,2004:3,2005:10,2006:1,2009:5,2010:7,2011:10,2012:1,2016:4,2017:7,2018:15,2019:18,2020:6,2021:4,2023:16,2024:9,2025:17}},
  "仙台":    { color:"#F0C030", data:{1999:5,2000:6,2001:4,2002:1,2003:4,2004:4,2005:1,2006:5,2007:7,2008:9,2022:6,2023:2,2024:3,2025:5}},
  "磐田":    { color:"#EEEEEE", data:{2010:1,2011:1,2012:3,2017:1,2020:2,2021:4,2023:8,2025:8}},
  "広島":    { color:"#9B0041", data:{2014:1,2015:4,2016:3}},
  "神戸":    { color:"#FF1744", data:{2009:3,2010:5,2011:6,2012:6}},
  "名古屋":  { color:"#B22222", data:{2014:1,2015:2,2016:3,2017:2}},
  "清水":    { color:"#F39800", data:{2014:3,2019:1,2020:3,2023:3,2024:2}},
  "C大阪":   { color:"#E95599", data:{1999:2,2000:2,2002:2,2003:6,2004:10,2008:5,2009:4,2013:4}},
  "福岡":    { color:"#0044AA", data:{2000:5,2001:7,2002:6,2003:5,2004:8,2005:14,2006:4,2008:6,2010:13,2012:17,2013:3,2014:3,2015:3,2016:6,2017:15,2018:3,2019:4,2020:1}},
  "大分":    { color:"#1976B0", data:{1999:8,2000:9,2001:5,2002:5,2006:2,2007:1,2011:3,2012:3,2013:1,2014:4,2015:2,2016:2,2017:3,2018:1,2022:16,2023:12,2024:5,2025:16}},
  "京都":    { color:"#6C2D8F", data:{1999:12,2000:15,2006:5,2007:10,2008:2,2009:1,2010:3,2011:2,2012:2,2013:2,2014:5,2015:11,2016:9,2017:8,2018:8,2019:11,2020:4,2021:2,2022:3,2024:14}},
  "東京V":   { color:"#00A040", data:{1999:11,2000:12,2001:13,2002:9,2003:10,2004:7,2005:4,2006:2,2007:5,2008:10,2010:9,2011:8,2012:5,2013:6,2014:9,2015:2,2016:7,2017:10,2018:13,2019:16,2020:9,2021:9,2022:3,2023:3}},
  "横浜FC":  { color:"#0055A2", data:{2001:1,2002:13,2003:14,2004:13,2005:7,2006:1,2007:11,2008:16,2009:17,2010:18,2011:17,2012:19,2013:11,2014:14,2015:14,2016:13,2017:18,2018:19,2019:1,2022:7,2023:5}},
  "湘南":    { color:"#1A8C4E", data:{1999:7,2000:16,2001:16,2002:16,2003:11,2004:9,2005:9,2006:14,2007:12,2008:13,2009:13,2012:6,2013:4,2014:1,2016:2,2017:3,2019:2,2020:12,2021:5,2022:10}},
  "柏":      { color:"#FFD700", data:{2002:1,2003:3,2004:6,2005:2,2006:3,2007:8,2008:8,2009:3,2010:2,2019:1,2020:1}},
  "松本":    { color:"#006633", data:{2010:11,2011:9,2012:6,2013:1,2016:5,2017:6,2018:16,2020:16,2021:22,2022:20,2023:21,2024:22,2025:22}},
  "栃木":    { color:"#FFDD00", data:{2009:7,2010:8,2011:16,2012:17,2013:19,2014:17,2015:17,2016:17,2017:20,2018:21,2019:13,2020:18,2021:11,2022:10,2023:13,2024:10,2025:14}},
  "群馬":    { color:"#43A047", data:{2020:20,2021:19,2022:17,2023:20,2024:16,2025:18}},
  "秋田":    { color:"#D32F2F", data:{2022:13,2023:15,2024:17,2025:20}},
  "讃岐":    { color:"#FFAA00", data:{2014:20,2015:22,2016:21,2017:21,2018:18,2019:20,2020:19,2021:20}},
  "北九州":  { color:"#0066BB", data:{2010:15,2011:6,2012:14,2013:9,2014:13,2015:20,2016:4,2017:7,2018:12,2019:9,2020:21,2021:18}},
  "鳥取":    { color:"#8B6914", data:{2011:15,2012:18,2013:22,2014:21,2015:21,2016:22}},
  "岐阜":    { color:"#009933", data:{2008:8,2009:16,2010:16,2011:20,2012:3,2013:8,2014:10,2015:10,2016:7,2017:4,2018:10,2019:18,2020:22,2021:21}},
  "町田":    { color:"#002D72", data:{2012:12,2013:20,2017:4,2018:4,2019:6,2020:2,2021:6,2022:1,2023:1}},
  "いわき":  { color:"#E60000", data:{2023:2}},
};

// ─── J3 順位データ ──────────────────────────────────────────────
const J3 = {
  "AC長野":  { color:"#C62828", data:{2014:7,2015:10,2016:12,2017:10,2018:10,2019:12,2020:11,2021:9,2022:12,2023:7,2024:3,2025:6}},
  "奈良":    { color:"#006633", data:{2014:14,2015:14,2016:6,2017:8,2018:5,2019:8,2020:4,2021:5,2022:9,2023:10,2024:5,2025:3}},
  "今治":    { color:"#F44336", data:{2020:2,2021:7,2022:8,2023:5,2024:4,2025:2}},
  "富山":    { color:"#003087", data:{2014:5,2015:2,2016:1,2017:6,2018:4,2019:3,2020:5,2021:2,2022:1}},
  "宮崎":    { color:"#CC4400", data:{2019:6,2020:8,2021:12,2022:6,2023:4,2024:7,2025:7}},
  "鹿児島":  { color:"#E91E63", data:{2016:3,2017:5,2018:2,2025:4}},
  "藤枝":    { color:"#558B2F", data:{2015:11,2016:11,2017:11,2018:12,2019:5,2020:9,2021:1}},
  "沼津":    { color:"#003087", data:{2017:12,2018:13,2019:14,2020:12,2021:13,2022:16,2023:17,2024:19,2025:18}},
  "八戸":    { color:"#006699", data:{2019:11,2020:7,2021:4,2022:10,2023:12,2024:16,2025:16}},
  "盛岡":    { color:"#005500", data:{2014:4,2015:9,2016:4,2017:2,2018:8,2019:10,2020:10,2021:6,2022:5,2023:3,2024:2,2025:9}},
  "福島":    { color:"#CC6600", data:{2014:6,2015:7,2016:5,2017:3,2018:3,2019:4,2020:3,2021:3,2022:3,2023:6,2024:8,2025:10}},
  "YS横浜":  { color:"#008844", data:{2014:12,2015:15,2016:16,2017:16,2018:14,2019:7,2020:16,2021:14,2022:20,2023:19,2024:20,2025:20}},
  "相模原":  { color:"#003399", data:{2014:15,2015:16,2016:8,2017:9,2018:7,2019:9,2020:6,2021:8,2022:19,2023:16,2024:13,2025:17}},
  "金沢":    { color:"#0044AA", data:{2014:2,2015:1,2016:2,2017:1}},
  "山口":    { color:"#D50000", data:{2018:3,2019:1,2020:8,2021:15,2022:7,2023:8,2024:6,2025:1}},
  "FC大阪":  { color:"#FF6D00", data:{2023:1,2024:1}},
  "北九州":  { color:"#0066BB", data:{2022:15,2023:11,2024:12,2025:14}},
  "岐阜":    { color:"#009933", data:{2022:2,2023:2,2024:2}},
  "鳥取":    { color:"#8B6914", data:{2017:7,2018:11,2019:13,2020:14,2021:16,2022:18,2023:9,2024:9,2025:11}},
  "讃岐":    { color:"#FFAA00", data:{2022:13,2023:13,2024:11,2025:12}},
  "琉球":    { color:"#C8001E", data:{2014:3,2015:5,2016:2,2017:4,2018:1}},
};

// ─── J1 勝ち点データ ─────────────────────────────────────────────
const J1_PTS = {
  "鹿島":   {2000:59,2001:65,2002:60,2003:58,2004:51,2005:70,2006:65,2007:76,2008:78,2009:75,2010:64,2011:71,2012:55,2013:55,2014:59,2015:68,2016:54,2017:58,2018:54,2019:63,2020:61,2021:47,2022:63,2023:56,2024:67,2025:72},
  "横浜FM": {2000:51,2001:64,2002:62,2003:63,2004:63,2005:58,2006:46,2007:58,2008:50,2009:54,2010:62,2011:67,2012:64,2013:59,2014:63,2015:56,2016:66,2017:45,2018:54,2019:70,2020:61,2021:75,2022:82,2023:73,2024:56,2025:14},
  "浦和":   {2001:57,2002:62,2003:56,2004:77,2005:62,2006:84,2007:59,2008:53,2009:54,2010:62,2011:52,2012:45,2013:68,2014:73,2015:65,2016:64,2017:60,2018:53,2019:50,2020:56,2021:63,2022:51,2023:57,2024:59,2025:60},
  "ガンバ": {2000:46,2001:53,2002:51,2003:59,2004:65,2005:72,2006:63,2007:68,2008:68,2009:63,2010:75,2011:62,2012:60,2014:66,2015:65,2016:65,2017:57,2018:39,2019:47,2020:52,2021:41,2022:46,2023:50,2024:42,2025:41},
  "川崎":   {2002:38,2003:49,2004:51,2005:59,2006:64,2007:72,2008:70,2009:73,2010:58,2011:63,2012:69,2013:60,2014:57,2015:60,2016:59,2017:72,2018:69,2019:60,2020:83,2021:88,2022:65,2023:61,2024:62,2025:53},
  "名古屋": {2000:48,2001:49,2002:47,2003:41,2004:44,2005:43,2006:40,2007:52,2008:66,2009:60,2010:71,2011:61,2012:59,2013:48,2018:55,2019:40,2020:67,2021:47,2022:43,2023:53,2024:40,2025:42},
  "広島":   {2002:58,2003:52,2004:54,2005:43,2006:37,2007:42,2008:42,2009:46,2010:48,2011:52,2012:63,2013:67,2017:65,2018:56,2019:55,2020:68,2021:62,2022:48,2023:49,2024:65,2025:59},
  "神戸":   {2013:44,2014:45,2015:42,2016:44,2017:49,2018:44,2019:47,2020:48,2021:66,2022:65,2023:72,2024:75,2025:53},
  "柏":     {2011:72,2012:50,2013:37,2014:44,2015:53,2016:47,2017:37,2018:30,2021:43,2022:66,2023:51,2024:49,2025:63},
  "FC東京": {2000:68,2001:60,2002:55,2003:50,2004:44,2005:61,2006:52,2007:44,2008:51,2009:40,2010:55,2011:54,2012:54,2013:47,2014:55,2015:40,2016:56,2017:50,2018:52,2019:64,2020:48,2021:56,2022:48,2023:43,2024:34,2025:32},
  "清水":   {2000:56,2001:52,2002:44,2003:47,2004:38,2005:32,2006:45,2007:41,2008:53,2009:54,2010:51,2011:50,2012:44,2013:37,2015:42,2016:35,2017:45,2018:44,2022:24,2025:44},
  "C大阪":  {2006:38,2007:37,2010:46,2011:34,2012:43,2015:17,2016:55,2017:64,2018:43,2019:59,2020:44,2021:52,2022:52,2023:46,2024:63,2025:54},
  "鳥栖":   {2012:61,2013:52,2014:60,2015:46,2016:43,2017:28,2018:73,2019:47,2020:42,2021:52,2022:41,2023:30,2024:52},
  "湘南":   {2015:41,2018:34,2019:34,2020:36,2021:29,2023:45,2024:22,2025:32},
  "札幌":   {2017:38,2018:46,2019:46,2020:43,2021:41,2022:44,2023:31,2024:43},
  "仙台":   {2009:41,2010:43,2011:41,2014:43,2015:38,2016:41,2017:40,2018:51,2019:41,2020:40,2021:19},
  "東京V":  {2009:24,2024:47,2025:48},
  "横浜FC": {2020:28,2021:16,2023:20,2024:32,2025:27},
};

// ─── 年別クラブ数 ──────────────────────────────────────────────
const JCC = {
  1993:[10,0,0],1994:[12,0,0],1995:[14,0,0],1996:[16,0,0],
  1997:[17,0,0],1998:[18,0,0],1999:[16,10,0],2000:[16,11,0],
  2001:[16,12,0],2002:[16,12,0],2003:[16,12,0],2004:[16,12,0],
  2005:[18,12,0],2006:[18,13,0],2007:[18,13,0],2008:[18,15,0],
  2009:[18,18,0],2010:[18,19,0],2011:[18,20,0],2012:[18,22,0],
  2013:[18,22,0],2014:[18,22,11],2015:[18,22,12],2016:[18,22,13],
  2017:[18,22,14],2018:[18,22,14],2019:[18,22,15],2020:[18,22,16],
  2021:[20,22,15],2022:[18,22,18],2023:[18,22,20],2024:[20,20,20],
  2025:[20,20,20],
};
const J_ALL_YEARS = Array.from({length:33},(_,i)=>1993+i);

function jToOverall(tier, pos, year) {
  if (pos == null) return null;
  const [j1n, j2n] = JCC[year] || [18,22,20];
  if (tier===1) return pos;
  if (tier===2) return j1n + pos;
  if (tier===3) return j1n + j2n + pos;
  return null;
}
function jTotalClubs(year) {
  const cc = JCC[year]||[18,22,20]; return cc[0]+cc[1]+cc[2];
}
function jGetJ1Size(year) { return (JCC[year]||[18,22,20])[0]; }
function jGetJ2Size(year) { return (JCC[year]||[18,22,20])[1]; }

const J_ALL_CLUBS = (() => {
  const all = {};
  Object.entries(J1).forEach(([n,info])=>{
    if (!info) return;
    all[n] = { color:info.color, data:{} };
    Object.entries(info.data).forEach(([y,pos])=>{
      if (pos==null) return;
      all[n].data[Number(y)] = jToOverall(1, pos, Number(y));
    });
  });
  Object.entries(J2).forEach(([n,info])=>{
    if (!info) return;
    if (!all[n]) all[n] = { color:info.color, data:{} };
    Object.entries(info.data).forEach(([y,pos])=>{
      if (pos==null) return;
      const yr = Number(y);
      if (all[n].data[yr] == null) all[n].data[yr] = jToOverall(2, pos, yr);
    });
  });
  Object.entries(J3).forEach(([n,info])=>{
    if (!info) return;
    if (!all[n]) all[n] = { color:info.color, data:{} };
    Object.entries(info.data).forEach(([y,pos])=>{
      if (pos==null) return;
      const yr = Number(y);
      if (all[n].data[yr] == null) all[n].data[yr] = jToOverall(3, pos, yr);
    });
  });
  return all;
})();

const J_ALL_NAMES = Object.keys(J_ALL_CLUBS);
const J_ORIGINAL10 = ["鹿島","浦和","市原","東京V","横浜FM","横浜F","清水","名古屋","ガンバ","広島"];
const J_DEFAULT_SEL = ["鹿島","横浜FM","浦和","川崎","ガンバ","名古屋"];

function jEstPts(tier, pos, year) {
  if (pos==null) return 0;
  const cc = JCC[year]||[18,22,20];
  const n = cc[tier-1]; if (!n) return 0;
  const g=(n-1)*2, mx=Math.round(g*2.4), mn=Math.round(g*0.7);
  return Math.round(mn + ((n-pos)/(n-1))*(mx-mn));
}

const J_TIER_COLOR = {1:"#E60012",2:"#009B6B",3:"#F5A623"};
const J_TIER_LABEL = {1:"J1",2:"J2",3:"J3"};

function OverallTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const [j1n, j2n] = JCC[label] || [18,22,20];
  const allThatYear = Object.entries(J_ALL_CLUBS)
    .filter(([, info]) => info?.data[label] != null)
    .map(([name, info]) => {
      const raw  = info.data[label];
      const tier = raw <= j1n ? 1 : raw <= j1n+j2n ? 2 : 3;
      const dp   = tier===1 ? raw : tier===2 ? raw-j1n : raw-j1n-j2n;
      const rp   = J1_PTS[name]?.[label];
      const pts  = rp != null ? rp : jEstPts(tier, dp, label);
      const color = info.color || "#888";
      const inSel = payload.some(p => p.dataKey === name);
      return { name, raw, tier, dp, pts, rp, color, inSel };
    })
    .sort((a, b) => a.raw - b.raw);
  const j1Teams = allThatYear.filter(r => r.tier===1);
  const j2Teams = allThatYear.filter(r => r.tier===2);
  const j3Teams = allThatYear.filter(r => r.tier===3);
  const renderRow = (r) => {
    const tc = J_TIER_COLOR[r.tier];
    return (
      <div key={r.name} style={{display:"flex",gap:3,alignItems:"center",marginBottom:1,opacity:r.inSel?1:0.35}}>
        <span style={{fontSize:7,color:r.color,minWidth:32,overflow:"hidden",whiteSpace:"nowrap"}}>{r.name}</span>
        <span style={{fontSize:7,fontWeight:700,border:`1px solid ${tc}`,color:tc,padding:"0 2px",borderRadius:2,flexShrink:0,minWidth:20,textAlign:"center",lineHeight:"12px"}}>{r.dp}位</span>
        <span style={{fontSize:6,color:r.rp!=null?"#FFD700":"#333",minWidth:18,textAlign:"right"}}>{r.pts}{r.rp==null?"※":""}</span>
      </div>
    );
  };
  return (
    <div style={{background:"#1c2a40",border:"1px solid #2a3d5a",borderRadius:4,padding:"5px 8px",fontFamily:"monospace"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,paddingBottom:2,borderBottom:"1px solid #2a3d5a",fontSize:7}}>
        <span style={{color:"#888",fontWeight:700}}>{label}年</span>
        <span>
          <span style={{color:"#E60012"}}>J1:{j1n}</span>
          {j2n>0 && <span style={{color:"#009B6B",marginLeft:3}}>J2:{j2n}</span>}
          {j3Teams.length>0 && <span style={{color:"#F5A623",marginLeft:3}}>J3:{j3Teams.length}</span>}
        </span>
      </div>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1,borderRight:"1px solid #1a1a28",paddingRight:6}}>
          <div style={{fontSize:6,color:"#E60012",marginBottom:2,fontWeight:700}}>J1 ({j1Teams.length})</div>
          {j1Teams.map(r => renderRow(r))}
        </div>
        <div style={{flex:1}}>
          {j2Teams.length > 0 && (<>
            <div style={{fontSize:6,color:"#009B6B",marginBottom:2,fontWeight:700}}>J2 ({j2Teams.length})</div>
            {j2Teams.map(r => renderRow(r))}
          </>)}
          {j3Teams.length > 0 && (<>
            <div style={{fontSize:6,color:"#F5A623",marginTop:3,marginBottom:2,fontWeight:700}}>J3 ({j3Teams.length})</div>
            {j3Teams.map(r => renderRow(r))}
          </>)}
        </div>
      </div>
    </div>
  );
}

export default function JLeagueHub() {
  const [sel, setSel]       = useState(new Set(J_DEFAULT_SEL));
  const [yearFrom, setFrom] = useState(1993);
  const [yearTo,   setTo]   = useState(2025);
  const [view, setView]     = useState("overall");
  const [countsOpen, setCountsOpen] = useState(false);
  const [gap, setGap]       = useState(2);

  const years = J_ALL_YEARS.filter(y=>y>=yearFrom&&y<=yearTo);
  const toggle = n => setSel(p=>{const s=new Set(p);s.has(n)?s.delete(n):s.add(n);return s;});

  const chartData = useMemo(()=>years.map(year=>{
    const [j1n,j2n] = JCC[year]||[18,22,20];
    const row = { year };
    [...sel].forEach(n=>{
      const raw = J_ALL_CLUBS[n]?.data[year];
      if (raw==null) { row[n]=null; return; }
      let v = raw;
      if (raw > j1n && raw <= j1n+j2n) v = raw + gap;
      if (raw > j1n+j2n) v = raw + gap*2;
      row[n] = v;
    });
    return row;
  }),[sel,years,gap]);

  const yMax = useMemo(()=>{
    let m=0;
    years.forEach(y=>{
      const [j1n,j2n,j3n]=JCC[y]||[18,22,20];
      const total = j1n + j2n + j3n + gap*2;
      if(total>m) m=total;
    });
    return m;
  },[years,gap]);

  const j1j2Line = useMemo(()=>{
    const j1ns = years.map(y=>(JCC[y]||[18,22,20])[0]);
    return Math.max(...j1ns) + 0.5;
  },[years]);

  const j2j3Line = useMemo(()=>{
    const j12s = years.map(y=>{const cc=JCC[y]||[18,22,20];return cc[0]+cc[1];});
    return Math.max(...j12s) + gap + 0.5;
  },[years,gap]);

  const cumData = useMemo(()=>{
    const cum={};
    [...sel].forEach(n=>{cum[n]=0;});
    return years.map(year=>{
      const row={year};
      [...sel].forEach(n=>{
        const pos=J1[n]?.data[year];
        const rp=J1_PTS[n]?.[year];
        if(pos!=null||rp!=null){
          cum[n]+=(rp!=null?rp:jEstPts(1,pos,year));
        }
        row[n]=cum[n];
      });
      return row;
    });
  },[sel,years]);

  const qb = (c,dim=false)=>({background:dim?"#111":`${c}22`,color:c,border:`1px solid ${c}`,borderRadius:3,padding:"4px 10px",fontSize:10,fontWeight:700,cursor:"pointer"});

  const clubCountData = J_ALL_YEARS.map(y=>{
    const [j1n,j2n,j3n]=JCC[y]||[0,0,0];
    return {year:y, J1:j1n, J2:j2n, J3:j3n, total:j1n+j2n+j3n};
  });

  return (
    <div style={{fontFamily:"'Noto Sans JP',sans-serif",color:"#eee",maxWidth:820,margin:"0 auto"}}>

      {/* ビュー切替 */}
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:12}}>
        {[["overall","📊 歴代順位推移"],["cumpts","📈 J1累積"]].map(([k,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{
            background:view===k?"#FFD700":"#111",color:view===k?"#000":"#666",
            border:`1px solid ${view===k?"#FFD700":"#333"}`,
            borderRadius:3,padding:"5px 10px",fontSize:11,cursor:"pointer",fontWeight:view===k?700:400,
          }}>{l}</button>
        ))}
      </div>

      {view==="overall" && (<>
        <div style={{background:"#1a2840",border:"1px solid #2a3d5a",borderRadius:4,padding:"10px 14px",marginBottom:10}}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:10,color:"#9B5DE5",letterSpacing:2,fontWeight:700,flexShrink:0}}>表示期間</span>
            <div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:100}}>
              <input type="range" min={1993} max={yearTo-1} value={yearFrom} onChange={e=>setFrom(Number(e.target.value))} style={{flex:1,accentColor:"#9B5DE5"}}/>
              <span style={{fontSize:11,color:"#FFD700",fontFamily:"monospace",fontWeight:700,minWidth:32}}>{yearFrom}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:100}}>
              <input type="range" min={yearFrom+1} max={2025} value={yearTo} onChange={e=>setTo(Number(e.target.value))} style={{flex:1,accentColor:"#9B5DE5"}}/>
              <span style={{fontSize:11,color:"#FFD700",fontFamily:"monospace",fontWeight:700,minWidth:32}}>{yearTo}</span>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {[["全",1993,2025],["近年",2015,2025],["2000〜",2000,2025],["2010〜",2010,2025]].map(([l,f,t])=>{
                const ac=yearFrom===f&&yearTo===t;
                return <button key={l} onClick={()=>{setFrom(f);setTo(t);}} style={{background:ac?"#9B5DE5":"#111",color:ac?"#fff":"#555",border:`1px solid ${ac?"#9B5DE5":"#333"}`,borderRadius:3,padding:"3px 7px",fontSize:10,cursor:"pointer"}}>{l}</button>;
              })}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:4}}>
              <span style={{fontSize:10,color:"#555"}}>部門間</span>
              <input type="range" min={0} max={5} value={gap} onChange={e=>setGap(Number(e.target.value))} style={{width:60,accentColor:"#9B5DE5"}}/>
              <span style={{fontSize:10,color:"#FFD700",fontFamily:"monospace"}}>{gap}行</span>
            </div>
          </div>
        </div>

        <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={()=>setSel(new Set(J_ORIGINAL10))} style={qb("#FFD700")}>⭐ オリジナル10</button>
          <button onClick={()=>setSel(new Set(J_DEFAULT_SEL))} style={qb("#9B5DE5")}>J1強豪</button>
          <button onClick={()=>setSel(new Set(J_ALL_NAMES))} style={qb("#06D6A0")}>全選択</button>
          <button onClick={()=>setSel(new Set())} style={qb("#555",true)}>全解除</button>
        </div>

        {[
          ["J1", Object.keys(J1).filter(n=>J1[n] && Object.keys(J1[n].data).length>0), "#E60012"],
          ["J2専門", Object.keys(J2).filter(n=>!J1[n] && Object.keys(J2[n].data).length>0), "#009B6B"],
          ["J3専門", Object.keys(J3).filter(n=>!J1[n] && !J2[n] && Object.keys(J3[n].data).length>0), "#F5A623"],
        ].map(([label, names, tc])=>(
          names.length > 0 && (
            <div key={label} style={{marginBottom:6}}>
              <div style={{fontSize:9,color:tc,letterSpacing:1,marginBottom:3,textAlign:"center"}}>{label}</div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center"}}>
                {names.map(n=>{
                  const on=sel.has(n);
                  const c=J_ALL_CLUBS[n]?.color||"#888";
                  const light=["#FFD700","#F5A623","#F39800","#FFCC00","#FFAA00","#EEEEEE","#FFDD00"].includes(c);
                  return (
                    <button key={n} onClick={()=>toggle(n)} style={{
                      background:on?c:"#111",
                      color:on?(light?"#000":"#fff"):"#555",
                      border:`1px solid ${on?c:tc+"33"}`,
                      borderRadius:3,padding:"2px 6px",fontSize:9,cursor:"pointer",fontWeight:on?700:400,
                    }}>{n}</button>
                  );
                })}
              </div>
            </div>
          )
        ))}

        <div style={{display:"flex",gap:14,justifyContent:"center",marginBottom:8,marginTop:4,fontSize:9,flexWrap:"wrap"}}>
          {[1,2,3].map(t=><div key={t} style={{display:"flex",alignItems:"center",gap:3}}>
            <div style={{width:14,height:3,background:J_TIER_COLOR[t]}}/><span style={{color:"#666"}}>{J_TIER_LABEL[t]}</span>
          </div>)}
          <span style={{color:"#333"}}>（部門間スペース: {gap}行）</span>
        </div>

        <div style={{background:"#1a2840",border:"1px solid #2a3d5a",borderRadius:4,padding:"16px 8px 12px 0",marginBottom:12}}>
          <ResponsiveContainer width="100%" height={480}>
            <LineChart data={chartData} margin={{top:8,right:24,left:0,bottom:30}}>
              <CartesianGrid stroke="#243550" strokeDasharray="3 3"/>
              <XAxis dataKey="year" tick={{fill:"#555",fontSize:9}} tickLine={false} axisLine={{stroke:"#252535"}} angle={-45} textAnchor="end" interval={Math.max(0,Math.floor(years.length/12))}/>
              <YAxis reversed domain={[1,yMax+1]} tick={{fill:"#555",fontSize:8}} tickLine={false} axisLine={false} width={28} tickFormatter={v=>`${v}`}/>
              <ReferenceLine y={j1j2Line} stroke="#009B6B44" strokeWidth={1.5} strokeDasharray="6 3"
                label={{value:"─ J2 ─",fill:"#009B6B99",fontSize:8,position:"left"}}/>
              {years.some(y=>jGetJ2Size(y)>0 && jTotalClubs(y)>jGetJ1Size(y)+jGetJ2Size(y)) && (
                <ReferenceLine y={j2j3Line} stroke="#F5A62344" strokeWidth={1.5} strokeDasharray="6 3"
                  label={{value:"─ J3 ─",fill:"#F5A62399",fontSize:8,position:"left"}}/>
              )}
              <Tooltip content={(props)=><OverallTip {...props}/>}/>
              {[...sel].map(n=>(
                <Line key={n} type="monotone" dataKey={n}
                  stroke={J_ALL_CLUBS[n]?.color||"#888"} strokeWidth={1.5}
                  dot={{r:1.5,fill:J_ALL_CLUBS[n]?.color||"#888"}}
                  activeDot={{r:5,stroke:"#fff",strokeWidth:1}}
                  connectNulls={false}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{marginBottom:12}}>
          <button onClick={()=>setCountsOpen(o=>!o)} style={{
            width:"100%",background:"#1a2840",border:"1px solid #2a3d5a",
            borderRadius:4,padding:"10px 16px",cursor:"pointer",
            display:"flex",justifyContent:"space-between",alignItems:"center",
          }}>
            <span style={{fontSize:11,color:"#555",letterSpacing:1}}>📋 クラブ数の変遷</span>
            <span style={{fontSize:12,color:"#555",transform:countsOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▼</span>
          </button>
          {countsOpen && (
            <div style={{background:"#1a2840",border:"1px solid #2a3d5a",borderTop:"none",borderRadius:"0 0 4px 4px",padding:"12px 16px"}}>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={clubCountData} margin={{top:4,right:12,left:0,bottom:20}}>
                  <CartesianGrid stroke="#243550" strokeDasharray="3 3"/>
                  <XAxis dataKey="year" tick={{fill:"#555",fontSize:8}} tickLine={false} axisLine={{stroke:"#252535"}} angle={-45} textAnchor="end" interval={2}/>
                  <YAxis tick={{fill:"#555",fontSize:9}} tickLine={false} axisLine={false} width={28} domain={[0,70]}/>
                  <Tooltip content={({active,payload,label})=>{
                    if(!active||!payload?.length) return null;
                    const d=clubCountData.find(x=>x.year===label);
                    if(!d) return null;
                    return (<div style={{background:"#1c2a40",border:"1px solid #2a3d5a",borderRadius:4,padding:"8px 12px",fontFamily:"monospace",fontSize:10}}>
                      <div style={{color:"#888",marginBottom:3,fontSize:9}}>{label}年</div>
                      <div style={{color:"#E60012"}}>J1: {d.J1}</div>
                      <div style={{color:"#009B6B"}}>J2: {d.J2}</div>
                      <div style={{color:"#F5A623"}}>J3: {d.J3}</div>
                      <div style={{color:"#FFD700",fontWeight:700}}>計: {d.total}</div>
                    </div>);
                  }}/>
                  <Line type="stepAfter" dataKey="total" stroke="#FFD700" strokeWidth={2} dot={false}/>
                  <Line type="stepAfter" dataKey="J1" stroke="#E60012" strokeWidth={2} dot={false}/>
                  <Line type="stepAfter" dataKey="J2" stroke="#009B6B" strokeWidth={2} dot={false}/>
                  <Line type="stepAfter" dataKey="J3" stroke="#F5A623" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:4,fontSize:9,flexWrap:"wrap"}}>
                {[["J1","#E60012"],["J2","#009B6B"],["J3","#F5A623"],["合計","#FFD700"]].map(([l,c])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:3}}>
                    <div style={{width:12,height:3,background:c}}/><span style={{color:"#666"}}>{l}</span>
                  </div>
                ))}
              </div>
              <div style={{overflowX:"auto",marginTop:10}}>
                <table style={{borderCollapse:"collapse",width:"100%",fontFamily:"monospace",fontSize:9,minWidth:360}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid #252535"}}>
                      {["年","J1","J2","J3","計","出来事"].map((h,i)=>(
                        <th key={h} style={{textAlign:i>=5?"left":"center",color:"#555",padding:"3px 6px",fontWeight:400}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [1993,"10","—","—","10","Jリーグ開幕（オリジナル10）"],
                      [1999,"16","10","—","26","J2発足"],
                      [2005,"18","12","—","30","J1が18クラブに固定"],
                      [2009,"18","18","—","36","J2が18クラブに拡大"],
                      [2014,"18","22","11","51","J3発足"],
                      [2021,"20","22","15","57","J1が20クラブに拡大"],
                      [2024,"20","20","20","60","3部門すべて20クラブに統一"],
                    ].map(([y,j1,j2,j3,t,note])=>(
                      <tr key={y} style={{borderBottom:"1px solid #0d0d14"}}>
                        <td style={{padding:"4px 6px",textAlign:"center",color:"#FFD700",fontWeight:700}}>{y}</td>
                        <td style={{padding:"4px 6px",textAlign:"center",color:"#E60012",fontWeight:700}}>{j1}</td>
                        <td style={{padding:"4px 6px",textAlign:"center",color:"#009B6B"}}>{j2}</td>
                        <td style={{padding:"4px 6px",textAlign:"center",color:"#F5A623"}}>{j3}</td>
                        <td style={{padding:"4px 6px",textAlign:"center",color:"#fff",fontWeight:700}}>{t}</td>
                        <td style={{padding:"4px 6px",textAlign:"left",color:"#555",fontSize:8}}>{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </>)}

      {view==="cumpts" && (<>
        <div style={{background:"#1a2840",border:"1px solid #2a3d5a",borderRadius:4,padding:"10px 14px",marginBottom:10}}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:10,color:"#9B5DE5",letterSpacing:2,fontWeight:700}}>表示期間</span>
            <div style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
              <input type="range" min={1993} max={yearTo-1} value={yearFrom} onChange={e=>setFrom(Number(e.target.value))} style={{flex:1,accentColor:"#9B5DE5"}}/>
              <span style={{fontSize:11,color:"#FFD700",fontFamily:"monospace",fontWeight:700,minWidth:32}}>{yearFrom}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
              <input type="range" min={yearFrom+1} max={2025} value={yearTo} onChange={e=>setTo(Number(e.target.value))} style={{flex:1,accentColor:"#9B5DE5"}}/>
              <span style={{fontSize:11,color:"#FFD700",fontFamily:"monospace",fontWeight:700,minWidth:32}}>{yearTo}</span>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={()=>setSel(new Set(J_ORIGINAL10))} style={qb("#FFD700")}>⭐ オリジナル10</button>
          <button onClick={()=>setSel(new Set(J_DEFAULT_SEL))} style={qb("#9B5DE5")}>J1強豪</button>
          <button onClick={()=>setSel(new Set(Object.keys(J1).filter(n=>J1[n])))} style={qb("#06D6A0")}>J1全て</button>
          <button onClick={()=>setSel(new Set())} style={qb("#555",true)}>全解除</button>
        </div>
        <div style={{display:"flex",gap:3,marginBottom:12,flexWrap:"wrap",justifyContent:"center"}}>
          {Object.keys(J1).filter(n=>J1[n] && Object.keys(J1[n].data).length>0).map(n=>{
            const on=sel.has(n); const c=J1[n]?.color||"#888";
            const light=["#FFD700","#F5A623","#F39800","#FFCC00","#FFAA00","#EEEEEE","#FFDD00"].includes(c);
            return <button key={n} onClick={()=>toggle(n)} style={{background:on?c:"#111",color:on?(light?"#000":"#fff"):"#555",border:`1px solid ${on?c:"#222"}`,borderRadius:3,padding:"2px 6px",fontSize:9,cursor:"pointer",fontWeight:on?700:400}}>{n}</button>;
          })}
        </div>
        <div style={{background:"#1a2840",border:"1px solid #2a3d5a",borderRadius:4,padding:"16px 8px 12px 0",marginBottom:12}}>
          <div style={{textAlign:"center",fontSize:10,color:"#555",marginBottom:6}}>J1在籍シーズンのみ累積</div>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={cumData} margin={{top:8,right:24,left:0,bottom:30}}>
              <CartesianGrid stroke="#243550" strokeDasharray="3 3"/>
              <XAxis dataKey="year" tick={{fill:"#555",fontSize:9}} tickLine={false} axisLine={{stroke:"#252535"}} angle={-45} textAnchor="end" interval={Math.max(0,Math.floor(years.length/12))}/>
              <YAxis tick={{fill:"#555",fontSize:9}} tickLine={false} axisLine={false} width={48} tickFormatter={v=>v>999?`${(v/1000).toFixed(1)}k`:v}/>
              <Tooltip content={({active,payload,label})=>{
                if(!active||!payload?.length) return null;
                const s=[...payload].filter(p=>p.value!=null).sort((a,b)=>b.value-a.value);
                return (<div style={{background:"#1c2a40",border:"1px solid #2a3d5a",borderRadius:4,padding:"10px 14px",fontFamily:"monospace",fontSize:11,minWidth:180}}>
                  <div style={{color:"#888",marginBottom:6,fontSize:10}}>{label}年 累積</div>
                  {s.map(p=><div key={p.dataKey} style={{display:"flex",justifyContent:"space-between",gap:10,color:p.color,marginBottom:2}}>
                    <span>{p.dataKey}</span><span style={{fontWeight:700}}>{p.value.toLocaleString()}</span>
                  </div>)}
                </div>);
              }}/>
              {[...sel].filter(n=>J1[n]).map(n=>(
                <Line key={n} type="monotone" dataKey={n} stroke={J1[n]?.color||"#888"} strokeWidth={2} dot={false} connectNulls activeDot={{r:4}}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#1a2840",border:"1px solid #2a3d5a",borderRadius:4,padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:2}}>累積勝ち点ランキング</div>
            <div style={{fontSize:9,color:"#333"}}>J1在籍シーズン数含む</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {[...sel].filter(n=>J1[n]).map(n=>{
              const l=cumData[cumData.length-1];
              const j1seasons = years.filter(y=>J1[n]?.data[y]!=null).length;
              return {n, pts:l?.[n]||0, j1seasons};
            })
              .sort((a,b)=>b.pts-a.pts).map(({n,pts,j1seasons},i)=>{
                const c=J1[n]?.color||"#888";
                const top=Math.max(...[...sel].filter(x=>J1[x]).map(x=>cumData[cumData.length-1]?.[x]||0));
                return (
                  <div key={n} style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:10,color:"#444",width:16,textAlign:"right"}}>{i+1}</span>
                    <span style={{fontSize:11,color:c,fontWeight:700,width:56,flexShrink:0}}>{n}</span>
                    <div style={{flex:1,background:"#1a2840",borderRadius:2,height:12,overflow:"hidden"}}>
                      <div style={{width:`${top>0?(pts/top)*100:0}%`,height:"100%",background:c,opacity:.85}}/>
                    </div>
                    <span style={{fontSize:9,color:"#555",fontFamily:"monospace",minWidth:28,textAlign:"right"}}>{j1seasons}季</span>
                    <span style={{fontSize:11,color:c,fontFamily:"monospace",fontWeight:700,minWidth:50,textAlign:"right"}}>{pts.toLocaleString()}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </>)}
    </div>
  );
}
