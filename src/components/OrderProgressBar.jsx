import { ORDER_STATUS } from "../constants";
import { formatIsoDate } from "../utils/date";

export default function OrderProgressBar({ orderDetails }) {
  const statusSteps = Object.values(ORDER_STATUS);

  const currentStepIndex = statusSteps.indexOf(orderDetails?.status);

  const segmentWidth = 100 / (statusSteps.length - 1);
  const activeBarWidth =
    currentStepIndex > 0 ? currentStepIndex * segmentWidth : 0;

  console.log(orderDetails, "orderDetails");

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 text-xs">
        <div>
          <p className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">
            Logistic Tracker ID
          </p>
          <p className="font-mono font-black text-gray-900 text-sm">
            #ORD-{orderDetails?.id}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">
            Courier Channel
          </p>
          <p className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] inline-block tracking-wide">
            J&T Express Regular
          </p>
        </div>
      </div>

      <div className="relative pt-2 w-full">
        <div className="absolute top-[23px] left-6 right-6 h-1 bg-gray-200 rounded-full z-0"></div>
        <div
          className="absolute top-[23px] left-6 h-1 bg-blue-600 rounded-full z-0 transition-all duration-700 ease-out"
          style={{ width: `calc(${activeBarWidth}% - 12px)` }}
        ></div>
        <div
          className="grid relative z-10 text-center"
          style={{
            gridTemplateColumns: `repeat(${statusSteps.length}, minmax(0, 1fr))`,
          }}
        >
          {statusSteps.map((statusValue, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            const createdAt = orderDetails?.statusHistory.find(
              (s) => s.status == statusValue,
            )?.createdAt;
            const statusDate = formatIsoDate(createdAt, "d MMMM, HH:mm");

            return (
              <div key={statusValue} className="space-y-2">
                <div className="flex justify-center">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 transform shadow-xs
                      ${isCurrent ? "bg-blue-600 border-4 border-blue-100 scale-110 ring-2 ring-blue-600/10" : ""}
                      ${isCompleted && !isCurrent ? "bg-blue-600 border-2 border-white" : ""}
                      ${!isCompleted ? "bg-gray-300 border-2 border-white" : ""}`}
                  >
                    {isCompleted && !isCurrent && (
                      <span className="text-[7px] text-white font-black">
                        ✓
                      </span>
                    )}
                  </span>
                </div>

                <p
                  className={`text-xs font-bold tracking-tight capitalize transition-colors duration-300 ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                >
                  {statusValue.toLowerCase().replace(/_/g, " ")}
                </p>

                {statusDate ? (
                  <p className="text-[10px] text-gray-500 font-medium font-mono hidden sm:block">
                    {statusDate}
                  </p>
                ) : (
                  <p
                    className={`text-[10px] italic hidden sm:block font-medium ${isCurrent ? "text-blue-500 animate-pulse" : "text-gray-300"}`}
                  >
                    {isCurrent ? "Processing..." : "Pending"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
