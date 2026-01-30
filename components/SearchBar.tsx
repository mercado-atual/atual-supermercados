"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (texto: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8 px-4">
      <div className="relative group">
        <input
          type="text"
          placeholder="O que você procura hoje?"
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-full py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-400"
        />
        <div className="absolute left-4 top-3 text-gray-400 group-focus-within:text-red-500 transition-colors">
          <Search size={20} />
        </div>
      </div>
    </div>
  );
}