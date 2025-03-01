interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    rating: number;
    totalCopies:number;
    availableCopies:number;
    coverColor:string;
    coverUrl:string;
    summary:string;
    isLoanedBook?:boolean;
    description: string;
    video?: string;
    createdAt: Date;
}

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: UserRole;
    universityId: string;
    universityIdCard: string;
    createdAt: Date;
    lastActivity: Date;
}

interface AuthCredentials {
    fullName: string;
    email: string;
    password: string;
    universityId: number;
    universityIdCard: string;
}

interface BookParams {
    title: string;
    author: string;
    genre: string;
    rating: number;
    coverUrl: string;
    coverColor: string;
    description: string;
    totalCopies: number;
    availableCopies: number;
    videoUrl: string;
    summary: string;
}

interface BorrowBookParams {
    bookId: string;
    userId: string;
}

interface BorrowedBook {
    id: string;
    bookId: string;
    userId: string;
    borrowedAt: Date;
    status: "BORROWED" | "RETURNED";
    dueDate: Date;
    returnDate: Date | null;
    book: Book
}

interface BookApiResponse {
    book: Book[];
    message: string;
    currentPage: number;
    totalPages: number;
}

interface BorrowedBookApiResponse {
    book: BorrowedBook[];
    message: string;
    currentPage: number;
    totalPages: number;
}

interface UserApiResponse {
    message: string;
    users: User[];
}

type UserChangeType = "Role" | "Status";
