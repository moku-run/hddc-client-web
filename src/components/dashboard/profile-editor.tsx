"use client";

import { ProfileHeaderEditor } from "./profile-header-editor";
import { LayoutEditor } from "./layout-editor";
import { LinkListEditor } from "./link-list-editor";
import { ThemeEditor } from "./theme-editor";
import { SocialEditor } from "./social-editor";
import type { useProfileData } from "@/hooks/use-profile-data";

type ProfileActions = ReturnType<typeof useProfileData>;

export function ProfileEditor(props: ProfileActions) {
  return (
    <div className="flex flex-col gap-8 overflow-y-auto scrollbar-none p-6">
      <ProfileHeaderEditor
        profileData={props.profileData}
        updateProfile={props.updateProfile}
        headerLayout={props.profileData.headerLayout}
        setHeaderLayout={props.setHeaderLayout}
      />

      <hr className="border-border" />

      <LayoutEditor
        pageLayout={props.profileData.pageLayout}
        linkRound={props.profileData.linkRound}
        linkBorderColor={props.profileData.linkBorderColor}
        linkBorderThick={props.profileData.linkBorderThick}
        setPageLayout={props.setPageLayout}
        setLinkRound={props.setLinkRound}
        setLinkBorderColor={props.setLinkBorderColor}
        setLinkBorderThick={props.setLinkBorderThick}
      />

      <hr className="border-border" />

      <LinkListEditor
        links={props.profileData.links}
        addLink={props.addLink}
        updateLink={props.updateLink}
        removeLink={props.removeLink}
        toggleLink={props.toggleLink}
        reorderLinks={props.reorderLinks}
      />

      <hr className="border-border" />

      <ThemeEditor
        colorTheme={props.profileData.colorTheme}
        darkMode={props.profileData.darkMode}
        backgroundColor={props.profileData.backgroundColor}
        fontColor={props.profileData.fontColor}
        backgroundTexture={props.profileData.backgroundTexture}
        customPrimaryColor={props.profileData.customPrimaryColor}
        customSecondaryColor={props.profileData.customSecondaryColor}
        fontFamily={props.profileData.fontFamily}
        setColorTheme={props.setColorTheme}
        setDarkMode={props.setDarkMode}
        setBackgroundColor={props.setBackgroundColor}
        setFontColor={props.setFontColor}
        setBackgroundTexture={props.setBackgroundTexture}
        setCustomColors={props.setCustomColors}
        setFontFamily={props.setFontFamily}
      />

      <hr className="border-border" />

      <SocialEditor
        socials={props.profileData.socials}
        addSocial={props.addSocial}
        updateSocial={props.updateSocial}
        removeSocial={props.removeSocial}
        reorderSocials={props.reorderSocials}
      />

    </div>
  );
}
