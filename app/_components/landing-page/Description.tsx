import { Image } from '@/_components/Image';

export function Description() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-10">
      <div>
        <div className="mb-1 text-2xl md:w-96 md:text-3xl">
          Interact in real-time with the city of Toronto&apos;s data
        </div>
        <div className="text-lg">Harness large language models for civic engagement.</div>
      </div>
      <Image src="/low-poly-city.png" alt="low poly city" className="h-80 w-80" />
    </div>
  );
}
