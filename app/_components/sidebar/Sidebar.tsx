import {
  ArrowLeftOnRectangleIcon,
  BookmarkIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { SidebarItem } from './SidebarItem';
import { getServerUser } from '@/_lib/server/getServerUser';

export async function Sidebar() {
  const user = await getServerUser();
  const iconHeight = 20;

  return (
    <div className="text-md space-y-2">
      <div className="px-4 pt-2 text-lg font-light">{user.name}</div>

      <div className="divider" />

      <SidebarItem icon={<ChartBarIcon height={iconHeight} />} text="Datasets" href="/dashboard/datasets" />
      <SidebarItem
        icon={<BookmarkIcon height={iconHeight} />}
        text="Bookmarked"
        href="/dashboard/datasets/bookmarked"
      />

      <div className="divider" />

      <SidebarItem
        icon={<ChatBubbleLeftRightIcon height={iconHeight} />}
        text="Chat with data"
        href="/dashboard/chat"
        isPrimary
      />

      <div className="divider" />

      <SidebarItem icon={<UserCircleIcon height={iconHeight} />} text="Profile" href="/dashboard/profile" />
      <SidebarItem icon={<ArrowLeftOnRectangleIcon height={iconHeight} />} text="Sign out" href="/signout" />
    </div>
  );
}
