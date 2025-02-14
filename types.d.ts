interface Book {
    id: string | number;
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