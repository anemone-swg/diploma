import { ClipLoader } from "react-spinners";
import styles from "./LoaderButton.module.css";

const LoaderButton = () => {
  return (
    <div className={styles.buttonSpinner}>
      <ClipLoader size={20} color="#fff" />
    </div>
  );
};

export default LoaderButton;
