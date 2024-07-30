import ReactDOM from "react-dom";
import ImageComponent from "./components/ImageComponent";

const App = () => (
  <div>
    <h1>React Image Component Library</h1>
    <ImageComponent
      src="example.jpg"
      alt="Example"
      width={200}
      height={200}
      rounded={true}
      borderColor="blue"
    />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));

export { ImageComponent };
