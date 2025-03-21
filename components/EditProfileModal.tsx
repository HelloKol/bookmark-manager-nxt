import React, { useState, useRef, ChangeEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ref, update } from "firebase/database";
import {} from "firebase/auth";
import { db } from "@/lib/firebase";
import { useAppContext } from "@/context/AppProvider";

interface UserProfile {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
});

const EditProfileModal: React.FC = () => {
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

  const onSubmit = async (data: UserProfile) => {
    try {
      // If a new image is selected, upload it to Cloudinary
      let profileImageUrl = userProfile?.profileImageUrl;
      if (selectedImage && userProfile) {
        profileImageUrl = await uploadImageToCloudinary(selectedImage);
      }

      const updates = {
        firstName: data.firstName,
        lastName: data.lastName,
        profileImageUrl,
      };

      const userRef = ref(db, `users/${userProfile?.uid}`);
      await update(userRef, updates);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Edit Info
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 shadow-lg">
          <div className="bg-[#242424] rounded-lg shadow-lg p-6">
            <Dialog.Title className="text-lg font-bold mb-4">
              Edit Profile
            </Dialog.Title>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Profile Image</label>
                <div
                  className="flex items-center justify-center"
                  onClick={handleImageClick}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
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
                <input
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
                <input
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
              <div className="flex justify-end space-x-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
            <Dialog.Close
              className="absolute top-2 right-2 text-gray-500"
              aria-label="Close"
            >
              X
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditProfileModal;
