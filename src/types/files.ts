export type AttachmentFileType = 'file' | 'image';
export type AttachmentFile = { type: AttachmentFileType; signedUrl: string | undefined };

export type PendingLocalFileState = {
  status: 'pending';
  file: AttachmentFile;
};

export type ErrorLocalFileState = {
  status: 'error';
  file: AttachmentFile;
};

export type SuccessLocalFileState = {
  status: 'success';
  file: AttachmentFile;
  id: string;
};

export type LocalFileState = PendingLocalFileState | ErrorLocalFileState | SuccessLocalFileState;
export type FileStatus = LocalFileState['status'];
