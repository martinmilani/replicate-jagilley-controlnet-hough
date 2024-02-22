"use client";

import type {Prediction} from "@/types";

import {useFormState, useFormStatus} from "react-dom";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {createPrediction, getPrediction} from "@/actions";
import {Skeleton} from "@/components/ui/skeleton";

function FormContent({image}: {image: string | undefined}) {
  const {pending} = useFormStatus();

  return (
    <>
      {pending ? (
        <Skeleton className="h-[480px] w-[512px] rounded" />
      ) : image ? (
        <img alt="prediction" className="h-[480px] w-[512px] rounded object-cover" src={image} />
      ) : (
        <div className="h-[480px] w-[512px]">
          <img
            alt="placeholder"
            className="h-full w-full rounded object-cover opacity-25"
            src="./placeholder-image.webp"
          />
        </div>
      )}
      <section className="my-2 opacity-50">
        <p className="mb-1 text-sm">Usage:</p>
        <p className="text-sm">
          Input an image, and prompt the model to generate an image as you would for Stable
          Diffusion. This model is ControlNet adapting Stable Diffusion to use M-LSD detected edges
          in an input image in addition to a text input to generate an output image.
        </p>
      </section>
      <div>
        <label className="pl-2 text-lg font-bold" htmlFor="image">
          Upload an image
        </label>
        <Input required className="mt-2 cursor-pointer" id="image" name="image" type="file" />
      </div>
      <div>
        <label className="pl-2 text-lg font-bold" htmlFor="prompt">
          Add prompt for the model
        </label>
        <Textarea
          required
          className="mt-2"
          id="prompt"
          name="prompt"
          placeholder="An industrial bedroom"
        />
      </div>
      <Button disabled={pending}>Crear</Button>
    </>
  );
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function HomePage() {
  const [state, formAction] = useFormState(handleSubmit, null);

  async function handleSubmit(_state: null | Prediction, formData: FormData) {
    let prediction = await createPrediction(formData);

    while (["starting", "processing"].includes(prediction.status)) {
      prediction = await getPrediction(prediction.id);
      await sleep(4000);
    }

    return prediction;
  }

  return (
    <section className="m-auto grid max-w-[512px] gap-4">
      <form action={formAction} className="grid gap-4">
        <FormContent image={state?.output ? state.output[1] : undefined} />
      </form>
    </section>
  );
}
