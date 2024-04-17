import * as express from 'express';
import * as morgan from 'morgan';
import { DB } from './database/DB';
import { Alias } from './database/models/Alias';

const db = DB.getInstance();
const app: express.Application = express();

db.start();
app.use(express.json());
app.use(morgan('combined'));

app.get('/', (req: express.Request, res: express.Response) => {
    res.header('X-Robots-Tag', 'noindex, nofollow');
    res.redirect(301, process.env.REDIRECT_URL);
});

app.get('/status', async (req: express.Request, res: express.Response) => {
    const token = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString();

    if (token !== process.env.AUTH_TOKEN) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try {
        const aliases = await Alias.find();
        const aliasList = aliases.map((alias) => {
            return {
                shortUrl: `${process.env.SHORTNER_URL}/${alias.name}`,
                originalUrl: alias.url,
                hits: alias.hits.length,
            };
        });

        res.status(200).json(aliasList);
    } catch (error) {
        res.status(500).json({
            message: 'Error getting status'
        });
    }
});

app.get('/:alias', async (req: express.Request, res: express.Response) => {
    const alias = req.params.alias;
    const aliasInfo = await Alias.findOne({ name: alias });

    if (aliasInfo) {
        aliasInfo.hits.push({
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        aliasInfo.save();
        res.header('X-Robots-Tag', 'noindex, nofollow');
        res.redirect(301, aliasInfo.url);
    } else {
        res.header('X-Robots-Tag', 'noindex, nofollow');
        res.redirect(301, process.env.REDIRECT_404_URL);
    }
});

app.post('/alias', async (req: express.Request, res: express.Response) => {
    const token = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString();
    const alias = req.body;

    if (token !== process.env.AUTH_TOKEN) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    if (!alias.name || alias.name === '') {
        alias.name = Math.random().toString(36).substring(2, 7);
    }

    if (await Alias.findOne({ name: alias.name })) {
        res.status(409).json({
            message: 'Shortened url already exists',
            url: `${process.env.SHORTNER_URL}/${alias.name}`
        });
        return;
    }

    try {
        const newAlias = new Alias({
            name: alias.name,
            url: alias.url,
        });

        await newAlias.save();

        res.status(201).json({
            message: 'Shortened url created',
            url: `${process.env.SHORTNER_URL}/${alias.name}`
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error creating shortened url'
        });
    }
});

app.listen(3000, () => {
    console.log('Shortner listening on port 3000');
});
