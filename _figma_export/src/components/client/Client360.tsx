import { Footer } from '../Footer';

export function Client360() {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-900">Client 360</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-gray-900 mb-6">Client 360</h1>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Client 360 page - Ready for your detailed specifications</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}