export const ALLERGEN_MAP: Record<
  string,
  { label: string; icon: string; badgeClass: string }
> = {
  gluten: {
    label: "Gluten",
    icon: "lucide:wheat",
    badgeClass:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  },
  crustaces: {
    label: "Crustacés",
    icon: "lucide:waves",
    badgeClass:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800",
  },
  oeufs: {
    label: "Œufs",
    icon: "lucide:egg",
    badgeClass:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800",
  },
  poisson: {
    label: "Poisson",
    icon: "lucide:fish",
    badgeClass:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  },
  arachides: {
    label: "Arachides",
    icon: "lucide:alert-circle",
    badgeClass:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  },
  soja: {
    label: "Soja",
    icon: "lucide:sprout",
    badgeClass:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  },
  lait: {
    label: "Lait",
    icon: "lucide:droplets",
    badgeClass:
      "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800",
  },
  fruits_coque: {
    label: "Fruits à coque",
    icon: "lucide:alert-circle",
    badgeClass:
      "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  },
  celeri: {
    label: "Céleri",
    icon: "lucide:leaf",
    badgeClass:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  },
  moutarde: {
    label: "Moutarde",
    icon: "lucide:droplet",
    badgeClass:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800",
  },
  sesame: {
    label: "Sésame",
    icon: "lucide:circle-dot",
    badgeClass:
      "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-950/50 dark:text-stone-400 dark:border-stone-800",
  },
  sulfites: {
    label: "Sulfites",
    icon: "lucide:wine",
    badgeClass:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800",
  },
  lupin: {
    label: "Lupin",
    icon: "lucide:flower-2",
    badgeClass:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800",
  },
  mollusques: {
    label: "Mollusques",
    icon: "lucide:waves",
    badgeClass:
      "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800",
  },
  porc: {
    label: "Contient du porc",
    icon: "lucide:beef",
    badgeClass:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800",
  },
  vegan: {
    label: "Vegan",
    icon: "lucide:leaf",
    badgeClass:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  },
  vegetarien: {
    label: "Végétarien",
    icon: "lucide:leaf",
    badgeClass:
      "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-950/50 dark:text-lime-400 dark:border-lime-800",
  },
};

export function getAllergenInfo(value: string) {
  return (
    ALLERGEN_MAP[value] ?? {
      label: value,
      icon: "lucide:alert-circle",
      badgeClass:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-950/50 dark:text-gray-400 dark:border-gray-800",
    }
  );
}
