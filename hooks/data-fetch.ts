"use client"
import { keepPreviousData, useMutation, useQueries, useQuery, UseQueryOptions, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { Role, Status } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";


const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT; 

type BookTypes = "BorrowBooks" | "Books"
type BookCountTypes = "CountBorrowBooks" | "CountBooks" | "UsersCount"

type BookResponse<T extends BookTypes> = | (T extends "BorrowBooks" ? BorrowedBookApiResponse : T extends "Books" ? BookApiResponse : never) | null;

export const fetchBooks = async <T extends BookTypes>(page: number, pageSize: number, type: BookTypes): Promise<BookResponse<T>> => {
    const res = await fetch(`${BASE_URL}/api/admin/books?type=${type}&page=${page}&pageSize=${pageSize}`)  
    const data = await res.json();    
    return data;
}

const fetchCounts = async (type: BookCountTypes) => {
  const res = await fetch(`${BASE_URL}/api/admin/${type === "UsersCount" ? "usersCount" : type === "CountBooks" ? `books?type=${type}` : type === "CountBorrowBooks" ? `books?type=${type}` : undefined}`)
  const data = await res.json();
  return data;
}

const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/users`);
  const data = await res.json();
  return data;
}

const deleteUser = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, { method: "DELETE" });
  const data = await res.json();
  if(!res.ok){
    throw new Error("Error deleting user");
  }
  return data;
};

const deleteBook = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/admin/books/${id}?type=Book`, {method: "DELETE"});
  const data = await res.json()
  if(!res.ok){
    throw new Error("Error deleting book");
  }
  return data;
}

const changeUserRole = async (id: string, roleStatus: Role | Status, type: UserChangeType) => {
  let url: string;
  let body: string;


  if(type === "Role"){
    if(!Object.values(Role).includes(roleStatus as Role)){
      throw new Error("Invalid role provided");
    }
    url = `${BASE_URL}/api/admin/userRole/${id}`;
    body = JSON.stringify({roleStatus});
  } else if(type === "Status"){
    if(!Object.values(Status).includes(roleStatus as Status)){
      throw new Error("Invalid status provided");
    }
    url = `${BASE_URL}/api/admin/userStatus/${id}`
    body = JSON.stringify({roleStatus})
  } else {
    throw new Error("Invalid type provided")
  }

  const res = await fetch(url, {method: "PATCH", headers: {"Content-Type": "application/json"}, body })

  if(!res.ok){
    throw new Error("Error changing user role")
  }
  return await res.json();
}

export const useChangeRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, roleStatus, type}: {id: string, roleStatus: Role | Status, type: UserChangeType}) => changeUserRole(id, roleStatus, type),

    //data is api response and variable is data passed like {id, role}
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["usersData"], (oldData: UserApiResponse | undefined) => {
        if(!oldData) return oldData;
        
        return {
          ...oldData,
          users: oldData.users.map((user) => 
            user.id === variables.id 
              ? variables.type === "Role" 
                ? {...user, role: variables.roleStatus} //role
                : {...user, status: variables.roleStatus} //status  
              : user)
        }
      })
      toast({
        title: "Sukses",
        description: "Sapo ndryshuat rolin e perdoruesit"
      })
    },
    onError: () => {
      toast({
        title: "Gabim",
        description: "Dicka shkoi gabim, ju lutem provoni perseri!",
        variant: "destructive"
      })
    }
  })
}

export const useBooks = <T extends BookTypes>(page: number, pageSize: number, type: T) => {
  const queryResult = useSuspenseQuery<BookResponse<T>>({
    queryKey: ['books', page, pageSize, type],
    queryFn: () => fetchBooks<T>(page, pageSize, type),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
  
  return queryResult;
};

export const useCounts = () => {
  const queryResult = useSuspenseQueries({
    queries: [
      {
        queryKey: ['bookCount'],
        queryFn: () => fetchCounts("CountBooks"),
      },
      {
        queryKey: ['userCount'],
        queryFn: () => fetchCounts("UsersCount")
      },
      {
        queryKey: ['BorrowBooksCount'],
        queryFn: () => fetchCounts("CountBorrowBooks")
      }
    ],
  })  

  const [booksCountQuery, usersCountQuery, borrowBooksCountQuery] = queryResult;

  const errors = {
    usersCount: usersCountQuery.error ? true : null,
    booksCount: booksCountQuery.error ? true : null,
    borrowBooksCount: borrowBooksCountQuery.error ? true : null
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

export const useUsers = () => {
  const queryResult = useQuery({
    queryKey: ['usersData'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
  return queryResult;
}

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id}: {id: string}) => deleteBook(id),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["allbooks"], (oldData: BookApiResponse | undefined) => {
        if(!oldData) return oldData;
        return {
          ...oldData,
          book: oldData.book.filter((item) => item.id !== variables.id)
        }
      })
      toast({
        title: "Sukses",
        description: "Sapo larguat nje liber nga platforma"
      })
    },
    onError: () => {
      toast({
        title: "Gabim!",
        description: "Dicka shkoi gabim, ju lutem provoni perseri!",
        variant: "destructive"
      })
    }
  })
}

export const useDeleteUserQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id}: {id: string}) => deleteUser(id),
    onSuccess: (_, variables) => {
      
      queryClient.setQueryData(["usersData"], (oldData: UserApiResponse | undefined) => {
        
        if(!oldData) return oldData;

        return {
          ...oldData,
          users: oldData.users.filter((user) => user.id !== variables.id)
        }
      })

      toast({
        title: "Sukses",
        description: "Sapo larguat nje perdorues nga platforma"
      })
    },
    onError: () => {
      toast({
        title: "Gabim!",
        description: "Dicka shkoi gabim, ju lutem provoni perseri!",
        variant: "destructive"
      })
    }
  })
}