export default function ChatHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 py-6 px-6">
      <div className="max-w-screen-lg mx-auto">
        <div className="inline-flex items-center">
          <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/20">
            <h1 className="text-xl font-semibold text-gray-900">
              TimeMachine
              <span className="text-xs text-gray-400 ml-1 font-normal">Basic</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  )
}
