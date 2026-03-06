import { useState, useRef } from "react";
import axios from "../api/axios";
import { useCart } from "../context/CartContext";
import ImageKit from "imagekit-javascript";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .ai-page { min-height: 100vh; background: #0e0e0e; font-family: 'DM Sans', sans-serif; color: #f0ece4; padding: 60px 20px; }
  .ai-container { max-width: 1000px; margin: 0 auto; }
  .ai-header { text-align: center; margin-bottom: 60px; }
  .ai-header-tag { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #c8a97e; margin-bottom: 16px; }
  .ai-header h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(38px, 6vw, 64px); font-weight: 300; line-height: 1.1; color: #f0ece4; margin: 0 0 16px; }
  .ai-header h1 em { font-style: italic; color: #c8a97e; }
  .ai-header p { font-size: 15px; color: #888; font-weight: 300; max-width: 420px; margin: 0 auto; line-height: 1.7; }
  .ai-main-card { background: #161616; border: 1px solid #2a2a2a; border-radius: 2px; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; min-height: 460px; }
  @media (max-width: 700px) { .ai-main-card { grid-template-columns: 1fr; } }
  .ai-upload-panel { padding: 48px; display: flex; flex-direction: column; justify-content: center; border-right: 1px solid #2a2a2a; position: relative; }
  .ai-upload-label { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #666; margin-bottom: 24px; }
  .ai-dropzone { border: 1px dashed #333; border-radius: 2px; padding: 40px 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: #111; position: relative; overflow: hidden; }
  .ai-dropzone:hover { border-color: #c8a97e; background: #131313; }
  .ai-dropzone.has-image { padding: 0; border-color: #c8a97e44; }
  .ai-dropzone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .ai-dropzone-icon { width: 48px; height: 48px; margin: 0 auto 16px; border: 1px solid #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #555; font-size: 20px; }
  .ai-dropzone-text { font-size: 13px; color: #555; line-height: 1.6; }
  .ai-dropzone-text span { color: #c8a97e; display: block; margin-bottom: 4px; font-size: 14px; }
  .ai-preview-img { width: 100%; height: 280px; object-fit: cover; display: block; }
  .ai-analyze-btn { margin-top: 24px; padding: 16px; background: #c8a97e; color: #0e0e0e; border: none; border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; width: 100%; }
  .ai-analyze-btn:hover:not(:disabled) { background: #d4b98a; transform: translateY(-1px); }
  .ai-analyze-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .ai-loading-bar { position: absolute; bottom: 0; left: -100%; height: 2px; width: 100%; background: #0e0e0e; animation: loadingSlide 1.5s ease infinite; }
  @keyframes loadingSlide { 0% { left: -100%; } 100% { left: 100%; } }
  .ai-info-panel { padding: 48px; display: flex; flex-direction: column; justify-content: center; background: #111; }
  .ai-idle-state { text-align: center; }
  .ai-idle-icon { font-size: 48px; margin-bottom: 20px; opacity: 0.3; }
  .ai-idle-text { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; color: #444; font-style: italic; }
  .ai-steps { margin-top: 32px; display: flex; flex-direction: column; gap: 16px; }
  .ai-step { display: flex; align-items: flex-start; gap: 14px; }
  .ai-step-num { width: 24px; height: 24px; border: 1px solid #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #c8a97e; flex-shrink: 0; margin-top: 1px; }
  .ai-step-text { font-size: 13px; color: #555; line-height: 1.6; }
  .ai-result-state { animation: fadeInUp 0.5s ease; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .ai-concern-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #666; margin-bottom: 8px; }
  .ai-concern-value { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 300; font-style: italic; color: #c8a97e; margin-bottom: 32px; text-transform: capitalize; }
  .ai-divider { height: 1px; background: #2a2a2a; margin-bottom: 32px; }
  .ai-products-section { margin-top: 60px; animation: fadeInUp 0.6s ease 0.2s both; }
  .ai-products-header { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
  .ai-products-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: #f0ece4; }
  .ai-products-line { flex: 1; height: 1px; background: #2a2a2a; }
  .ai-products-grid { display: flex; flex-wrap: wrap; gap: 1px; background: #0e0e0e; border: 1px solid #2a2a2a; }
  .ai-product-card { background: #161616; padding: 24px; display: flex; flex-direction: column; transition: background 0.3s ease; width: 230px; flex-shrink: 0; }
  .ai-product-card:hover { background: #1c1c1c; }
  .ai-product-img-wrap { width: 100%; height: 180px; overflow: hidden; margin-bottom: 16px; background: #111; }
  .ai-product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .ai-product-card:hover .ai-product-img { transform: scale(1.05); }
  .ai-product-name { font-size: 13px; color: #ccc; margin-bottom: 8px; line-height: 1.5; flex: 1; }
  .ai-product-price { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; color: #c8a97e; margin-bottom: 16px; }
  .ai-cart-btn { padding: 10px; background: transparent; border: 1px solid #333; color: #888; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; border-radius: 1px; }
  .ai-cart-btn:hover { border-color: #c8a97e; color: #c8a97e; background: #c8a97e11; }
  .ai-no-products { text-align: center; padding: 60px; color: #444; font-family: 'Cormorant Garamond', serif; font-size: 20px; font-style: italic; background: #161616; border: 1px solid #2a2a2a; }
  .ai-analyzing-overlay { position: absolute; inset: 0; background: #0e0e0e99; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; backdrop-filter: blur(4px); }
  .ai-spinner { width: 32px; height: 32px; border: 1px solid #333; border-top-color: #c8a97e; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ai-spinner-text { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #666; }
`;

const concernInfo = {
  acne: "Visible breakouts detected. We recommend gentle cleansers and salicylic acid treatments.",
  pigmentation: "Uneven skin tone detected. Vitamin C serums and brightening treatments will help.",
  darkspots: "Dark spots detected. Niacinamide and kojic acid products are recommended.",
  oily: "Excess sebum detected. Oil-control and mattifying products are recommended.",
  dry: "Dryness detected. Deeply hydrating moisturizers and barrier repair products will help.",
  tanning: "Sun tan detected. De-tan treatments and SPF protection are recommended.",
  hairfall: "Hair thinning detected. Strengthening serums and growth treatments are recommended.",
  dandruff: "Scalp flaking detected. Anti-dandruff shampoos and scalp treatments are recommended.",
  weightloss: "Body weight concern detected. Slimming and wellness products are recommended.",
  normal: "Your skin looks healthy! Explore our maintenance and glow products.",
};

function AIUpload({ user }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const { addToCart } = useCart();

  const imagekit = new ImageKit({
    publicKey: "public_AyUHLs9Ty0WgUnMd7ixNPZnxFJQ=",
    urlEndpoint: "https://ik.imagekit.io/aryan2004",
    authenticationEndpoint: `${import.meta.env.VITE_API_URL}/imagekit/auth`
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!image) { alert("Please upload an image"); return; }
    setLoading(true);
    setResult(null);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
      const authRes = await fetch("http://localhost:5000/api/imagekit/auth");
      const authData = await authRes.json();
      await imagekit.upload({ file: base64, fileName: image.name, token: authData.token, signature: authData.signature, expire: authData.expire });
      const res = await axios.post("/ai/analyze", { image: base64 }, { headers: { "Content-Type": "application/json" } });
      setResult(res.data);
    } catch (error) {
      console.error("AI ERROR:", error);
      alert("AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ai-page">
        <div className="ai-container">
          <div className="ai-header">
            <p className="ai-header-tag">Powered by AI</p>
            <h1>Discover Your Skin's <em>Story</em></h1>
            <p>Upload a photo and let our AI analyze your skin, hair, or body concern — then shop products made for you.</p>
          </div>
          <div className="ai-main-card">
            <div className="ai-upload-panel">
              <p className="ai-upload-label">Your Image</p>
              <div className={`ai-dropzone ${preview ? "has-image" : ""}`}>
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                {preview ? (
                  <img src={preview} alt="Preview" className="ai-preview-img" />
                ) : (
                  <>
                    <div className="ai-dropzone-icon">↑</div>
                    <div className="ai-dropzone-text"><span>Choose a photo</span>Face, hair, or full body image</div>
                  </>
                )}
                {loading && (
                  <div className="ai-analyzing-overlay">
                    <div className="ai-spinner"></div>
                    <span className="ai-spinner-text">Analyzing</span>
                  </div>
                )}
              </div>
              <button className="ai-analyze-btn" onClick={handleAnalyze} disabled={loading || !image}>
                {loading ? <>Analyzing... <span className="ai-loading-bar"></span></> : "Analyze My Skin"}
              </button>
            </div>
            <div className="ai-info-panel">
              {!result ? (
                <div className="ai-idle-state">
                  <div className="ai-idle-icon">✦</div>
                  <p className="ai-idle-text">Your analysis will appear here</p>
                  <div className="ai-steps">
                    {["Upload a clear photo of your face, scalp, or body", "Click Analyze and let the AI do its work", "Get personalized product recommendations"].map((step, i) => (
                      <div className="ai-step" key={i}>
                        <div className="ai-step-num">{i + 1}</div>
                        <p className="ai-step-text">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="ai-result-state">
                  <p className="ai-concern-label">Analysis Complete</p>
                  <p className="ai-concern-value">{result.concern}</p>
                  <div className="ai-divider"></div>
                  <p style={{ fontSize: "13px", color: "#777", lineHeight: "1.8", marginBottom: "28px" }}>
                    {concernInfo[result.concern] || "Analysis complete. Browse your recommendations below."}
                  </p>
                  <div className="ai-divider"></div>
                  <div style={{ display: "flex", gap: "24px", marginBottom: "28px" }}>
                    <div>
                      <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#555", marginBottom: "6px" }}>Products Found</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: "300", color: "#c8a97e", lineHeight: 1 }}>{result.products.length}</p>
                    </div>
                    <div style={{ width: "1px", background: "#2a2a2a" }}></div>
                    <div>
                      <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#555", marginBottom: "6px" }}>Concern</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: "300", color: "#f0ece4", lineHeight: 1, textTransform: "capitalize" }}>{result.concern}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: "11px", color: "#c8a97e", letterSpacing: "2px", textTransform: "uppercase" }}>↓ Scroll to see recommendations</p>
                </div>
              )}
            </div>
          </div>
          {result && (
            <div className="ai-products-section">
              <div className="ai-products-header">
                <h2 className="ai-products-title">Recommended For You</h2>
                <div className="ai-products-line"></div>
              </div>
              {result.products.length === 0 ? (
                <div className="ai-no-products">No products found for this concern yet.</div>
              ) : (
                <div className="ai-products-grid">
                  {result.products.map((p) => (
                    <div key={p._id} className="ai-product-card">
                      <div className="ai-product-img-wrap">
                        <img src={p.image} alt={p.name} className="ai-product-img" />
                      </div>
                      <p className="ai-product-name">{p.name}</p>
                      <p className="ai-product-price">₹{p.price}</p>
                      <button className="ai-cart-btn" onClick={() => addToCart(p)}>Add to Cart</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AIUpload;