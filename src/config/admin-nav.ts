import {
  LayoutDashboard,
  FileText,
  Image,
  Tag,
  Settings,
  Plus,
  List,
} from "lucide-react";

export interface NavItem {
  title: string;
  titleZh: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

export const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    titleZh: "仪表盘",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Posts",
    titleZh: "文章",
    href: "/admin/posts",
    icon: FileText,
    children: [
      {
        title: "All Posts",
        titleZh: "所有文章",
        href: "/admin/posts",
        icon: List,
      },
      {
        title: "New Post",
        titleZh: "新建文章",
        href: "/admin/posts/new",
        icon: Plus,
      },
    ],
  },
  {
    title: "Media",
    titleZh: "媒体库",
    href: "/admin/media",
    icon: Image,
  },
  {
    title: "Tags",
    titleZh: "标签",
    href: "/admin/tags",
    icon: Tag,
  },
  {
    title: "Settings",
    titleZh: "设置",
    href: "/admin/settings",
    icon: Settings,
  },
];
