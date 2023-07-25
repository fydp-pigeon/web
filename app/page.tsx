import { Menu } from '@/_components/landing-page/Menu';
import { Description } from '@/_components/landing-page/Description';
import { BrowseDatasets } from '@/_components/landing-page/browse-datasets/BrowseDatasets';
import { ConversationWindow } from './_components/landing-page/ConversationWindow';

export default function Home() {
  return (
    <div className="flex justify-center p-5 font-light md:p-10">
      <div className="flex w-full flex-col gap-16 lg:w-3/5 xl:w-3/5">
        <Menu />
        <Description />
        <ConversationWindow />
        <BrowseDatasets />
      </div>
    </div>
  );
}
