import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import type { AppDispatch, AppState } from "./index";

import en from "../../public/language/en";
import vi from "../../public/language/vi";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useTrans = () => {
    const { locale } = useRouter();

    const trans = locale === "vi" ? vi : en;

    return trans;
};
