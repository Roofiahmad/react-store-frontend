import { useNavigate } from "react-router-dom";
import { BADGE_SALE } from "../constants";

const ListProductCard = ({ products }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => navigate(`/product/${product.id}`)}
          className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center shadow-xs hover:shadow-md transition-shadow"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 relative">
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow text-xs min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase">
                {product.categoryName}
              </span>
              {product.badge === BADGE_SALE && (
                <span className="bg-red-100 text-red-700 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-md uppercaseScale">
                  Sale
                </span>
              )}
            </div>
            <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-base font-black text-gray-900 pt-1">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListProductCard;
