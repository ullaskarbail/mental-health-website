import { useState, Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, Stage, Environment } from "@react-three/drei";
import axios from "axios";

function Model({ url }) {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene} />;
}

const YogaModelViewer = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError("");
    const form = new FormData();
    form.append("model", file);

    try {
      const res = await axios.post("http://localhost:5001/api/convert", form, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "model/gltf-binary" });
      const url = URL.createObjectURL(blob);
      setModelUrl(url);
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Failed to convert model. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="glass-card" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="title">3D Yoga Model Optimizer</h2>
        <p className="subtitle">Upload a 3D model to optimize and view it</p>

        <div className="upload-section" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <input 
            type="file" 
            onChange={upload} 
            accept=".glb,.gltf,.obj,.fbx"
            style={{ display: 'none' }}
            id="model-upload"
          />
          <label htmlFor="model-upload" className="btn" style={{ cursor: 'pointer' }}>
            {isLoading ? "Processing..." : "Upload 3D Model"}
          </label>
          {error && <div className="error-msg" style={{ marginTop: '1rem' }}>{error}</div>}
        </div>

        {modelUrl && (
          <div className="canvas-container" style={{ height: '500px', width: '100%', background: '#1a1a1a', borderRadius: '1rem', overflow: 'hidden' }}>
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
              <Suspense fallback={null}>
                <Stage environment="city" intensity={0.6}>
                  <Model url={modelUrl} />
                </Stage>
              </Suspense>
              <OrbitControls autoRotate />
            </Canvas>
          </div>
        )}
      </div>
    </div>
  );
};

export default YogaModelViewer;
