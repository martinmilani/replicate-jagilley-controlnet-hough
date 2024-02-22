"use server";

import type {Prediction} from "@/types";

import {unstable_noStore as noStore} from "next/cache";

export async function createPrediction(formData: FormData): Promise<Prediction> {
  noStore();

  const imageUrl = await fetch(
    `https://api.cloudinary.com/v1_1/dfx8zvzvt/image/upload?upload_preset=replicate-project&folder=replicate-project`,
    {
      method: "PUT",
      body: formData.get("image") as File,
    },
  )
    .then((res) => res.json() as Promise<{secure_url: string}>)
    .then(({secure_url}) => secure_url);

  const prediction = await fetch("https://api.replicate.com/v1/predictions", {
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        eta: 0,
        image: imageUrl,
        scale: 9,
        prompt: formData.get("prompt") as string,
        a_prompt: "best quality, extremely detailed, 4k, octane render, sharp, bloom, daylight",
        n_prompt:
          "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, blurry",
        ddim_steps: 20,
        num_samples: "1",
        value_threshold: 0.1,
        image_resolution: "512",
        detect_resolution: 512,
        distance_threshold: 0.1,
      },
      is_training: false,
      create_model: "0",
      stream: false,
      version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
    }),
    method: "POST",
    mode: "cors",
    credentials: "include",
  }).then((r) => r.json() as Promise<Prediction>);

  return prediction;
}

export async function getPrediction(id: string) {
  noStore();

  return fetch("https://api.replicate.com/v1/predictions/" + id, {
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  }).then((r) => r.json() as Promise<Prediction>);
}
