import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { auth, db, storage } from "./config/firebase";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(
    import.meta.env.VITE_ADMIN_EMAIL || "admin@thefern.com"
  );
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    return () => unsub();
  }, []);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => signOut(auth);

  const uploadImage = async (file) => {
    const imageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = "";
      if (newProduct.image) {
        imageUrl = await uploadImage(newProduct.image);
      }

      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: newProduct.price,
        image: imageUrl,
        createdAt: Date.now(),
      });

      setNewProduct({ name: "", price: "", image: null });
      alert("Product added successfully!");
    } catch (err) {
      alert("Error adding product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (err) {
        alert("Error deleting product: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
        <h1 className="font-bold text-xl">THE FERN</h1>
        <div className="space-x-4 text-sm text-slate-300">
          <a href="#shop">Shop</a>
          <a href="#admin">Admin</a>
        </div>
      </div>

      <section className="text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          Affordable Fashion (₦2k - ₦5k)
        </motion.h1>
        <a href="https://wa.me/2349167046215">
          <button className="mt-4 px-6 py-2 bg-green-600 text-black font-semibold rounded hover:bg-green-700">
            Chat on WhatsApp
          </button>
        </a>
      </section>

      <section id="shop" className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p className="text-center text-slate-400">No products available yet</p>
        ) : (
          products.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-slate-900 rounded-lg overflow-hidden p-4">
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="rounded mb-2 w-full h-48 object-cover"
                  />
                )}
                <h2 className="font-bold text-lg">{p.name}</h2>
                <p className="text-lg font-semibold">₦{p.price}</p>

                <a
                  href={`https://wa.me/2349167046215?text=I want ${p.name} for ₦${p.price}`}
                >
                  <button className="mt-2 w-full py-2 bg-green-600 text-black font-semibold rounded hover:bg-green-700">
                    Buy
                  </button>
                </a>

                {user && (
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="mt-2 w-full py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </section>

      <section id="admin" className="p-6 max-w-md mx-auto mb-10 bg-slate-900 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

        {!user ? (
          <div className="space-y-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded border border-slate-700 focus:border-green-600 outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded border border-slate-700 focus:border-green-600 outline-none"
            />
            <button
              onClick={login}
              disabled={loading}
              className="w-full py-2 bg-green-600 text-black font-semibold rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-green-400">✓ Logged in as Admin</p>

            <input
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded border border-slate-700 focus:border-green-600 outline-none"
            />

            <input
              placeholder="Price (₦)"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded border border-slate-700 focus:border-green-600 outline-none"
            />

            <input
              type="file"
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.files[0] })
              }
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded border border-slate-700 focus:border-green-600 outline-none"
            />

            <button
              onClick={addProduct}
              disabled={loading}
              className="w-full py-2 bg-green-600 text-black font-semibold rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
            <button
              onClick={logout}
              disabled={loading}
              className="w-full py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 disabled:opacity-50"
            >
              Logout
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
