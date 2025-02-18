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