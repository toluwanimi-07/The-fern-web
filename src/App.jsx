import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          <Button className="mt-4 text-black">Chat on WhatsApp</Button>
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
              <Card className="bg-slate-900">
                <CardContent className="p-4">
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
                    <Button className="mt-2 w-full text-black">Buy</Button>
                  </a>

                  {user && (
                    <Button
                      onClick={() => deleteProduct(p.id)}
                      className="mt-2 w-full bg-red-600"
                    >
                      Delete
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </section>

      <section id="admin" className="p-6 max-w-md mx-auto mb-10 bg-slate-900 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

        {!user ? (
          <div className="space-y-3">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              disabled={loading}
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={loading}
            />
            <Button
              onClick={login}
              className="w-full text-black"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-green-400">✓ Logged in as Admin</p>

            <Input
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              disabled={loading}
            />

            <Input
              placeholder="Price (₦)"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              disabled={loading}
            />

            <Input
              type="file"
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.files[0] })
              }
              disabled={loading}
            />

            <Button
              onClick={addProduct}
              className="w-full text-black"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </Button>
            <Button
              onClick={logout}
              className="w-full bg-red-600"
              disabled={loading}
            >
              Logout
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}