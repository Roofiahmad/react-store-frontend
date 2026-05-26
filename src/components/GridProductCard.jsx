import { useNavigate } from "react-router-dom";
import { BADGE_SALE, PATHS } from "../constants";

const GridProductCard = ({ products }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => navigate(PATHS.PRODUCT_DETAILS + `/?id=${product.id}`)}
          className="group cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col h-full"
        >
          <div className="aspect-square bg-gray-50 w-full overflow-hidden border-b border-gray-100 relative">
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            {product.badge === BADGE_SALE && (
              <span className="absolute top-2.5 left-2.5 bg-red-600 border border-red-500 text-white font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm">
                Sale
              </span>
            )}
          </div>
          <div className="p-4 flex flex-col flex-grow text-xs">
            <span className="text-[10px] font-bold text-blue-600 uppercase mb-0.5">
              {product.categoryName}
            </span>
            <h3 className="font-bold text-gray-800 line-clamp-2 leading-snug flex-grow group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm font-extrabold text-gray-900 pt-3 border-t border-gray-50 mt-3">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridProductCard;
