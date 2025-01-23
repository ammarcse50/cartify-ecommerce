"use client";
import { ShoppingCart } from "@/app/lib/cart";
import { formatPrice } from "@/app/lib/format";
import Link from "next/link";
import { useState } from "react";

interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}

export default function ShoppingCartButton({ cart }: ShoppingCartButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Close the dropdown when clicking outside
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="btn-ghost btn-circle btn"
        aria-label="Shopping Cart"
        onClick={toggleDropdown}
      >
        <div className="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="badge badge-sm indicator-item">
            {cart?.size || 0}
          </span>
        </div>
      </button>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-52 bg-base-100 shadow-lg rounded-lg z-30"
          onBlur={closeDropdown}
          tabIndex={-1}
        >
          <div className="card card-compact">
            <div className="card-body">
              <span className="text-lg font-semibold">
                {cart?.size || 0} Items
              </span>
              <span className="text-sm text-info">
                Subtotal: {formatPrice(cart?.subtotal || 0)}
              </span>
              <div className="card-actions mt-2">
                <Link
                  href="/cart"
                  className="btn bg-fuchsia-500 text-white btn-block"
                  onClick={closeDropdown}
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
