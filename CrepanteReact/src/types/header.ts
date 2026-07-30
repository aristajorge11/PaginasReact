export interface HeaderLink {
  label: string;
  href: string;
}

export interface MegaMenuGroup {
  section: string;
  items: string[];
}

export interface HeaderData {
  links: HeaderLink[];
  megaMenus: Record<string, MegaMenuGroup[]>;
  megaMenuTriggers: string[];
}
