import { createRoot } from "react-dom/client";
import ImageLoader from "./components/image-loader";
import useImage from "./hooks/useImage";
import useResizeImage from "./hooks/useResizeImage";

// const App = () => {
//   return <></>;
// };

// const container = document.getElementById("root");
// if (container) {
//   const root = createRoot(container);
//   root.render(<App />);
// }

export { ImageLoader, useImage, useResizeImage };
