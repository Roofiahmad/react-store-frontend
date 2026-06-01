import { ADMIN_ORDER_STATUS_INFO, ORDER_STATUS } from "../../constants";

const OrderPanel = ({
  orderStatusFilter,
  handleOrderStatusChange,
  handleOrderStatusFilterChange,
  paginatedOrders,
  expandedOrders,
  toggleOrderExpand,
  filteredOrders,
  orderPage,
  totalOrderPages,
  setOrderPage,
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Active Order Pipeline
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Advance customer checkout states or audit transaction logs
            structures
          </p>
        </div>
        <select
          value={orderStatusFilter}
          onChange={handleOrderStatusFilterChange}
          className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 font-semibold text-gray-700 text-xs focus:outline-none cursor-pointer"
        >
          <option value="All">All Status gates</option>
          {Object.keys(ORDER_STATUS).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {paginatedOrders.map((order) => {
          const isExpanded = !!expandedOrders[order.id];
          return (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in"
            >
              {/* Customer Info Card */}
              <div className="lg:col-span-4 space-y-3 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-6 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono font-black text-sm text-gray-900">
                    #RAD-{order.id}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono font-medium">
                    {order.createdAt}
                  </span>
                </div>
                <div className="space-y-1 bg-gray-50/60 border border-gray-100 rounded-xl p-3">
                  <p className="font-bold text-gray-900">{order.fullName}</p>
                  <p className="text-gray-500 font-medium truncate">
                    {order.email}
                  </p>
                  <p className="text-gray-400 font-mono text-[11px]">
                    {order.phoneNumber}
                  </p>
                </div>
                <p className="text-gray-700 font-semibold leading-relaxed">
                  📍 {order.shippingAddress.streetAddress},{" "}
                  {order.shippingAddress.city}
                </p>
              </div>

              {/* Cargo Items Manifest */}
              <div className="lg:col-span-5 space-y-3 text-xs">
                <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-xl border border-gray-100/80">
                  <div className="pl-1">
                    <h4 className="font-black text-gray-400 uppercase tracking-wider text-[9px]">
                      Cargo Items
                    </h4>
                    <p className="text-[10px] font-bold text-gray-700">
                      {order.items.length} Products
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleOrderExpand(order.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border shadow-3xs cursor-pointer select-none
                            ${isExpanded ? "bg-gray-100 text-gray-700 border-gray-300" : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"}`}
                  >
                    <span>{isExpanded ? "Hide" : "View"}</span>
                  </button>
                </div>

                {isExpanded ? (
                  <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1 space-y-1 animate-fade-in">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-2 flex justify-between items-center text-xs first:pt-0"
                      >
                        <div className="max-w-[72%]">
                          <p className="font-bold text-gray-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-gray-400 text-[11px]">
                            Qty: {item.quantity} &times; Rp{" "}
                            {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900 font-mono">
                          Rp{" "}
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={() => toggleOrderExpand(order.id)}
                    className="p-3 bg-gray-50/40 border border-gray-200/60 rounded-xl cursor-pointer border-dashed"
                  >
                    <p className="text-gray-400 font-medium text-[11px] truncate italic">
                      {order.items
                        .map((i) => `${i.name} (x${i.quantity})`)
                        .join(", ")}
                    </p>
                  </div>
                )}

                <div className="flex justify-between border-t border-gray-100 pt-2.5 font-black text-gray-900">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Grand Total Collected
                  </span>
                  <span className="text-blue-600 font-mono text-sm">
                    Rp {order.finalTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Status Modifiers Dropdown Actions */}
              <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-4 bg-gray-50/50 rounded-xl p-4 border border-gray-100 text-xs shadow-3xs">
                <div>
                  <label className="block font-bold text-gray-400 uppercase tracking-wider text-[9px]">
                    Live Status Phrase
                  </label>
                  <p className="font-extrabold text-gray-800 text-xs mt-0.5">
                    {ADMIN_ORDER_STATUS_INFO[order.status] || order.status}
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-gray-200">
                  <label className="block font-bold text-gray-500 mb-1">
                    Modify Pipeline State
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleOrderStatusChange(order.id, e.target.value)
                    }
                    className="w-full text-xs font-bold bg-white border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {Object.keys(ORDER_STATUS).map((statusKey) => (
                      <option key={statusKey} value={statusKey}>
                        Set to: {statusKey}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 📑 ORDERS BAR PACKAGED FOOTER PAGINATION CONTROLS BLOCK */}
      {filteredOrders.length > 0 && (
        <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-2xs flex items-center justify-between text-xs font-bold text-gray-500">
          <p>
            Showing Page {orderPage} of {totalOrderPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={orderPage === 1}
              onClick={() => setOrderPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border bg-white border-gray-200 text-gray-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none"
            >
              ◀ Previous
            </button>
            <button
              disabled={orderPage === totalOrderPages}
              onClick={() => setOrderPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border bg-white border-gray-200 text-gray-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none"
            >
              Next ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPanel;
