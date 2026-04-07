export default function Loading() {
  return (
    <div className="min-h-screen bg-surface py-20 px-12 md:px-24">
      <div className="h-12 w-48 bg-surface-container animate-pulse mb-12"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-surface-container-low animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-surface-container-low animate-pulse"></div>
      </div>
    </div>
  )
}
