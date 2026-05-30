export interface GraftNote {
  id: string;
  title: string;
  folder: string;
  group: string;
  strength: number;
  status: "aprendiendo" | "solidificando" | "dominado";
  markdown: string;
  links: string[];
}

export interface GraftLink {
  source: string;
  target: string;
}

export interface GraftGraph {
  notes: GraftNote[];
  links: GraftLink[];
  groupColors: Record<string, string>;
  groupLabels: Record<string, string>;
}

export interface GraftFolder {
  name: string;
  children: { id: string; title: string }[];
}
