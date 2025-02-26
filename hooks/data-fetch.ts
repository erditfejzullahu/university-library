import { keepPreviousData, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT; 

type BookTypes = "BorrowBooks" | "Books"

type BookResponse<T extends BookTypes> = T extends "BorrowBooks" ? BookApiResponse : T extends "Books" ? BorrowedBookApiResponse : never;

const fetchBooks = async <T extends BookTypes>(page: number, pageSize: number, type: BookTypes): Promise<BookResponse<T>> => {
    const res = await fetch(`${BASE_URL}/api/admin/books?type=${type}&page=${page}&pageSize=${pageSize}`)
    if(!res.ok){
        throw new Error("failed to fetch books")
    }    
    const data = await res.json();    
    return data;
}

export const useBooks = <T extends BookTypes>(page: number, pageSize: number, type: T) => {
  const queryResult = useQuery<BookResponse<T>>({
    queryKey: ['books', page, pageSize, type],
    queryFn: () => fetchBooks<T>(page, pageSize, type),
    // staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });

  return queryResult;
};