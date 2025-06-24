import React from "react";
import clipLoader_styles from "@/shared/ui/Loader.module.css";
import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className={clipLoader_styles.spinner}>
      <ClipLoader size={50} color="#3498db" />
    </div>
  );
};

export default Loader;
