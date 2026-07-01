import daysData from "@/data/days.json";

export type Day = {
  id: number;
  day_str: string;
  title: string;
  focus: string;
  date: string;
  week_label: string;
  week_num: number;
  week_folder: string;
  review: string;
  phrases: { en: string; ru: string }[];
  phrases_cumulative: { en: string; ru: string }[];
  words: { en: string; ru: string }[];
  words_cumulative: { en: string; ru: string }[];
  dialog: { role: string; text: string }[];
  checks: string[];
  reading_title: string;
};

type Meta = {
  title: string;
  subtitle: string;
  total_days: number;
  version: string;
};

type Week = {
  id: number;
  label: string;
  folder: string;
  days: number[];
  digest_label: string;
};

type Data = {
  meta: Meta;
  weeks: Week[];
  days: Day[];
};

const data = daysData as Data;

export function getMeta() {
  return data.meta;
}

export function getWeeks() {
  return data.weeks;
}

export function getDays() {
  return data.days;
}

export function getDay(id: number) {
  return data.days.find((d) => d.id === id) ?? null;
}

export function getWeek(id: number) {
  return data.weeks.find((w) => w.id === id) ?? null;
}

export function getDaysInWeek(weekId: number) {
  const week = getWeek(weekId);
  if (!week) return [];
  return week.days.map((id) => getDay(id)).filter(Boolean) as Day[];
}

export function getTotalDays() {
  return data.meta.total_days;
}

export { data };
