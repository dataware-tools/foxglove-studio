export const tagOptionsForEachTagType = [
  {
    tag_type_en: "time_of_day",
    tag_type_jp: "時間",
    tag_list: [
      {
        jp: "早朝",
        en: "early_morning",
      },
      {
        jp: "昼間",
        en: "daytime",
      },
      {
        jp: "夕方",
        en: "evening",
      },
      {
        jp: "夜間",
        en: "night",
      },
      {
        jp: "不明",
        en: "unknown",
      },
    ],
  },
  {
    tag_type_en: "weather",
    tag_type_jp: "天候",
    tag_list: [
      {
        jp: "晴れ",
        en: "sunny",
      },
      {
        jp: "曇り",
        en: "cloudy",
      },
      {
        jp: "雨",
        en: "rainy",
      },
      {
        jp: "雪",
        en: "snowy",
      },
      {
        jp: "不明",
        en: "unknown",
      },
    ],
  },
  {
    tag_type_en: "ego_vehicle_movement",
    tag_type_jp: "自車両の動き",
    tag_list: [
      {
        jp: "直進",
        en: "go_straight",
      },
      {
        jp: "左折",
        en: "turn_left",
      },
      {
        jp: "右折",
        en: "turn_right",
      },
      {
        jp: "左に車線変更",
        en: "lane_change_left",
      },
      {
        jp: "右に車線変更",
        en: "lane_change_right",
      },
      {
        jp: "停車",
        en: "stop",
      },
      {
        jp: "バック",
        en: "back",
      },
    ],
  },
  {
    tag_type_en: "road_shape",
    tag_type_jp: "道路形状",
    tag_list: [
      {
        jp: "直線",
        en: "straight",
      },
      {
        jp: "カーブ",
        en: "curve",
      },
      {
        jp: "交差点",
        en: "intersection",
      },
      {
        jp: "上り坂",
        en: "uphill",
      },
      {
        jp: "下り坂",
        en: "downhill",
      },
      {
        jp: "環状交差点",
        en: "roundabout",
      },
      {
        jp: "車線数減少",
        en: "lane_reduction",
      },
      {
        jp: "車線数増加",
        en: "lane_increase",
      },
      {
        jp: "合流",
        en: "lane_merge",
      },
      {
        jp: "分岐",
        en: "lane_split",
      },
      {
        jp: "踏切",
        en: "railroad_crossing",
      },
    ],
  },
  {
    tag_type_en: "road_condition",
    tag_type_jp: "路面状態",
    tag_list: [
      {
        jp: "水たまり",
        en: "puddle",
      },
      {
        jp: "道路標示のかすれ",
        en: "faded_road_markings",
      },
      {
        jp: "濡れた路面",
        en: "wet_road",
      },
      {
        jp: "乾いた路面",
        en: "dry_road",
      },
      {
        jp: "積雪",
        en: "snow_covered_road",
      },
      {
        jp: "凍結",
        en: "icy_road",
      },
      {
        jp: "路面の凹凸",
        en: "bumpy_road",
      },
      {
        jp: "路面のひび割れ",
        en: "pothole",
      },
      {
        jp: "路面の汚れ",
        en: "dirty_road",
      },
    ],
  },
  {
    tag_type_en: "static_object",
    tag_type_jp: "静的物体",
    tag_list: [
      {
        jp: "ガードレール",
        en: "guardrail",
      },
      {
        jp: "信号機",
        en: "traffic_light",
      },
      {
        jp: "標識",
        en: "traffic_sign",
      },
      {
        jp: "バス停",
        en: "bus_stop",
      },
      {
        jp: "駐車車両",
        en: "parked_vehicle",
      },
      {
        jp: "コーン",
        en: "cone",
      },
      {
        jp: "落下物",
        en: "road_debris",
      },
      {
        jp: "発煙筒",
        en: "warning_flare",
      },
      {
        jp: "三角表示板",
        en: "warning_triangle",
      },
    ],
  },
  {
    tag_type_en: "dynamic_object",
    tag_type_jp: "動的物体",
    tag_list: [
      {
        jp: "歩行者",
        en: "pedestrian",
      },
      {
        jp: "自転車",
        en: "bicycle",
      },
      {
        jp: "一般車両",
        en: "car",
      },
      {
        jp: "工事車両",
        en: "construction_vehicle",
      },
      {
        jp: "農業機械",
        en: "agricultural_vehicle",
      },
      {
        jp: "パトカー",
        en: "police_car",
      },
      {
        jp: "救急車",
        en: "ambulance",
      },
      {
        jp: "消防車",
        en: "fire_truck",
      },
      {
        jp: "バス",
        en: "bus",
      },
      {
        jp: "トラック",
        en: "truck",
      },
      {
        jp: "バイク",
        en: "motorcycle",
      },
      {
        jp: "電車",
        en: "train",
      },
      {
        jp: "その他特殊車両",
        en: "special_vehicle",
      },
      {
        jp: "動物",
        en: "animal",
      },
    ],
  },
  {
    tag_type_en: "traffic_volume",
    tag_type_jp: "交通量",
    tag_list: [
      {
        jp: "閑散",
        en: "light_traffic",
      },
      {
        jp: "通常",
        en: "moderate_traffic",
      },
      {
        jp: "混雑",
        en: "heavy_traffic",
      },
    ],
  },
  {
    tag_type_en: "traffic_event",
    tag_type_jp: "交通イベント",
    tag_list: [
      {
        jp: "交通事故",
        en: "traffic_accident",
      },
      {
        jp: "工事中",
        en: "under_construction",
      },
      {
        jp: "交通規制",
        en: "traffic_control",
      },
    ],
  },
  {
    tag_type_en: "location",
    tag_type_jp: "場所",
    tag_list: [
      {
        jp: "住宅街",
        en: "residential_area",
      },
      {
        jp: "田舎",
        en: "rural_area",
      },
      {
        jp: "都市部",
        en: "urban_area",
      },
      {
        jp: "高速道路",
        en: "highway",
      },
      {
        jp: "山間部",
        en: "mountainous_area",
      },
      {
        jp: "海岸",
        en: "coastal_area",
      },
      {
        jp: "駐車場",
        en: "parking_lot",
      },
      {
        jp: "トンネル",
        en: "tunnel",
      },
      {
        jp: "橋",
        en: "bridge",
      },
      {
        jp: "地下",
        en: "underground",
      },
    ],
  },
  {
    tag_type_en: "visibility",
    tag_type_jp: "視界",
    tag_list: [
      {
        jp: "良好",
        en: "clear",
      },
      {
        jp: "逆光",
        en: "backlit",
      },
      {
        jp: "水滴",
        en: "raindrops",
      },
      {
        jp: "霧",
        en: "foggy",
      },
      {
        jp: "暗い",
        en: "dark",
      },
      {
        jp: "夜明け/夕暮れ",
        en: "dawn/dusk",
      },
      {
        jp: "グレア",
        en: "glare",
      },
    ],
  },
];
