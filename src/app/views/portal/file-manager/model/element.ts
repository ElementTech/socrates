export interface FileElement {
  id?: string;
  isFolder: boolean;
  name: string;
  parent: string;
  _id?: string;
  type?: string;
  fileid?: string;
  action?: Array<any>;
  image?: string;
}
