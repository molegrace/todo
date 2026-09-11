import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import DashboardLayout from "../components/DashboardLayout";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { setUserProfile } from "../api/firebaseAuthApi";
import {
  getUserProfileDoc,
  updateUserProfileDoc,
  type SocialLinks,
} from "../api/firestoreUsersApi";

const presetAvatars = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Jack",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Milo",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Oliver",
];

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { setBanner } = useDashboard();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [photoURL, setPhotoURL] = useState<string | null>(user?.photoURL ?? null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    twitter: "",
    github: "",
    linkedin: "",
    website: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const email = user?.email ?? "";

  useEffect(() => {
    if (!user?.uid) return;

    let isMounted = true;
    void (async () => {
      try {
        const doc = await getUserProfileDoc(user.uid);
        if (doc?.socialLinks && isMounted) {
          setSocialLinks({
            twitter: doc.socialLinks.twitter ?? "",
            github: doc.socialLinks.github ?? "",
            linkedin: doc.socialLinks.linkedin ?? "",
            website: doc.socialLinks.website ?? "",
          });
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to load user social links:", error);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const initials = useMemo(() => {
    const name = displayName.trim() || user?.displayName?.trim() || user?.email || "P";
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "P";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return `${first}${last}`.toUpperCase();
  }, [displayName, user?.displayName, user?.email]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setBanner({
        type: "error",
        message: "Image size is too large. Please select an image under 2MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (result) {
        setPhotoURL(result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSocialChange = (field: keyof SocialLinks, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!user) return;
    if (isSaving) return;

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setBanner({ type: "error", message: "Display name cannot be empty." });
      return;
    }

    setIsSaving(true);
    void (async () => {
      try {
        await setUserProfile(user, {
          displayName: trimmedName,
          photoURL: photoURL,
        });
        await updateUserProfileDoc(user, {
          displayName: trimmedName,
          photoURL: photoURL,
          socialLinks: {
            twitter: socialLinks.twitter?.trim(),
            github: socialLinks.github?.trim(),
            linkedin: socialLinks.linkedin?.trim(),
            website: socialLinks.website?.trim(),
          },
        });
        setBanner({ type: "success", message: "Profile updated successfully." });
      } catch (error) {
        if (import.meta.env.DEV) console.error("Profile update failed:", error);
        setBanner({
          type: "error",
          message: "Failed to update profile. Please try again.",
        });
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <DashboardLayout title="">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Avatar Selection Card */}
        <Card className="space-y-6 p-6 shadow-lg lg:col-span-1">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-main-200 bg-main-700 text-3xl font-extrabold text-white shadow-xl transition duration-300 group-hover:border-main-400">
                {photoURL ? (
                  <>
                    <img
                      src={photoURL}
                      alt="Profile avatar"
                      className="h-full w-full object-cover"
                    />
                    {/* Hover Overlay to Remove Image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => setPhotoURL(null)}
                        title="Remove photo"
                        aria-label="Remove photo"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:scale-110 hover:bg-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload avatar photo"
                aria-label="Upload avatar photo"
                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-main-700 text-white shadow-md transition hover:scale-110 hover:bg-main-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-center text-xs font-medium text-main-500">
              Or pick a preset avatar:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {presetAvatars.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoURL(preset)}
                  className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 bg-main-50 p-1 transition hover:scale-105 focus:outline-none ${
                    photoURL === preset
                      ? "border-main-700 ring-2 ring-main-400"
                      : "border-main-200 hover:border-main-400"
                  }`}
                >
                  <img
                    src={preset}
                    alt={`Preset avatar ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Right Column: User Information & Social Accounts */}
        <Card className="space-y-6 p-6 shadow-lg lg:col-span-2">
          <div>
            <h2 className="text-2xl font-bold text-main-700">
              Personal Details
            </h2>
          </div>

          <div className="space-y-5">
            <Input
              label="Display name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full"
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-main-700">
                Email Address
              </label>
              <div className="flex items-center justify-between rounded-xl border border-main-200 bg-main-50 px-4 py-3 text-sm text-main-700">
                <span className="font-medium">{email}</span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                  Verified
                </span>
              </div>
            </div>

            {/* Social Media Accounts Section */}
            <div className="space-y-4 pt-4 border-t border-main-100">
              <h3 className="text-lg font-bold text-main-700">
                Social Accounts
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Twitter / X"
                  value={socialLinks.twitter ?? ""}
                  onChange={(e) => handleSocialChange("twitter", e.target.value)}
                  placeholder="https://x.com/username"
                  className="w-full"
                />
                <Input
                  label="GitHub"
                  value={socialLinks.github ?? ""}
                  onChange={(e) => handleSocialChange("github", e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full"
                />
                <Input
                  label="LinkedIn"
                  value={socialLinks.linkedin ?? ""}
                  onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full"
                />
                <Input
                  label="Website / Portfolio"
                  value={socialLinks.website ?? ""}
                  onChange={(e) => handleSocialChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-main-100">
            <Button
              label={isSaving ? "Saving..." : "Save changes"}
              onClick={handleSave}
              disabled={isSaving}
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
