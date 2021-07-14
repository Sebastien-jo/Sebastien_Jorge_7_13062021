

  
export class Post {

    id!: string;
    UserId!: string;
    isOwner!: boolean;
    title!: string;
    user!:{
          firstname: string,
          lastname: string,
    }
    content!: string;
    attachment!: string;
    createdAt!: Date;
    updatedAt!: Date;
    comment!: any[];
}

