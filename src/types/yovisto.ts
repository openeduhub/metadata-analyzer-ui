export interface Group {
    text: string;
    entities: Entity[];
    key: string;
}

export interface Entity {
    entity: any;
    start: number;
    end: number;
    score: number;
    categories: string[];
}

export interface AnalyzeData {
    title: Group[];
    description: Group[];
    disciplines: string[];
    essentialCategories: string[];
    language: string;
}

export type PredictionResult = [
    /** ID, e.g. '380' for disciplines or a node UUID. */
    string,
    /** Float between 0 and 1. */
    number,
];

export interface DisciplinePrediction {
    /** Discipline label, e.g. 'Mathematik'. */
    label: string;
    precision: number;
}

export interface RecommendResult {
    label: string;
    url: string;
    similarity: number;
}
