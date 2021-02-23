// Auto-generated using https://app.quicktype.io/

export interface SkosEntry {
    id: string;
    type: string;
    followers: string;
    inbox: string;
    prefLabel: PrefLabel;
    altLabel: SkosEntryAltLabel;
    inScheme: InScheme;
    topConceptOf: TopConceptOf;
    '@context': Context;
}

export interface Context {
    '@version': number;
    id: string;
    type: string;
    '@vocab': string;
    xsd: string;
    dct: string;
    schema: string;
    vann: string;
    as: string;
    ldp: string;
    title: Description;
    description: Description;
    issued: Created;
    created: Created;
    modified: Created;
    creator: string;
    publisher: string;
    preferredNamespacePrefix: string;
    preferredNamespaceUri: string;
    isBasedOn: string;
    source: string;
    prefLabel: BroaderTransitive;
    hiddenLabel: AltLabel;
    altLabel: AltLabel;
    definition: BroaderTransitive;
    scopeNote: AltLabel;
    note: AltLabel;
    notation: BroaderTransitive;
    narrower: BroaderTransitive;
    narrowerTransitive: BroaderTransitive;
    broaderTransitive: BroaderTransitive;
    followers: string;
    inbox: string;
}

export interface AltLabel {
    '@container': string[];
}

export interface BroaderTransitive {
    '@container': string;
}

export interface Created {
    '@id': string;
    '@type': string;
}

export interface Description {
    '@id': string;
    '@container': string;
}

export interface SkosEntryAltLabel {
    de: string[];
}

export interface InScheme {
    id: string;
    title: PrefLabel;
}

export interface PrefLabel {
    de: string;
    en: string;
}

export interface TopConceptOf {
    id: string;
}
