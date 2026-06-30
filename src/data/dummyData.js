import {
  faHouse,
  faChartBar,
  faPlus,
  faBullseye,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

export const transactions = [
  {
    id: 1,
    name: "Cicilan motor Honda",
    category: "Cicilan rutin",
    tag: "Otomatis",
    icon: "🏍️",
    amount: -650000,
    type: "out",
  },
];

export const goals = [
  {
    name: "DP Rumah",
    icon: "🏠",
    current: 17000000,
    target: 50000000,
    color: "blue",
  },
];

export const navItems = [
  { icon: faHouse, key: "home" },
  { icon: faChartBar, key: "report" },
  { icon: faPlus, key: "add" },
  { icon: faBullseye, key: "goals" },
  { icon: faGear, key: "setting" },
];
