export class DockerInstance {
   _id?: string;
   container_id: string;
   instance: string;
   parameters: [Object];
   console: string;
   done: Boolean;
   error: Boolean;
   runtime: Object;
}