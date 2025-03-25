import React, { useState, useRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAppContext } from "@/context/AppProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";

interface Props {
  isDialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
});

const EditProfileModal: React.FC<Props> = ({ isDialogOpen, setDialogOpen }) => {
  const { user: userProfile } = useAppContext();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeMB = 5;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfile>({
    resolver: yupResolver(schema),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    defaultValues: userProfile,
  });

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  // Use TanStack Query mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UserProfile) => {
      if (!userProfile?.uid) {
        throw new Error("User ID not found");
      }

      // If a new image is selected, upload it to Cloudinary
      let profileImageUrl = userProfile?.profileImageUrl;
      if (selectedImage) {
        profileImageUrl = await uploadImageToCloudinary(selectedImage);
      }

      const updates = {
        firstName: data.firstName,
        lastName: data.lastName,
        profileImageUrl,
      };

      const userDocRef = doc(db, "users", userProfile.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await updateDoc(userDocRef, updates);
      } else {
        await setDoc(userDocRef, {
          ...updates,
          createdAt: new Date().toISOString(),
        });
      }

      return updates;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    },
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    // Reset error state
    setError(null);

    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewImage(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onSubmit = (data: UserProfile) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Profile Image</label>
            <div
              className="flex items-center justify-center"
              onClick={handleImageClick}
            >
              <Image
                width={50}
                height={50}
                src={
                  previewImage ||
                  userProfile?.profileImageUrl ||
                  "https://placehold.co/600x400"
                }
                alt="Profile"
                className="w-34 h-34 rounded-full object-cover mr-4"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">First Name</label>
            <Input
              type="text"
              {...register("firstName")}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Last Name</label>
            <Input
              type="text"
              {...register("lastName")}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={updateProfileMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
