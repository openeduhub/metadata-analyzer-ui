// Auto-generated using https://app.quicktype.io/

export interface EduSharingNode {
    remote: null;
    content: Content;
    license: License;
    isDirectory: boolean;
    commentCount: number;
    rating: Rating;
    ref: Parent;
    parent: Parent;
    type: string;
    aspects: string[];
    name: string;
    title: string;
    metadataset: string;
    repositoryType: string;
    createdAt: Date;
    createdBy: CreatedBy;
    modifiedAt: Date;
    modifiedBy: CreatedBy;
    access: string[];
    downloadUrl: string;
    properties: { [key: string]: string[] };
    mimetype: null;
    mediatype: string;
    size: null;
    preview: Preview;
    iconURL: string;
    collection: null;
    owner: CreatedBy;
}

export interface Content {
    url: string;
    hash: null;
    version: string;
}

export interface CreatedBy {
    profile: null;
    firstName: string;
    lastName: string;
    mailbox: string;
}

export interface License {
    icon: string;
    url: string;
}

export interface Parent {
    repo: string;
    id: string;
    archived: boolean;
    isHomeRepo: boolean;
}

export interface Preview {
    isIcon: boolean;
    isGenerated: boolean;
    type: string;
    mimetype: null;
    data: null;
    url: string;
    width: null;
    height: null;
}

export interface Rating {
    overall: Overall;
    user: number;
    affiliation: Affiliation;
}

export type Affiliation = unknown;

export interface Overall {
    sum: number;
    count: number;
    rating: number;
}
