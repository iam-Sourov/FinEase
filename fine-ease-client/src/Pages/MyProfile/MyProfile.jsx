import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import toast from "react-hot-toast";
import { auth } from "../../Firebase/firebase.config";

const MyProfile = () => {
  const { user, setUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData(user)
    } else {
      navigate('/')
    }
  }, [user, navigate])

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;
    const email = e.target.email.value;

    updateUser({ displayName: name, photoURL: image, email: email })
      .then(() => {
        setUser({ ...auth.currentUser })
        toast.success("Profile Updated Successfully");
      }).catch((error) => {
        toast.error(error.message)
      })
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-background">
      <div className="bg-card/45 backdrop-blur-xl border border-border/80 p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
        
        <div className="relative w-32 h-32 mx-auto mb-6">
          <img
            src={user?.photoURL || "https://i.postimg.cc/7h8Zq4Rk/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-md" />
        </div>
        
        <h1 className="text-2xl font-bold mb-1 text-foreground">{userData?.displayName || 'FinEase User'}</h1>
        <p className="text-sm text-muted-foreground mb-8">{user?.email}</p>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-2xl px-6 py-5 border-border/80 text-sm font-semibold cursor-pointer">
              Update Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] rounded-3xl border-border/50 bg-background/95 backdrop-blur-xl">
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
                  <Input id="name" name="name" defaultValue={user?.displayName} className="rounded-xl border-border/80" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image URL</Label>
                  <Input id="image" name="image" defaultValue={user?.photoURL} className="rounded-xl border-border/80" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                  <Input id="email" name="email" defaultValue={user?.email} className="rounded-xl border-border/80" />
                </div>
              </div>
              <DialogFooter className="gap-2 pt-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button" className="rounded-xl">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" className="rounded-xl w-full md:w-auto">
                    Save Changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div >
  );
}

export default MyProfile;
