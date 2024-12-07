import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { Firestore } from '@google-cloud/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getModel, preprocessImage } from './model.ts';
import { success, fail } from './helper.ts';
import type { Tensor } from '@tensorflow/tfjs-node';

const app = new Hono();
const firestore = new Firestore({ keyFilename: 'serviceAccount.json' });

const predictions = firestore.collection('predictions');

type Prediction = {
  id: string;
  result: 'Cancer' | 'Non-cancer';
  suggestion: 'Segera periksa ke dokter!' | 'Penyakit kanker tidak terdeteksi.';
  createdAt: string;
};

app.post('/predict', async (c) => {
  handler: try {
    const body = await c.req.parseBody();
    const image = body['image'];
    if (!(image instanceof File)) {
      break handler;
    }

    const maxSize = 1_000_000;

    if (image.size > maxSize) {
      return fail(c, `Payload content length greater than maximum allowed: ${maxSize}`, 413);
    }

    const [model, modelInput] = await Promise.all([getModel(), preprocessImage(image, 224, 224)]);

    const prediction = model.predict(modelInput) as Tensor;
    const scores = await prediction.data();
    const result = scores[0] > 0.5 ? 'Cancer' : 'Non-cancer';
    const suggestion =
      result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

    modelInput.dispose();

    const data: Prediction = {
      id: uuidv4(),
      result,
      suggestion,
      createdAt: new Date().toISOString(),
    };

    await predictions.doc(data.id).set(data);

    return success(c, {
      message: 'Model is predicted successfully',
      data,
      status: 201,
    });
  } catch {}

  return fail(c, 'Terjadi kesalahan dalam melakukan prediksi', 400);
});

app.get('/predict/histories', async (c) => {
  const pastPredictions = await predictions.get();
  const formattedPredictions: { id: string; history: Prediction }[] = [];

  pastPredictions.forEach((document) => {
    const prediction = document.data() as Prediction;

    formattedPredictions.push({
      id: prediction.id,
      history: prediction,
    });
  });

  return success(c, {
    data: formattedPredictions,
  });
});

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT),
});

console.log(`Server is running on http://localhost:${process.env.PORT}`);
