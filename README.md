## Getting Started with replicate-project

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Remember to get your own [Replicate API key!!!](https://replicate.com/account/api-tokens)

### Model jagilley/controlnet-hough
### Usage
Input an image, and prompt the model to generate an image as you would for Stable Diffusion. You can change the M-LSD thresholds to control the effect on the output image.

### Model description
This model is ControlNet adapting Stable Diffusion to use M-LSD detected edges in an input image in addition to a text input to generate an output image. The training data is generated using a learning-based deep Hough transform to detect straight lines from Places2 and then use BLIP to generate captions