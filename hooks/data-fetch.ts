import { keepPreviousData, useQueries, useQuery, UseQueryOptions, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT; 

type BookTypes = "BorrowBooks" | "Books"
type BookCountTypes = "CountBorrowBooks" | "CountBooks" | "UsersCount"

type BookResponse<T extends BookTypes> = T extends "BorrowBooks" ? BorrowedBookApiResponse : T extends "Books" ? BookApiResponse : never;

const fetchBooks = async <T extends BookTypes>(page: number, pageSize: number, type: BookTypes): Promise<BookResponse<T>> => {
    const res = await fetch(`${BASE_URL}/api/admin/books?type=${type}&page=${page}&pageSize=${pageSize}`)
    if(!res.ok){
        throw new Error("failed to fetch books")
    }    
    const data = await res.json();    
    return data;
}

const fetchCounts = async (type: BookCountTypes) => {
  const res = await fetch(`${BASE_URL}/api/admin/${type === "UsersCount" ? "usersCount" : type === "CountBooks" ? `books?type=${type}` : type === "CountBorrowBooks" ? `books?type=${type}` : undefined}`)
  if(!res.ok){
    return null;
  }
  const data = await res.json();
  return data;
}

export const useBooks = <T extends BookTypes>(page: number, pageSize: number, type: T) => {
  const queryResult = useSuspenseQuery<BookResponse<T>>({
    queryKey: ['books', page, pageSize, type],
    queryFn: () => fetchBooks<T>(page, pageSize, type),
    // staleTime: 1000 * 60 * 5, // 5 minutes
    
  });

  return queryResult;
};

export const useCounts = () => {
  const queryResult = useSuspenseQueries({
    queries: [
      {
        queryKey: ['bookCount'],
        queryFn: () => fetchCounts("CountBooks")
      },
      {
        queryKey: ['userCount'],
        queryFn: () => fetchCounts("UsersCount")
      },
      {
        queryKey: ['BorrowBooksCount'],
        queryFn: () => fetchCounts("CountBorrowBooks")
      }
    ]
  })  

  const [booksCountQuery, usersCountQuery, borrowBooksCountQuery] = queryResult;

  const errors = {
    usersCount: usersCountQuery.data === null ? true : null,
    booksCount: booksCountQuery.data === null ? true : null,
    borrowBooksCount: borrowBooksCountQuery.data === null ? true : null
  }
  const hasError = Object.values(errors).some((error) => error !== undefined)

  return {
    usersCount: usersCountQuery.data,
    booksCount: booksCountQuery.data,
    borrowBooksCount: borrowBooksCountQuery.data,
    error: hasError ? "something went wrong" : null,
    errors
  };
}