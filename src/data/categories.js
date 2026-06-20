import { faBurger, faCar, faBolt, faGamepad, faMoneyBill, faHospital, } from "@fortawesome/free-solid-svg-icons";

export const categories = [
  {
    key: "food",
    icon: faBurger,
    color: "bg-orange-100",
    iconColor: "text-orange-500",
  },

  {
    key: "transp",
    icon: faCar,
    color: "bg-blue-100",
    iconColor: "text-blue-500",
  },

  {
    key: "bill",
    icon: faBolt,
    color: "bg-amber-100",
    iconColor: "text-amber-500",
  },

  {
    key: "entertain",
    icon: faGamepad,
    color: "bg-purple-100",
    iconColor: "text-purple-500",
  },

  {
    key: "salary",
    icon: faMoneyBill,
    color: "bg-emerald-100",
    iconColor: "text-emerald-500",
  },

  {
    key: "health",
    icon: faHospital,
    color: "bg-red-100",
    iconColor: "text-red-500",
  },
];