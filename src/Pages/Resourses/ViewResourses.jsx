

import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";

const ViewBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const booksPerPage = 12;

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchQuery]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/resources`, {
        params: { page: currentPage, limit: booksPerPage, search: searchQuery },
      });
      setBooks(response.data.books);
      setTotalPages(Math.ceil(response.data.total / booksPerPage));
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleViewPDF = (pdfLink) => {
    window.open(pdfLink, "_blank");
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleImageError = (event) => {
    event.target.src = "https://via.placeholder.com/300x400?text=No+Image";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Library Catalog</h1>
      <div className="relative mb-8">
        <Input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <Card key={book._id} className="flex flex-col h-[420px]">
            <CardContent className="flex-grow p-4">
              <div className="aspect-w-3 aspect-h-4 mb-4 h-48">
                <img
                  src={book.imageLink}
                  alt={book.bookTitle}
                  className="object-fit rounded-md w-full h-full"
                  onError={handleImageError}
                />
              </div>
              <h3 className="text-sm font-semibold line-clamp-2 mb-2">
                {book.bookTitle}
              </h3>
              <p className="text-xs text-gray-600 mb-1">
                Publisher: {book.publisherName}
              </p>
              <p className="text-xs text-gray-600">
                Published:{" "}
                {new Date(book.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleViewPDF(book.pdfLink)}
                className="w-full text-sm"
              >
                View PDF
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ViewBooksPage;