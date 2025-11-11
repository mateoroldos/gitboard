export type FontFamily = "sans" | "serif" | "mono";
export type TextAlign = "left" | "center" | "right" | "justify";
export type FontWeight = "normal" | "medium" | "semibold" | "bold";

export interface TextData {
  content: string;
  fontScale: number;
  fontFamily: FontFamily;
  textAlign: TextAlign;
  fontWeight: FontWeight;
  textColor: string;
  backgroundColor: string;
  padding: number;
}

export interface TextConfig {
  content: string;
  fontScale: number;
  fontFamily: FontFamily;
  textAlign: TextAlign;
  fontWeight: FontWeight;
  textColor: string;
  backgroundColor: string;
  padding: number;
}