"use client";
import Loader from "./Loader";
import { useLoader } from "./LoaderContext";

const LoaderOverlay = () => {
  const { loading } = useLoader();
  return loading ? <Loader /> : null;
};

export default LoaderOverlay;
