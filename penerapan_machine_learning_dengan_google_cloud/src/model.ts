import tf from '@tensorflow/tfjs-node';

let modelPromise = tf.loadGraphModel(process.env.MODEL_JSON_URL!);
let model: Awaited<typeof modelPromise>;

export const getModel = async () => {
  if (!model) {
    model = await modelPromise;

    modelPromise = null as never;
  }

  return model;
};

export const preprocessImage = async (image: File, targetHeight: number, targetWidth: number) => {
  const imageUint8Array = await image.arrayBuffer().then((buffer) => new Uint8Array(buffer));

  return tf.image
    .resizeBilinear(tf.node.decodeImage(imageUint8Array), [targetHeight, targetWidth])
    .expandDims(0);
};
