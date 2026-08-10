import React, { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { Button } from "@/components/ui/button"
import { Link, useLocation, useNavigate } from "react-router";
import FormInput from "../../components/FormInput";
import toast from "react-hot-toast";

const Login = () => {
    const { GoogleLogin, LogIn, setUser, setLoading } = useContext(AuthContext);

    const navigate = useNavigate()
    const location = useLocation();

    const handleLogin = (e) => {
        e.preventDefault();
        const regEx = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        const email = e.target.email.value;
        const password = e.target.password.value;
        if (!regEx.test(password)) {
            toast.error('Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long.')
            setLoading(false);
            return;
        }
        LogIn(email, password)
            .then((res) => {
                setUser(res.user);
                toast.success("Logged in successfully!");
                navigate(`${location.state ? location.state : '/'}`);
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to login. Please check credentials.');
            })
            .finally(() => {
                setLoading(false)
            })
    };

    const handleGoogleLogin = () => {
        GoogleLogin()
            .then((res) => {
                setUser(res.user);
                toast.success("Logged in with Google")
                navigate(location.state || "/");
            })
            .catch((error) => toast.error(error.message));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="bg-card/45 backdrop-blur-xl border border-border/80 p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md relative z-10">
                <h2 className="text-3xl font-bold text-center mb-8 tracking-tight text-foreground">Welcome Back</h2>
                
                <form className="space-y-5" onSubmit={handleLogin}>
                    <FormInput label="Email" name="email" type="email" placeholder="you@example.com" />
                    <FormInput label="Password" name="password" type="password" placeholder="••••••••" />
                    <Button className="w-full py-6 rounded-2xl font-semibold mt-2 cursor-pointer shadow-md hover:shadow-lg transition-all">
                        Login
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/60"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2.5 text-muted-foreground font-medium">Or continue with</span>
                    </div>
                </div>

                <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="w-full py-6 rounded-2xl border-border/80 text-foreground/80 hover:text-foreground cursor-pointer flex items-center justify-center gap-3 transition-colors"
                >
                    <svg aria-label="Google logo" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <g>
                            <path d="m0 0H512V512H0" fill="#fff" fillOpacity="0"></path>
                            <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                            <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                            <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                            <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                        </g>
                    </svg>
                    Google
                </Button>

                <p className="text-center mt-8 text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link className="text-primary font-semibold hover:underline" to="/signup">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
