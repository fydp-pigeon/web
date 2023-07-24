export default function Explore() {
  return (

    <div className="grid grid-cols-1 p-16">
      {/* <DatasetLink href="/">Top 5 Popular Datasets</DatasetLink> */}
      <div className="flex flex-col h-48 rounded-lg bg-slate-300 text-black">
        <div className="p-8">
          <h1>Top 5 Popular Datasets</h1>
          <h3>1. abc</h3>
          <h3>2. def</h3>
          <h3>3. ghi</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 gap-4 pt-4">
        <div className="flex h-64 rounded-lg bg-slate-300 text-primary-content"></div>
        <div className="flex h-64 rounded-lg bg-slate-300 text-primary-content"></div>
      </div>
    </div>
  );
}
