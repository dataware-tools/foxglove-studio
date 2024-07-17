import { TagOptionsForEachTagType } from "./types";

export const tagOptionsForEachTagType: TagOptionsForEachTagType = [
  {
    tag_type: { value: "time_of_day", label: "時間" },
    tag_options: [
      {
        label: "早朝",
        value: "early_morning",
      },
      {
        label: "昼間",
        value: "daytime",
      },
      {
        label: "夕方",
        value: "evening",
      },
      {
        label: "夜間",
        value: "night",
      },
      {
        label: "不明",
        value: "unknown",
      },
    ],
  },
  {
    tag_type: { value: "weather", label: "天候" },
    tag_options: [
      {
        label: "晴れ",
        value: "sunny",
      },
      {
        label: "曇り",
        value: "cloudy",
      },
      {
        label: "雨",
        value: "rainy",
      },
      {
        label: "雪",
        value: "snowy",
      },
      {
        label: "不明",
        value: "unknown",
      },
    ],
  },
  {
    tag_type: { value: "ego_vehicle_movement", label: "自車両の動き" },
    tag_options: [
      {
        label: "直進",
        value: "go_straight",
      },
      {
        label: "左折",
        value: "turn_left",
      },
      {
        label: "右折",
        value: "turn_right",
      },
      {
        label: "左に車線変更",
        value: "lane_change_left",
      },
      {
        label: "右に車線変更",
        value: "lane_change_right",
      },
      {
        label: "停車",
        value: "stop",
      },
      {
        label: "バック",
        value: "back",
      },
    ],
  },
  {
    tag_type: { value: "road_shape", label: "道路形状" },
    tag_options: [
      {
        label: "直線",
        value: "straight",
      },
      {
        label: "カーブ",
        value: "curve",
      },
      {
        label: "交差点",
        value: "intersection",
      },
      {
        label: "上り坂",
        value: "uphill",
      },
      {
        label: "下り坂",
        value: "downhill",
      },
      {
        label: "環状交差点",
        value: "roundabout",
      },
      {
        label: "車線数減少",
        value: "lane_reduction",
      },
      {
        label: "車線数増加",
        value: "lane_increase",
      },
      {
        label: "合流",
        value: "lane_merge",
      },
      {
        label: "分岐",
        value: "lane_split",
      },
      {
        label: "踏切",
        value: "railroad_crossing",
      },
    ],
  },
  {
    tag_type: { value: "road_condition", label: "路面状態" },
    tag_options: [
      {
        label: "水たまり",
        value: "puddle",
      },
      {
        label: "道路標示のかすれ",
        value: "faded_road_markings",
      },
      {
        label: "濡れた路面",
        value: "wet_road",
      },
      {
        label: "乾いた路面",
        value: "dry_road",
      },
      {
        label: "積雪",
        value: "snow_covered_road",
      },
      {
        label: "凍結",
        value: "icy_road",
      },
      {
        label: "路面の凹凸",
        value: "bumpy_road",
      },
      {
        label: "路面のひび割れ",
        value: "pothole",
      },
      {
        label: "路面の汚れ",
        value: "dirty_road",
      },
      {
        label: "未舗装路",
        value: "unpaved_road",
      },
    ],
  },
  {
    tag_type: { value: "static_object", label: "静的物体" },
    tag_options: [
      {
        label: "ガードレール",
        value: "guardrail",
      },
      {
        label: "信号機",
        value: "traffic_light",
      },
      {
        label: "標識",
        value: "traffic_sign",
      },
      {
        label: "バス停",
        value: "bus_stop",
      },
      {
        label: "駐車車両",
        value: "parked_vehicle",
      },
      {
        label: "コーン",
        value: "cone",
      },
      {
        label: "落下物",
        value: "road_debris",
      },
      {
        label: "発煙筒",
        value: "warning_flare",
      },
      {
        label: "三角表示板",
        value: "warning_triangle",
      },
    ],
  },
  {
    tag_type: { value: "dynamic_object", label: "動的物体" },
    tag_options: [
      {
        label: "歩行者",
        value: "pedestrian",
      },
      {
        label: "自転車",
        value: "bicycle",
      },
      {
        label: "乗用車",
        value: "passenger_car",
      },
      {
        label: "工事車両",
        value: "construction_vehicle",
      },
      {
        label: "農業機械",
        value: "agricultural_vehicle",
      },
      {
        label: "パトカー",
        value: "police_car",
      },
      {
        label: "救急車",
        value: "ambulance",
      },
      {
        label: "消防車",
        value: "fire_truck",
      },
      {
        label: "バス",
        value: "bus",
      },
      {
        label: "トラック",
        value: "truck",
      },
      {
        label: "バイク",
        value: "motorcycle",
      },
      {
        label: "電車",
        value: "train",
      },
      {
        label: "その他特殊車両",
        value: "special_vehicle",
      },
      {
        label: "動物",
        value: "animal",
      },
    ],
  },
  {
    tag_type: { value: "traffic_volume", label: "交通量" },
    tag_options: [
      {
        label: "閑散",
        value: "light_traffic",
      },
      {
        label: "通常",
        value: "moderate_traffic",
      },
      {
        label: "混雑",
        value: "heavy_traffic",
      },
    ],
  },
  {
    tag_type: { value: "traffic_event", label: "交通イベント" },
    tag_options: [
      {
        label: "交通事故",
        value: "traffic_accident",
      },
      {
        label: "工事中",
        value: "under_construction",
      },
      {
        label: "交通規制",
        value: "traffic_control",
      },
    ],
  },
  {
    tag_type: { value: "location", label: "場所" },
    tag_options: [
      {
        label: "住宅街",
        value: "residential_area",
      },
      {
        label: "田舎",
        value: "rural_area",
      },
      {
        label: "都市部",
        value: "urban_area",
      },
      {
        label: "高速道路",
        value: "highway",
      },
      {
        label: "山間部",
        value: "mountainous_area",
      },
      {
        label: "海岸",
        value: "coastal_area",
      },
      {
        label: "駐車場",
        value: "parking_lot",
      },
      {
        label: "トンネル",
        value: "tunnel",
      },
      {
        label: "橋",
        value: "bridge",
      },
      {
        label: "地下",
        value: "underground",
      },
      {
        label: "不明",
        value: "unknown",
      },
    ],
  },
  {
    tag_type: { value: "visibility", label: "視界" },
    tag_options: [
      {
        label: "良好",
        value: "clear",
      },
      {
        label: "逆光",
        value: "backlit",
      },
      {
        label: "水滴",
        value: "raindrops",
      },
      {
        label: "霧",
        value: "foggy",
      },
      {
        label: "暗い",
        value: "dark",
      },
      {
        label: "夜明け/夕暮れ",
        value: "dawn/dusk",
      },
      {
        label: "グレア",
        value: "glare",
      },
    ],
  },
];
