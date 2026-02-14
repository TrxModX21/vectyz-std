interface FileType {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  collectionImage?: string;
  video?: string;
  status: "active" | "inactive";
  supportedFileExtension: string;
  createdAt: string;
  updatedAt: string;
}

interface FileTypeResponse {
  message: string;
  fileTypes: FileType[];
  totalCount: number;
  timestamp: string;
}
