import React, { useMemo, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import DashboardLayout from "../components/DashboardLayout";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { setUserDisplayName } from "../api/firebaseAuthApi";
import { updateUserProfileDoc } from "../api/firestoreUsersApi";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { setBanner } = useDashboard();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const email = user?.email ?? "";
  const uid = user?.uid ?? "";

  const derivedName = useMemo(() => {
    const trimmed = displayName.trim();
    if (trimmed) return trimmed;
    return user?.displayName?.trim() || "Your profile";
  }, [displayName, user?.displayName]);

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
        await setUserDisplayName(user, trimmedName);
        await updateUserProfileDoc(user, { displayName: trimmedName });
        setBanner({ type: "success", message: "Profile updated." });
      } catch {
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
    <DashboardLayout
      title="Profile"
      description="Review your account details and update your display name."
      actions={
        <Button
          label={isSaving ? "Saving..." : "Save changes"}
          onClick={handleSave}
          disabled={isSaving}
        />
      }
    >
      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card className="space-y-5 p-6 shadow-lg">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
              Account
            </p>
            <h2 className="mt-2 text-2xl font-bold text-main-700">{derivedName}</h2>
            <p className="mt-2 text-sm text-main-500">
              This name is shown in your dashboard sidebar.
            </p>
          </div>

          <Input
            label="Display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="e.g. Jane Doe"
          />
        </Card>

        <Card className="space-y-4 p-6 shadow-lg">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
              Details
            </p>
            <h3 className="mt-2 text-2xl font-bold text-main-700">Signed in as</h3>
          </div>

          <div className="space-y-3 text-sm text-main-600">
            <div className="rounded-2xl bg-main-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-main-500">
                Email
              </p>
              <p className="mt-2 break-all font-medium text-main-700">{email}</p>
            </div>
            <div className="rounded-2xl bg-main-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-main-500">
                User ID
              </p>
              <p className="mt-2 break-all font-medium text-main-700">{uid}</p>
            </div>
          </div>
        </Card>
      </section>
    </DashboardLayout>
  );
};

export default ProfilePage;
