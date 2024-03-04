"use client";

import type {Prediction} from "@/types";

import {useFormState, useFormStatus} from "react-dom";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {createPrediction, getPrediction} from "@/actions";
import {Skeleton} from "@/components/ui/skeleton";
import ImagePlaceholder from "@/components/ImagePlaceholder";

function FormContent({image}: {image: string | undefined}) {
  const {pending} = useFormStatus();
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return (
    <main className="mx-auto max-w-5xl">
      <section className="mx-auto my-10 max-w-xl">
        {/* <p className="mb-1 text-center text-sm">Usage:</p> */}
        <p className="text-pretty text-base text-white/80">
          Input an image from a room you want to redecorate, and prompt the model to generate an
          image as you would.{" "}
          <span className="text-gray-400/80">
            This model is ControlNet adapting Stable Diffusion to use M-LSD detected edges in an
            input image in addition to a text input to generate an output image.
          </span>
        </p>
      </section>

      <section>
        <div className="flex flex-row justify-center gap-x-8">
          <div>
            <h1 className="mb-2 font-semibold">Original:</h1>
            {originalImage ? (
              <img
                alt="original"
                className="mx-auto h-[300px]  w-[430px] rounded object-contain"
                src={originalImage}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
          <div>
            <h1 className="mb-2 font-semibold">Result:</h1>
            {pending ? (
              <Skeleton className="mx-auto h-[300px] w-[430px] rounded" />
            ) : image ? (
              <img
                alt="prediction"
                className="mx-auto h-[300px] w-[430px] rounded object-contain"
                src={image}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto my-8 flex max-w-4xl flex-row gap-x-8">
        <div className="w-1/2">
          <label className="text-lg font-bold" htmlFor="image">
            Upload an image
          </label>
          <Input
            required
            className="mb-4 mt-2 cursor-pointer"
            id="image"
            name="image"
            type="file"
            onChange={(e) => handleUploadFile(e)}
          />

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

        <Button className="mb-6 mt-10 w-1/2" disabled={pending}>
          Crear
        </Button>
      </section>
    </main>
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
    <section className="">
      <form action={formAction} className="">
        <FormContent image={state?.output ? state.output[1] : undefined} />
      </form>
    </section>
  );
}
