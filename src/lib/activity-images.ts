import hikingImg from "@/assets/act-hiking.jpg";
import kayakImg from "@/assets/act-kayak.jpg";
import wineImg from "@/assets/act-wine.jpg";
import paraglideImg from "@/assets/act-paraglide.jpg";
import heroImg from "@/assets/hero-table-mountain.jpg";

const map: Record<string, string> = {
  hiking: hikingImg,
  kayak: kayakImg,
  wine: wineImg,
  paraglide: paraglideImg,
};

export const heroImage = heroImg;

export function activityImage(key: string): string {
  return map[key] ?? heroImg;
}
