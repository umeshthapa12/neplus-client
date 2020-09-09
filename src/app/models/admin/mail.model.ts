export interface MailTemplate {
    sn?: number;
    id?: number;
    userGuid?: string;
    defaultTitle?: string;
    title?: string;
    body?: string;
    subject?: string;
    sentCounts?: number;
    description?: string;
    status?: string;
    rowOrder?: number;
}
