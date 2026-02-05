import React from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useCart } from "../../../context/CartContext";

const ProductCard = ({ product, onClick }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const existingItem = cartItems?.find((item) => item.id === product.id);
  const quantity = existingItem?.quantity || 0;
  const handleIncrease = (e) => {
    e.stopPropagation();
    if (!existingItem) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        imageAlt: product.imageAlt,
        category: product.category,
        quantity: 1,
      });
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (quantity === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div
      onClick={() => onClick(product)}
      className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-all duration-250 hover:shadow-lg hover:scale-[0.98] w-full min-w-0 flex flex-col h-full"
    >
      <div className="relative w-full h-[260px] overflow-hidden bg-muted">
        <Image
          src={product?.image}
          alt={product?.imageAlt}
          className="w-full h-full object-cover"
        />
        {product?.isNew && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
            NEW
          </div>
        )}
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 mb-2">
          {product?.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)]?.map((_, index) => (
            <Icon
              key={index}
              name={index < Math.floor(product?.rating) ? "Star" : "StarOff"}
              size={14}
              color={
                index < Math.floor(product?.rating)
                  ? "var(--color-warning)"
                  : "var(--color-muted)"
              }
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product?.rating?.toFixed(1)})
          </span>
        </div>

        <div className="mt-auto pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg md:text-xl font-bold text-primary">
              ${product?.price?.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {product?.category}
            </span>
          </div>
          {quantity === 0 ? (
            <Button
              size="sm"
              iconName="ShoppingCart"
              iconPosition="left"
              onClick={handleIncrease}
              className="w-full"
            >
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-md px-2 py-1">
              <button
                onClick={handleDecrease}
                className="px-2 py-1 text-primary hover:bg-primary/20 rounded text-lg"
              >
                −
              </button>

              <span className="font-semibold text-primary text-base">
                {quantity}
              </span>

              <button
                onClick={handleIncrease}
                className="px-2 py-1 text-primary hover:bg-primary/20 rounded text-lg"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
