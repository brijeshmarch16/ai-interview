import Image from "next/image";
import styles from "./loader.module.css";

function LoaderWithLogo() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image
        src="/loading-time.png"
        alt="logo"
        width={200}
        height={200}
        className="mx-auto mb-4 object-cover object-center"
      />
      <div className="mx-auto flex flex-row items-center">
        {/* <p>Let us take a .....</p> */}
        <div className={styles.loader} />
      </div>
    </div>
  );
}

export default LoaderWithLogo;
