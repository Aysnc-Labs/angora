export interface NavGroupConfig {
  dir: string;
  title?: string;
  order?: string[];
}

export interface AngoraConfig {
  nav?: NavGroupConfig[];
}

export interface NavItem {
  /** Display label, e.g. "Text Input" */
  label: string;
  /** URL path, e.g. "/design-system/text-input" */
  href: string;
  /** Directory name (= component name), e.g. "TextInput" */
  name: string;
  /** Parent group directory, e.g. "src/components" */
  dir: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
