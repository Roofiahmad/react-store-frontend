import { BADGE_COLORS, BADGE_NONE } from "../constants";

const ProductCard = ({ product, handleAddToCart, handleOnCLickProduct }) => {
  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
      <div
        className="aspect-square w-full bg-gray-50 relative border-b border-gray-100"
        onClick={handleOnCLickProduct}
      >
        {product?.badge && product?.badge !== BADGE_NONE && (
          <span
            className={`absolute top-2.5 left-2.5 z-10 bg-gray-900 px-2.5 py-0.5 text-[10px] font-bold tracking-wide rounded-md shadow-xs ${BADGE_COLORS[product.badge]}`}
          >
            {product?.badge.replace("_", " ")}
          </span>
        )}
        <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100">
          <img
            src={product.mainImage}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-95 transition-opacity"
          />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[11px] font-bold tracking-wide text-blue-600 uppercase mb-1">
          {product.category}
        </span>
        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-base font-extrabold text-gray-900">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          <button
            onClick={() => handleAddToCart(product)}
            className="bg-gray-900 text-white px-3.5 py-1.5 text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
