export default function Loading() {
  return (
    <div className="min-h-screen bg-surface py-12 px-8">
      <div className="h-10 w-64 bg-surface-container animate-pulse mb-12"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-surface-container-low animate-pulse"></div>
        ))}
      </div>
      <div className="h-96 bg-surface-container-low animate-pulse"></div>
    </div>
  )
}
