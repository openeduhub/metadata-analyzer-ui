import express from "express";
import https from "https";
import {TwingEnvironment, TwingLoaderFilesystem} from "twing";
import got from "got";

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
    }

}

app.get('/', (req, res) => {
    const dataIn = {
        "_source":{
            "properties": null as any
        }
    }
    console.log(req.query);
    try {
        dataIn._source.properties = JSON.parse(req.query.properties as any);
    }catch(e) {
        res.send('Invalid format for parameter properties');
        return;
    }
    const options = {
        hostname: 'wlo.yovisto.com',
        headers: {
            'Content-Type': 'application/json'
        },
        path: '/services/analyze',
        method: 'POST'
    }
    const post = https.request(options, res2 => {
        let responseData = '';
        res2.on('data', (d) => {
            responseData += d;
        });
        res2.on('end', async () => {
            const data: yovisto.Data = JSON.parse(responseData);
            const templateData: any = {
                title: dataIn._source.properties['cclom:title']?.[0],
                disciplines: await Promise.all(data.disciplines.map(async (discipline) => {
                    try {
                        const disciplineData = await got(discipline + '.json');
                        console.log(JSON.parse(disciplineData.body).prefLabel.de)
                        return JSON.parse(disciplineData.body).prefLabel.de;
                    } catch (e) {
                        console.warn(e);
                    }
                })),
                categories: data.essentialCategories,
            };
            twing.render('template.twig', templateData).then((output) => {
                res.end(output);
            });
        });
    });
    post.write(JSON.stringify(dataIn));
    post.end();
})

app.listen(port, () => {})
