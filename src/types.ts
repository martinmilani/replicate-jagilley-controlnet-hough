export interface Prediction {
  status: "starting" | "processing" | "succeded";
  id: string;
  output: [string, string];
}
