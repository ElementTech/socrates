export class Block {
   _id?: string;
   name!: string;
   lang!: string;
   parameters!: [Object];
   dynamic!: [Object];
   shared!: [Object];
   booleans!: [Object];
   multis!: [Object];
   script!: string;
   github!: Boolean;
   github_path?: string;
   prescript!: string;
   description!: string;
   image?: string;
   createdAt?: Date;
   updateAt?: Date;
}
