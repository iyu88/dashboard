import { AdminPromiseClient } from './admin_grpc_web_pb';
import { ListDocumentsRequest, GetDocumentRequest } from './admin_pb';

import { DocumentSummary } from './types';
import * as converter from './converter';

export * from './types';

const client = new AdminPromiseClient(`${process.env.REACT_APP_ADMIN_ADDR}`, null);

// listDocuments fetches documents from the admin server.
export async function listDocuments(
  previousID: string,
  pageSize: number,
  isForward: boolean
): Promise<Array<DocumentSummary>> {
  const req = new ListDocumentsRequest();
  req.setPreviousId(previousID);
  req.setPageSize(pageSize);
  req.setIsForward(isForward);
  const response = await client.listDocuments(req);
  const summaries = converter.fromDocumentSummaries(response.getDocumentsList());
  if (isForward) {
    summaries.reverse();
  }
  return summaries;
}

// getDocument fetches a document of the given ID from the admin server.
export async function getDocument(id: string): Promise<DocumentSummary | null> {
  const req = new GetDocumentRequest();
  req.setId(id);
  const response = await client.getDocument(req);

  const document = response.getDocument();
  if (!document) {
    return null;
  }

  const summary = converter.fromDocumentSummary(document);
  return summary;
}