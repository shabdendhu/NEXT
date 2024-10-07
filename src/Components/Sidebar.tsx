// components/Sidebar.tsx
export default function Sidebar() {
  return (
    <div className="min-w-[250px] bg-blue-300 p-5 flex flex-col gap-5">
      <h1 className="text-[20px]">SIDEBAR</h1>
      <div className="w-full flex flex-col h-full gap-3 overflow-auto">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Button 1
        </button>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Button 2
        </button>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Button 3
        </button>
      </div>
    </div>
  );
}
