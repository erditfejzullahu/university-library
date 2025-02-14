interface Book {
    title: string;
    author: string;
    genre: string;
    rating: number;
    totalCopies:number;
    availableCopies:number;
    coverColor:string;
    coverUrl:string;
    video:string;
    summary:string;
    isLoanedBook?:boolean;
    description: string;
    video?: string;
}