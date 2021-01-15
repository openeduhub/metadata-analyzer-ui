import express from "express";
import https from "https";
import {TwingEnvironment, TwingLoaderFilesystem} from "twing";
import got from "got";
import Data = yovisto.Data;
import DataPrediction = yovisto.DataPrediction;

const REPO_URL = 'https://redaktion-staging.openeduhub.net/edu-sharing/';

const loader = new TwingLoaderFilesystem('./templates');
const twing = new TwingEnvironment(loader);

const app = express()
const port = 3000

declare namespace yovisto {

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


    export interface Data {
        title: Group[];
        description: Group[];
        disciplines: string[];
        essentialCategories: string[];
        language: string;
    }
    export type DataPrediction = {[key in string]: number};

}

app.get('/', (req, res) => {
    const dataIn = {
        "_source":{
            "properties": null as any
        }
    }
    console.log(req.query);
    let node: any;
    try {
        node = JSON.parse(req.query.node as any);
        dataIn._source.properties = node.properties;
    }catch(e) {
        console.warn(e);
        res.send('Invalid format for parameter node');
        return;
    }
    const text = [
        dataIn._source.properties['cclom:title'].join(' '),
        dataIn._source.properties['cclom:general_description'].join(' '),
    ].join(' ');
    Promise.all([
        got.post<Data>('https://wlo.yovisto.com/services/analyze', {json: dataIn, responseType: 'json'}),
        got.post<DataPrediction[]>('https://wlo.yovisto.com/predict_subjects', {json: { text }, responseType: 'json'}),
        got.post<DataPrediction[]>('https://wlo.yovisto.com/recommend', {json: { doc: node.ref.id }, responseType: 'json'})
    ]).then(async ([r1, r2, r3]) =>{
        const data1 = r1.body;
        // dirty hack, api provides no clean json
        const data2 = JSON.parse(r2.body as any) as DataPrediction[];
        const recommend = JSON.parse(r3.body as any) as DataPrediction[];
        const data2Disciplines = data2.map((v) => {
            console.log(v, Object.keys(v));
            return 'https://vocabs.openeduhub.de/w3id.org/openeduhub/vocabs/discipline/' +v[0]
        });
        console.log(recommend);
        const templateData = {
            title: dataIn._source.properties['cclom:title']?.[0] ?? dataIn._source.properties['cm:name']?.[0],
            language: data1.language,
            disciplinesAnalyze: await mapDisciplines(data1.disciplines),
            disciplinesPredict: (await mapDisciplines(data2Disciplines)).map((d, index) => {
                return {
                    label: d,
                    precision: data2[index][1]
                }
            }),
            recommend: await Promise.all(recommend.map(async (r, index) => {
                let label = r[0];
                try {
                    console.log(REPO_URL + 'rest/node/v1/nodes/-home-/metadata/' + r[0]);
                    const apiNode = await got<any>(REPO_URL + 'rest/node/v1/nodes/-home-/' + r[0] + '/metadata', {responseType: 'json'});
                    label = apiNode.body.node.title;
                }catch(e){
                    console.warn(e);
                }
                return {
                    label,
                    url: REPO_URL + 'components/render/' + r[0],
                    similarity: recommend[index][1]
                }
            })),
            categories: data1.essentialCategories,
        };
        console.log(templateData.recommend);
        twing.render('template.twig', templateData).then((output) => {
            res.end(output);
        });

    }).catch((error) => {
        console.error(error);
        res.end('Error while retrieving AI API: ' + error);
    });
})
function mapDisciplines(disciplines: string[]) {
    return Promise.all(disciplines.map(async (discipline) => {
        try {
            const disciplineData = await got(discipline + '.json');
            return JSON.parse(disciplineData.body).prefLabel.de;
        } catch (e) {
            console.warn(e);
        }
    }))
}

app.listen(port, () => {})
