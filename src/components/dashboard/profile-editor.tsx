"use client";

import { ProfileHeaderEditor } from "./profile-header-editor";
import { LinkListEditor } from "./link-list-editor";
import { SocialEditor } from "./social-editor";
import { ThemeEditor } from "./theme-editor";
import type { useProfileData } from "@/hooks/use-profile-data";

type ProfileActions = ReturnType<typeof useProfileData>;

export function ProfileEditor(props: ProfileActions) {
  return (
    <div className="flex flex-col gap-8 overflow-y-auto p-6">
      <ProfileHeaderEditor
        profileData={props.profileData}
        updateProfile={props.updateProfile}
        headerLayout={props.profileData.headerLayout}
        setHeaderLayout={props.setHeaderLayout}
      />

      <hr className="border-border" />

      <LinkListEditor
        links={props.profileData.links}
        linkLayout={props.profileData.linkLayout}
        linkStyle={props.profileData.linkStyle}
        linkAnimation={props.profileData.linkAnimation}
        addLink={props.addLink}
        updateLink={props.updateLink}
        removeLink={props.removeLink}
        toggleLink={props.toggleLink}
        reorderLinks={props.reorderLinks}
        setLinkLayout={props.setLinkLayout}
        setLinkStyle={props.setLinkStyle}
        setLinkAnimation={props.setLinkAnimation}
      />

      <hr className="border-border" />

      <SocialEditor
        socials={props.profileData.socials}
        addSocial={props.addSocial}
        updateSocial={props.updateSocial}
        removeSocial={props.removeSocial}
        reorderSocials={props.reorderSocials}
      />

      <hr className="border-border" />

      <ThemeEditor
        colorTheme={props.profileData.colorTheme}
        darkMode={props.profileData.darkMode}
        backgroundColor={props.profileData.backgroundColor}
        fontColor={props.profileData.fontColor}
        customPrimaryColor={props.profileData.customPrimaryColor}
        customSecondaryColor={props.profileData.customSecondaryColor}
        fontFamily={props.profileData.fontFamily}
        setColorTheme={props.setColorTheme}
        setDarkMode={props.setDarkMode}
        setBackgroundColor={props.setBackgroundColor}
        setFontColor={props.setFontColor}
        setCustomColors={props.setCustomColors}
        setFontFamily={props.setFontFamily}
      />

    </div>
  );
}
