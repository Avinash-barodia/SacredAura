import { Lock, Droplets, Wind, Lightbulb, Waves, Trash2, Power, Layers } from "lucide-react";

export const getCategoryIcon = (catName) => {
  if (!catName) return Layers;
  const name = catName.toLowerCase();
  if (name.includes("lock")) return Lock;
  if (name.includes("tap") || name.includes("dispenser") || name.includes("hygiene")) return Droplets;
  if (name.includes("dryer")) return Wind;
  if (name.includes("light") || name.includes("panel")) return Lightbulb;
  if (name.includes("flush")) return Waves;
  if (name.includes("dustbin")) return Trash2;
  if (name.includes("switch") || name.includes("home")) return Power;
  return Layers;
};
