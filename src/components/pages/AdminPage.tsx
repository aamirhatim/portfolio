import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { checkIsAdmin, loginAdmin, loginWithGoogleAdmin, logoutAdmin } from "../../lib/adminLib";
import AdminDashboard from "../organisms/AdminDashboard";

export default function AdminPage() {
    const firebaseApp = useFirebaseAppContext();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkingAdmin, setCheckingAdmin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setCheckingAdmin(true);
                const isAdmin = await checkIsAdmin(firebaseApp, currentUser.uid);
                if (isAdmin) {
                    setUser(currentUser);
                } else {
                    await logoutAdmin(firebaseApp);
                    setError("Access Denied: You are not an authorized admin.");
                    setUser(null);
                }
                setCheckingAdmin(false);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [firebaseApp]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const success = await loginAdmin(firebaseApp, email, password);
        if (!success) {
            setError("Invalid credentials. Please try again.");
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        const success = await loginWithGoogleAdmin(firebaseApp);
        if (!success) {
            setError("Google login failed. Please try again.");
        }
    };

    if (loading || checkingAdmin) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <p className="text-[var(--txt-subtitle-color)] animate-pulse">Loading...</p>
            </div>
        );
    }

    if (user) {
        return <AdminDashboard />;
    }

    return (
        <div className="flex justify-center items-center h-full min-h-[70vh] px-4">
            <form
                onSubmit={handleLogin}
                className="flex flex-col gap-8 w-full max-w-sm"
            >
                {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[var(--txt-subtitle-color)]">Email</label>
                    <input
                        type="email"
                        placeholder="agent@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 border border-[var(--border-color)] rounded bg-transparent text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--txt-highlight-color)] transition-colors"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[var(--txt-subtitle-color)]">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 border border-[var(--border-color)] rounded bg-transparent text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--txt-highlight-color)] transition-colors"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <button
                        type="submit"
                        className="mt-4 p-3 bg-[var(--txt-title-color)] hover:bg-[var(--txt-highlight-color)] text-[var(--bg-color)] rounded-md font-bold text-lg transition-colors cursor-pointer"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="mt-2 p-3 border border-[var(--border-color)] text-[var(--txt-title-color)] hover:bg-[var(--bg-secondary-color)] rounded-md font-bold text-lg transition-colors cursor-pointer flex justify-center items-center gap-2"
                    >
                        Sign in with Google
                    </button>
                </div>
            </form>
        </div>
    );
}
