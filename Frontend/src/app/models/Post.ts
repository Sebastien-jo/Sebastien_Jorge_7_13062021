

  
export class Post {

    id!: string;
    UserId!: string;
    isOwner!: boolean;
    title!: string;
    user!: {
        firstName: string;
        lastName: string;
    };
    content!: string;
    attachment!: string;
    createdAt!: Date;
    updatedAt!: Date;
    comment!: any[];
  static id: number;
}