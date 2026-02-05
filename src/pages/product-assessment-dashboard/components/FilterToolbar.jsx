import React, { useState, useEffect, useMemo } from "react";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const DEBOUNCE_DELAY = 400;

const FilterToolbar = ({
  onFilterChange,
  categories,
  totalProducts,
  products,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const filters = {
      search: debouncedSearch,
      category: selectedCategory,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    };

    onFilterChange(filters);
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, onFilterChange]);

  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    const safeProducts = products || [];
    const safeCategories = categories || [];
    const productNameMatches = safeProducts
      .filter((p) => p?.name?.toLowerCase().includes(term))
      .map((p) => p.name);
    const categoryMatches = safeCategories.filter((cat) =>
      cat?.toLowerCase().includes(term),
    );

    const merged = [...new Set([...productNameMatches, ...categoryMatches])];

    return merged.slice(0, 3);
  }, [searchTerm, products, categories]);
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    const filters = {
      search: suggestion,
      category: selectedCategory,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    };
    onFilterChange(filters);
    setShowSuggestions(false);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
  };

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories?.map((cat) => ({
      value: cat,
      label: cat?.charAt(0)?.toUpperCase() + cat?.slice(1),
    })),
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Filter Products
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Package" size={16} />
          <span className="whitespace-nowrap">
            {totalProducts?.toLocaleString()} products
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative">
          <Input
            type="search"
            label="Search Products"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              setShowSuggestions(true);

              if (!value) {
                onFilterChange({
                  search: "",
                  category: selectedCategory,
                  minPrice: minPrice ? parseFloat(minPrice) : null,
                  maxPrice: maxPrice ? parseFloat(maxPrice) : null,
                });
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-md shadow-lg z-50">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <Select
          label="Category"
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
        <div className="flex gap-2">
          <Input
            type="number"
            label="Min Price"
            placeholder="$0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            label="Max Price"
            placeholder="$999"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={handleReset}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterToolbar;
